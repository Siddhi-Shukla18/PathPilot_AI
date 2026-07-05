/**
 * adk.ts — ADK REST API client
 *
 * All communication with the Google ADK backend lives here.
 * The frontend never calls ADK endpoints directly outside this file.
 *
 * Architecture:
 *  - sendMessage() always returns an AsyncGenerator<StreamChunk>
 *  - If the backend returns a full response, we simulate streaming token-by-token
 *  - When ADK adds real SSE streaming, only this file changes
 *  - Agent routing info is extracted from the ADK response `author` field
 */

import type { StreamChunk } from '../types';

const ADK_BASE = '/api';
const APP_NAME = 'ai_career_coach';

export interface ADKRunRequest {
  appName: string;
  userId: string;
  sessionId: string;
  newMessage: {
    role: 'user';
    parts: Array<{ text: string }>;
  };
  streaming?: boolean;
}

export interface ADKEvent {
  type?: string;
  content?: {
    role?: string;
    parts?: Array<{ text?: string }>;
  };
  author?: string;
  actions?: {
    transfer_to_agent?: string;
  };
}

export interface ADKRunResponse {
  sessionId: string;
  events?: ADKEvent[];
}

// ─── Session Management ─────────────────────────────────────────────────────

/** Create a new ADK session for a user */
export async function createSession(userId: string, sessionId: string): Promise<void> {
  try {
    const res = await fetch(
      `${ADK_BASE}/apps/${APP_NAME}/users/${userId}/sessions/${sessionId}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      }
    );
    if (!res.ok && res.status !== 409) {
      // 409 = already exists, that's fine
      console.warn('[ADK] Session create returned', res.status);
    }
  } catch (err) {
    console.warn('[ADK] Could not create session (backend may not be running):', err);
  }
}

/** List all sessions for a user */
export async function listSessions(userId: string): Promise<string[]> {
  try {
    const res = await fetch(`${ADK_BASE}/apps/${APP_NAME}/users/${userId}/sessions`);
    if (!res.ok) return [];
    const data = await res.json();
    return data?.sessions?.map((s: { id: string }) => s.id) ?? [];
  } catch {
    return [];
  }
}

// ─── Message Streaming ───────────────────────────────────────────────────────

/**
 * Send a message to the ADK backend.
 * Returns an AsyncGenerator that yields StreamChunks.
 *
 * This is streaming-first: even if the backend returns a complete response,
 * we simulate character-by-character streaming for a premium feel.
 * When the backend adds real SSE, replace the body of this function only.
 */
export async function* sendMessage(
  userId: string,
  sessionId: string,
  message: string
): AsyncGenerator<StreamChunk> {
  const url = `${ADK_BASE}/run`;

  const body: ADKRunRequest = {
    appName: APP_NAME,
    userId,
    sessionId,
    newMessage: {
      role: 'user',
      parts: [{ text: message }],
    },
  };

  let responseText = '';
  let respondingAgent: string | undefined;
  let routingPath: string[] = ['career_coach'];

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorText = await res.text();
      yield {
        text: `⚠️ Backend error (${res.status}): ${errorText || 'Unknown error'}`,
        done: true,
        error: errorText,
      };
      return;
    }

    // ── Try SSE / chunked streaming first ──────────────────────────────────
    const contentType = res.headers.get('content-type') ?? '';

    if (contentType.includes('text/event-stream')) {
      // Real SSE path (future-proof)
      yield* handleSSEStream(res, routingPath);
      return;
    }

    // ── Full JSON response path (current ADK behavior) ────────────────────
    const rawJson: ADKEvent[] | ADKRunResponse = await res.json();
    const events: ADKEvent[] = Array.isArray(rawJson)
      ? rawJson
      : rawJson.events ?? [];

    // Extract agent routing from events
    for (const event of events) {
      if (event.author && event.author !== 'user') {
        if (event.author !== 'career_coach' && !routingPath.includes(event.author)) {
          routingPath.push(event.author);
          respondingAgent = event.author;
        }
      }
      // Collect final text from last model turn
      if (event.content?.role === 'model' || event.content?.role === 'assistant') {
        const parts = event.content.parts ?? [];
        for (const part of parts) {
          if (part.text) responseText += part.text;
        }
      }
    }

    // If no model content found, look for any text parts
    if (!responseText) {
      for (const event of events) {
        const parts = event.content?.parts ?? [];
        for (const part of parts) {
          if (part.text) responseText += part.text;
        }
      }
    }

    if (!responseText) {
      responseText = '_No response received from the agent. Please try again._';
    }

    // ── Simulate streaming: yield word-by-word for premium feel ──────────
    yield* simulateStreaming(responseText, respondingAgent ?? routingPath.at(-1));
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Network error';
    yield {
      text: `⚠️ Could not connect to PathPilot AI backend.\n\n**Error:** ${errorMsg}\n\nMake sure the ADK server is running: \`adk web\``,
      done: true,
      error: errorMsg,
    };
  }
}

// ─── SSE Handler (future-proof) ──────────────────────────────────────────────

async function* handleSSEStream(
  res: Response,
  routingPath: string[]
): AsyncGenerator<StreamChunk> {
  const reader = res.body?.getReader();
  if (!reader) return;

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const data = line.slice(6).trim();
      if (data === '[DONE]') {
        yield { text: '', done: true };
        return;
      }
      try {
        const event: ADKEvent = JSON.parse(data);
        const text = event.content?.parts?.map((p) => p.text ?? '').join('') ?? '';
        const agentId = event.author ?? routingPath.at(-1);
        if (text) {
          if (agentId && !routingPath.includes(agentId)) routingPath.push(agentId);
          yield { text, done: false, agentId };
        }
      } catch {
        // Skip malformed SSE events
      }
    }
  }

  yield { text: '', done: true };
}

// ─── Streaming Simulation ────────────────────────────────────────────────────

/**
 * Simulates streaming by yielding chunks of the full response.
 * Chunks at word boundaries to look natural.
 */
async function* simulateStreaming(
  text: string,
  agentId?: string
): AsyncGenerator<StreamChunk> {
  // Split into ~3-6 word chunks for realistic streaming feel
  const words = text.split(' ');
  const CHUNK_SIZE = 4;

  for (let i = 0; i < words.length; i += CHUNK_SIZE) {
    const chunk = words.slice(i, i + CHUNK_SIZE).join(' ');
    const isLast = i + CHUNK_SIZE >= words.length;

    yield {
      text: (i === 0 ? '' : ' ') + chunk,
      done: isLast,
      agentId,
    };

    // Variable delay: faster in the middle, slightly slower at start
    const delay = i === 0 ? 80 : Math.random() * 20 + 10;
    await sleep(delay);
  }

  if (words.length === 0) {
    yield { text: '', done: true, agentId };
  }
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
