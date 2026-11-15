import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import {
  advanceMissionDay,
  constructOrUpgradeModule,
  createInitialMission,
  generateMissionReport,
  resolveEventChoice,
  runWhatIfComparison,
  SIMULATION_COEFFICIENTS,
} from './src/shared/simulation.ts';
import {
  CURATED_NASA_FALLBACK_MEDIA,
  LEARNING_TOPICS,
  NASA_OFFICIAL_REFERENCES,
  PLANETARY_COMPARISON,
} from './src/shared/nasaData.ts';
import { MissionConfig, MissionState, ModuleId, NASAAssetDetail, NASAMediaItem, WhatIfInput } from './src/shared/types.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize SQLite database for mission persistence, learning progress, and NASA cache
const db = new Database(path.join(__dirname, 'astraforge.db'));
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS missions (
    id TEXT PRIMARY KEY,
    destination TEXT NOT NULL,
    status TEXT NOT NULL,
    state_json TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS learning_progress (
    session_id TEXT NOT NULL,
    topic_id TEXT NOT NULL,
    completed INTEGER NOT NULL DEFAULT 0,
    quiz_score INTEGER NOT NULL DEFAULT 0,
    updated_at TEXT NOT NULL,
    PRIMARY KEY (session_id, topic_id)
  );

  CREATE TABLE IF NOT EXISTS nasa_cache (
    cache_key TEXT PRIMARY KEY,
    payload_json TEXT NOT NULL,
    cached_at INTEGER NOT NULL
  );
`);

function saveMission(state: MissionState) {
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO missions (id, destination, status, state_json, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       destination = excluded.destination,
       status = excluded.status,
       state_json = excluded.state_json,
       updated_at = excluded.updated_at`
  ).run(state.id, state.config.destination, state.status, JSON.stringify(state), now, now);
}

function loadMission(id: string): MissionState | null {
  const row = db.prepare('SELECT state_json FROM missions WHERE id = ?').get(id) as { state_json: string } | undefined;
  if (!row) return null;
  return JSON.parse(row.state_json) as MissionState;
}

// Gemini client initialization (server-side only)
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function buildRuleBasedMentorResponse(
  state: MissionState | null,
  actionType: string,
  question?: string
): { answer: string; source: 'rule-based-fallback'; groundingNotes: string[] } {
  const groundingNotes = [
    'All telemetry numbers reflect ASTRAFORGE’s illustrative educational simulation coefficients.',
    'Planetary comparisons are grounded in NASA Moon Facts and NASA Mars Facts.',
  ];

  if (!state) {
    return {
      answer:
        'Start a mission in Mission Briefing to receive telemetry-specific coaching. On the Moon, expect intense sunlight (~1,361 W/m²) paired with extreme thermal swings and periodic shadow windows. On Mars, solar flux is roughly 43% of Earth/Moon levels, making early solar and water-recycling upgrades crucial.',
      source: 'rule-based-fallback',
      groundingNotes,
    };
  }

  const metricsById = Object.fromEntries(state.metrics.map((m) => [m.id, m]));
  const critical = state.metrics.filter((m) => m.status === 'Critical');
  const caution = state.metrics.filter((m) => m.status === 'Caution');
  const destName = state.config.destination === 'moon' ? 'the Moon' : 'Mars';

  if (actionType === 'explain_decision') {
    const last = state.decisions[state.decisions.length - 1];
    if (!last) {
      return {
        answer: `Your outpost on ${destName} is on Day ${state.currentDay}. Construct your first upgrade or advance a day to analyze engineering impacts.`,
        source: 'rule-based-fallback',
        groundingNotes,
      };
    }
    return {
      answer: `Latest Action — ${last.title}: ${last.detail} (${last.impact}). Remember: in our illustrative simulation model, adding active life-support modules (such as Greenhouses or Water Recyclers) improves consumable sustainability while increasing daily electrical load (kWh/day), so keep Solar Arrays and Battery Storage balanced.`,
      source: 'rule-based-fallback',
      groundingNotes,
    };
  }

  if (actionType === 'compare_strategies') {
    return {
      answer:
        `Strategy Comparison for ${destName} (${state.config.crewSize} crew):\n` +
        `1) Closed-Loop Early Strategy: Prioritize Water Recycling Unit Lv 2 + Solar Array upgrades in the first 5 days. Because Oxygen Generation uses water electrolysis (~1.12 L water per kg O₂ in our model), preserving water protects both hydration and breathable air.\n` +
        `2) Food-First Strategy: Building a Hydroponic Greenhouse early cuts food ration depletion and adds a small O₂ bonus, but demands 11 kWh/day and 1.4 L/day water—risking an energy shortfall if Solar/Batteries are not upgraded alongside it.`,
      source: 'rule-based-fallback',
      groundingNotes,
    };
  }

  if (actionType === 'explain_science') {
    if (state.activeEvent) {
      return {
        answer: `Science Behind "${state.activeEvent.title}": ${state.activeEvent.scientificContext} In real NASA missions (such as ISS ECLSS and Artemis/Mars surface concepts), engineers design redundant buffers and storm shelters because neither ${destName} nor interplanetary space has Earth’s protective atmosphere or global magnetic field.`,
        source: 'rule-based-fallback',
        groundingNotes,
      };
    }
    return {
      answer:
        `Core Science for ${destName}: Your habitat balances six coupled systems. Water is split by electrolysis (2H₂O → 2H₂ + O₂) to supply oxygen, while Water Recycling recovers cabin humidity and wastewater. On ${destName}, ${
          state.config.destination === 'mars'
            ? 'Mars receives ~43% of Earth’s solar irradiance and experiences dust storms that scatter sunlight.'
            : 'the Moon has virtually no atmosphere and experiences extreme thermal swings (-173°C to +127°C).'
        }`,
      source: 'rule-based-fallback',
      groundingNotes,
    };
  }

  // Default / hint / custom question
  const priority = critical[0] || caution[0];
  let advice = '';
  if (state.activeEvent) {
    advice = `Immediate Priority: Resolve "${state.activeEvent.title}" in the Emergency Room (${state.activeEvent.daysRemainingToRespond} day(s) left). `;
  } else if (priority) {
    advice = `Highest Priority Subsystem: ${priority.label} is currently ${priority.status} (${priority.current} ${priority.unit}; ${priority.reason}). `;
  } else {
    advice = `All six survival systems on ${destName} are currently Nominal (Stability ${state.stabilityScore}%). `;
  }

  const energyNet = metricsById.energy?.netDaily ?? 0;
  const waterNet = metricsById.water?.netDaily ?? 0;

  if (energyNet < 0) {
    advice += `Your Energy balance is negative (${energyNet} kWh/day); upgrading the Solar Power Array or Battery Storage prevents life-support throttling.`;
  } else if (waterNet < -2) {
    advice += `Net water is dropping by ${Math.abs(waterNet)} L/day; upgrading the Water Recycling Unit will protect both drinking reserves and O₂ electrolysis.`;
  } else {
    advice += `Consider building Radiation Shielding or an Emergency Storm Shelter before solar particle events occur.`;
  }

  if (question) {
    advice = `Regarding "${question}": ${advice}`;
  }

  return { answer: advice, source: 'rule-based-fallback', groundingNotes };
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  // 1. Health endpoint
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'ASTRAFORGE Mission Backend',
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
      timestamp: new Date().toISOString(),
    });
  });

  // 2. Create Mission
  app.post('/api/mission/create', (req, res) => {
    try {
      const body = req.body as Partial<MissionConfig>;
      const destination = body.destination === 'mars' ? 'mars' : 'moon';
      const crewSize = body.crewSize === 2 || body.crewSize === 6 ? body.crewSize : 4;
      const durationDays = body.durationDays === 10 || body.durationDays === 60 ? body.durationDays : 30;
      const difficulty =
        body.difficulty === 'explorer' || body.difficulty === 'commander' ? body.difficulty : 'specialist';
      const budget = body.budget === 'limited' || body.budget === 'advanced' ? body.budget : 'standard';
      const seed = typeof body.seed === 'number' && Number.isFinite(body.seed) ? Math.floor(body.seed) : 2026;

      const mission = createInitialMission({ destination, crewSize, durationDays, difficulty, budget, seed });
      saveMission(mission);
      res.status(201).json(mission);
    } catch (err) {
      res.status(400).json({ error: err instanceof Error ? err.message : 'Failed to create mission' });
    }
  });

  // 3. Get Mission
  app.get('/api/mission/:mission_id', (req, res) => {
    const mission = loadMission(req.params.mission_id);
    if (!mission) {
      return res.status(404).json({ error: 'Mission not found' });
    }
    res.json(mission);
  });

  // 4. Advance Mission Day(s)
  app.post('/api/mission/:mission_id/advance', (req, res) => {
    const mission = loadMission(req.params.mission_id);
    if (!mission) return res.status(404).json({ error: 'Mission not found' });

    const days = Number(req.body?.days ?? 1);
    if (!Number.isFinite(days) || days < 1 || days > 10) {
      return res.status(400).json({ error: 'days must be between 1 and 10' });
    }

    const updated = advanceMissionDay(mission, days);
    saveMission(updated);
    res.json(updated);
  });

  // 5. Build or Upgrade Outpost Module
  app.post('/api/mission/:mission_id/build', (req, res) => {
    const mission = loadMission(req.params.mission_id);
    if (!mission) return res.status(404).json({ error: 'Mission not found' });

    const moduleId = req.body?.moduleId as ModuleId;
    if (!moduleId) return res.status(400).json({ error: 'moduleId is required' });

    const { state: updated, error } = constructOrUpgradeModule(mission, moduleId);
    if (error) return res.status(400).json({ error });

    saveMission(updated);
    res.json(updated);
  });

  // 6. Respond to Dynamic Mission Event
  app.post('/api/mission/:mission_id/respond', (req, res) => {
    const mission = loadMission(req.params.mission_id);
    if (!mission) return res.status(404).json({ error: 'Mission not found' });

    const { eventId, choiceId } = req.body ?? {};
    if (!eventId || !choiceId) return res.status(400).json({ error: 'eventId and choiceId are required' });

    const { state: updated, error } = resolveEventChoice(mission, eventId, choiceId);
    if (error) return res.status(400).json({ error });

    saveMission(updated);
    res.json(updated);
  });

  // 7. Mission Report
  app.get('/api/mission/:mission_id/report', (req, res) => {
    const mission = loadMission(req.params.mission_id);
    if (!mission) return res.status(404).json({ error: 'Mission not found' });
    res.json(generateMissionReport(mission));
  });

  // 8. What-If Simulation Comparison
  app.post('/api/simulation/what-if', (req, res) => {
    try {
      const baseline = req.body?.baseline as WhatIfInput;
      const modified = req.body?.modified as WhatIfInput;
      if (!baseline || !modified) {
        return res.status(400).json({ error: 'baseline and modified scenario inputs are required' });
      }
      const result = runWhatIfComparison(baseline, modified);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err instanceof Error ? err.message : 'Invalid What-If parameters' });
    }
  });

  // 9. AI Mission Mentor (Gemini + grounded rule-based fallback)
  app.post('/api/mentor/explain', async (req, res) => {
    const { missionId, actionType = 'hint', question = '', missionState: clientState } = req.body ?? {};
    const state = missionId ? loadMission(missionId) || (clientState as MissionState | null) : (clientState as MissionState | null);

    const ai = getGeminiClient();
    if (!ai) {
      return res.json(buildRuleBasedMentorResponse(state, actionType, question));
    }

    try {
      const planetFacts = PLANETARY_COMPARISON.map(
        (r) => `${r.parameter} — Moon: ${r.moon} | Mars: ${r.mars}`
      ).join('\n');

      const telemetrySummary = state
        ? JSON.stringify({
            destination: state.config.destination,
            day: state.currentDay,
            duration: state.config.durationDays,
            crewSize: state.config.crewSize,
            crewHealth: state.crewHealth,
            outpostCondition: state.outpostCondition,
            stabilityScore: state.stabilityScore,
            buildCredits: state.buildCredits,
            metrics: state.metrics.map((m) => ({
              label: m.label,
              current: m.current,
              unit: m.unit,
              dailyProduction: m.dailyProduction,
              dailyConsumption: m.dailyConsumption,
              netDaily: m.netDaily,
              status: m.status,
              reason: m.reason,
            })),
            activeEvent: state.activeEvent
              ? {
                  title: state.activeEvent.title,
                  severity: state.activeEvent.severity,
                  description: state.activeEvent.description,
                  affectedSystems: state.activeEvent.affectedSystems,
                }
              : null,
            recentDecisions: state.decisions.slice(-4),
          })
        : 'No active mission yet.';

      const taskInstructionMap: Record<string, string> = {
        explain_decision: 'Explain the engineering impact and trade-offs of the student’s most recent decision.',
        hint: 'Identify which survival resource or active emergency needs attention first and suggest a concrete engineering priority.',
        explain_science: 'Explain the underlying space science (electrolysis, closed-loop water recycling, solar flux, or radiation shielding) relevant to the current mission state.',
        compare_strategies: 'Compare two viable engineering strategies for the current mission state and highlight their resource trade-offs.',
        question: `Answer the student's question accurately using the provided telemetry and NASA facts: "${question}"`,
      };

      const systemInstruction = `You are MISSION MENTOR, an encouraging space-science and systems-engineering educator inside ASTRAFORGE.
STRICT RULES:
1. Never invent NASA facts, measurements, or mission statistics. Only cite planetary facts provided in the VERIFIED REFERENCE DATA below.
2. Explicitly distinguish between real NASA facts and ASTRAFORGE's illustrative educational simulation assumptions (such as ${SIMULATION_COEFFICIENTS.oxygenKgPerPersonPerDay} kg O2/day/person or kWh module rates).
3. Never claim you modified simulation values or completed actions on the user's behalf.
4. Keep explanations crisp, student-friendly, and structured in 2–4 short paragraphs or concise bullet points (under 180 words).`;

      const prompt = `VERIFIED NASA PLANETARY REFERENCE DATA:
${planetFacts}

CURRENT SIMULATION STATE:
${telemetrySummary}

STUDENT REQUEST (${actionType}):
${taskInstructionMap[actionType] || taskInstructionMap.question}`;

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: prompt,
        config: {
          systemInstruction,
        },
      });

      const text = response.text?.trim();
      if (!text) {
        return res.json(buildRuleBasedMentorResponse(state, actionType, question));
      }

      res.json({
        answer: text,
        source: 'gemini-4-hydrogen',
        groundingNotes: [
          'Grounded in live simulation telemetry and NASA Moon/Mars reference facts.',
          'Simulation rates are illustrative educational assumptions.',
        ],
      });
    } catch (err) {
      console.warn('Gemini Mentor fallback triggered:', err instanceof Error ? err.message : err);
      res.json(buildRuleBasedMentorResponse(state, actionType, question));
    }
  });

  // 10. NASA Image and Video Library Search Proxy
  app.get('/api/nasa/search', async (req, res) => {
    const q = String(req.query.q || 'Moon surface').trim();
    const mediaType = req.query.media_type === 'video' ? 'video' : 'image';
    const cacheKey = `search:${mediaType}:${q.toLowerCase()}`;

    const cached = db
      .prepare('SELECT payload_json, cached_at FROM nasa_cache WHERE cache_key = ?')
      .get(cacheKey) as { payload_json: string; cached_at: number } | undefined;

    if (cached && Date.now() - cached.cached_at < 1000 * 60 * 60 * 6) {
      return res.json(JSON.parse(cached.payload_json));
    }

    try {
      const url = `https://images-api.nasa.gov/search?q=${encodeURIComponent(q)}&media_type=${mediaType}&page_size=12`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const apiRes = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);

      if (!apiRes.ok) throw new Error(`NASA API HTTP ${apiRes.status}`);
      const json = (await apiRes.json()) as {
        collection?: {
          items?: Array<{
            data?: Array<{
              nasa_id?: string;
              title?: string;
              description?: string;
              media_type?: 'image' | 'video';
              center?: string;
              date_created?: string;
              photographer?: string;
              keywords?: string[];
            }>;
            links?: Array<{ href?: string; rel?: string }>;
          }>;
        };
      };

      const rawItems = json.collection?.items ?? [];
      const items: NASAMediaItem[] = rawItems
        .slice(0, 12)
        .map((entry) => {
          const meta = entry.data?.[0];
          const previewLink = entry.links?.find((l) => l.rel === 'preview')?.href || entry.links?.[0]?.href;
          if (!meta?.nasa_id || !meta.title) return null;
          const isMars = (q + meta.title).toLowerCase().includes('mars');
          const fallbackImg = isMars
            ? '/src/assets/images/mars_outpost_horizon_1794761660330.jpg'
            : '/src/assets/images/hero_lunar_outpost_1794761660112.jpg';

          return {
            nasaId: meta.nasa_id,
            title: meta.title,
            description: meta.description || 'Official NASA multimedia archive record.',
            mediaType: meta.media_type === 'video' ? 'video' : 'image',
            thumbnailUrl: previewLink || fallbackImg,
            fallbackImageUrl: fallbackImg,
            center: meta.center || 'NASA',
            dateCreated: meta.date_created ? meta.date_created.slice(0, 10) : undefined,
            photographer: meta.photographer,
            keywords: meta.keywords || [],
            nasaPageUrl: `https://images.nasa.gov/details/${encodeURIComponent(meta.nasa_id)}`,
            sourceLabel: 'NASA MEDIA SOURCE' as const,
            credit: meta.photographer
              ? `${meta.photographer} (${meta.center || 'NASA'})`
              : `NASA ${meta.center || 'Image and Video Library'}`,
            restrictionsNote:
              'NASA imagery is generally available for educational use; check NASA asset metadata for any third-party copyright.',
          } as NASAMediaItem;
        })
        .filter((x): x is NASAMediaItem => x !== null);

      const resultPayload = {
        query: q,
        mediaType,
        source: items.length > 0 ? 'nasa-live-api' : 'nasa-curated-fallback',
        items:
          items.length > 0
            ? items
            : CURATED_NASA_FALLBACK_MEDIA.filter((i) => i.mediaType === mediaType),
      };

      db.prepare(
        `INSERT INTO nasa_cache (cache_key, payload_json, cached_at)
         VALUES (?, ?, ?)
         ON CONFLICT(cache_key) DO UPDATE SET payload_json = excluded.payload_json, cached_at = excluded.cached_at`
      ).run(cacheKey, JSON.stringify(resultPayload), Date.now());

      res.json(resultPayload);
    } catch (err) {
      const fallback = CURATED_NASA_FALLBACK_MEDIA.filter((i) => i.mediaType === mediaType);
      res.json({
        query: q,
        mediaType,
        source: 'nasa-curated-fallback',
        notice: 'Live NASA Image API unavailable right now; displaying verified NASA reference records.',
        items: fallback,
      });
    }
  });

  // 11. NASA Asset Manifest + Metadata + Captions Inspector
  app.get('/api/nasa/asset/:nasa_id', async (req, res) => {
    const nasaId = req.params.nasa_id;
    const curatedMatch = CURATED_NASA_FALLBACK_MEDIA.find((m) => m.nasaId === nasaId);

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const [assetRes, metaRes, captionsRes] = await Promise.allSettled([
        fetch(`https://images-api.nasa.gov/asset/${encodeURIComponent(nasaId)}`, { signal: controller.signal }),
        fetch(`https://images-api.nasa.gov/metadata/${encodeURIComponent(nasaId)}`, { signal: controller.signal }),
        fetch(`https://images-api.nasa.gov/captions/${encodeURIComponent(nasaId)}`, { signal: controller.signal }),
      ]);
      clearTimeout(timeout);

      let assetItems: Array<{ href: string }> = [];
      if (assetRes.status === 'fulfilled' && assetRes.value.ok) {
        const assetJson = (await assetRes.value.json()) as { collection?: { items?: Array<{ href: string }> } };
        assetItems = assetJson.collection?.items ?? [];
      }

      // Inspect manifest carefully for supported browser-playable MP4 or high-res JPG
      const playableVideo =
        assetItems.find((i) => i.href.endsWith('~medium.mp4'))?.href ||
        assetItems.find((i) => i.href.endsWith('~small.mp4'))?.href ||
        assetItems.find((i) => i.href.endsWith('.mp4'))?.href ||
        null;

      const highResImage =
        assetItems.find((i) => i.href.endsWith('~large.jpg'))?.href ||
        assetItems.find((i) => i.href.endsWith('~medium.jpg'))?.href ||
        assetItems.find((i) => /\.(jpg|jpeg|png)$/i.test(i.href))?.href ||
        null;

      let captionsUrl: string | null = null;
      if (captionsRes.status === 'fulfilled' && captionsRes.value.ok) {
        const capJson = (await captionsRes.value.json()) as { location?: string };
        captionsUrl = capJson.location ?? null;
      }

      let credit = curatedMatch?.credit || 'NASA Image and Video Library';
      let title = curatedMatch?.title || nasaId;
      let description = curatedMatch?.description || 'NASA Multimedia Library Asset';
      if (metaRes.status === 'fulfilled' && metaRes.value.ok) {
        const metaLoc = (await metaRes.value.json()) as { location?: string };
        if (metaLoc.location) {
          try {
            const mFetch = await fetch(metaLoc.location);
            if (mFetch.ok) {
              const mData = (await mFetch.json()) as Record<string, string>;
              title = mData['AVAIL:Title'] || title;
              description = mData['AVAIL:Description'] || description;
              if (mData['AVAIL:Photographer'] || mData['AVAIL:Center']) {
                credit = [mData['AVAIL:Photographer'], mData['AVAIL:Center']].filter(Boolean).join(' · ');
              }
            }
          } catch {
            // keep default metadata
          }
        }
      }

      const detail: NASAAssetDetail = {
        nasaId,
        mediaType: playableVideo ? 'video' : curatedMatch?.mediaType || 'image',
        title,
        description,
        playableVideoUrl: playableVideo,
        highResImageUrl: highResImage,
        captionsUrl,
        nasaPageUrl: `https://images.nasa.gov/details/${encodeURIComponent(nasaId)}`,
        credit,
        restrictionsNote:
          'NASA media is generally not copyrighted for educational purposes. Refer to the original NASA asset page for specific credit or third-party restrictions.',
        manifestCount: assetItems.length,
      };

      res.json(detail);
    } catch {
      res.json({
        nasaId,
        mediaType: curatedMatch?.mediaType || 'image',
        title: curatedMatch?.title || nasaId,
        description: curatedMatch?.description || 'NASA Multimedia Archive Asset',
        playableVideoUrl: null,
        highResImageUrl: curatedMatch?.thumbnailUrl || null,
        captionsUrl: null,
        nasaPageUrl: `https://images.nasa.gov/details/${encodeURIComponent(nasaId)}`,
        credit: curatedMatch?.credit || 'NASA Image and Video Library',
        restrictionsNote:
          'Unable to reach live NASA manifest; open the official NASA asset link to inspect original files.',
        manifestCount: 0,
      } satisfies NASAAssetDetail);
    }
  });

  // 12. Learning Resources & Progress
  app.get('/api/learning/resources', (req, res) => {
    const sessionId = String(req.query.sessionId || 'default-cadet');
    const progressRows = db
      .prepare('SELECT topic_id, completed, quiz_score FROM learning_progress WHERE session_id = ?')
      .all(sessionId) as Array<{ topic_id: string; completed: number; quiz_score: number }>;

    res.json({
      topics: LEARNING_TOPICS,
      planetaryComparison: PLANETARY_COMPARISON,
      officialReferences: NASA_OFFICIAL_REFERENCES,
      progress: progressRows,
    });
  });

  app.post('/api/learning/progress', (req, res) => {
    const { sessionId = 'default-cadet', topicId, completed = true, quizScore = 0 } = req.body ?? {};
    if (!topicId) return res.status(400).json({ error: 'topicId is required' });

    db.prepare(
      `INSERT INTO learning_progress (session_id, topic_id, completed, quiz_score, updated_at)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(session_id, topic_id) DO UPDATE SET
         completed = excluded.completed,
         quiz_score = MAX(learning_progress.quiz_score, excluded.quiz_score),
         updated_at = excluded.updated_at`
    ).run(String(sessionId), String(topicId), completed ? 1 : 0, Number(quizScore), new Date().toISOString());

    res.json({ ok: true });
  });

  // Vite integration in development / static serving in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const port = Number(process.env.PORT || 3000);
  app.listen(port, '0.0.0.0', () => {
    console.log(`ASTRAFORGE server listening on http://0.0.0.0:${port}`);
  });
}

startServer();
