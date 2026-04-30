import { initRouter } from './intentRouter';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export function initGemini() {
  initRouter(null);
}

export function isGeminiReady() {
  return true;
}

export async function runAgent(agent, inputs) {
  const userPrompt = agent.buildPrompt(inputs);
  try {
    const response = await fetch(`${BACKEND_URL}/api/decide`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemPrompt: agent.systemPrompt,
        userPrompt,
      }),
    });
    const data = await response.json();
    if (!data.success) return { success: false, error: data.error };
    const clean = data.text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);
    return { success: true, data: parsed, raw: data.text };
  } catch (e) {
    return { success: false, error: e.message };
  }
}