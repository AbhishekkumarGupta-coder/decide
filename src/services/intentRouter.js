import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * intentRouter.js
 * Reads a free-text user input and returns which agent to invoke.
 * Drop-in addition to your existing gemini.js service.
 */

const ROUTER_PROMPT = `You are an intent classifier for a food decision app called Decide.
You have 7 agents available:
- solo: User wants a personal food recommendation (mentions mood, hunger, budget, alone)
- group: Multiple people ordering together (mentions friends, family, group, team, people)
- budget: Very tight budget, money constraint is primary concern (mentions ₹, cheap, broke, limited money)
- reorder: User mentions past orders, wants upgrade or pattern analysis (mentions "usually", "always order", "last time", "same thing")
- combo: User wants a full meal with multiple items, sides, drinks (mentions combo, full meal, complete order, party)
- regret: User is about to order something and wants validation (mentions "should I", "thinking of ordering", "is it a good idea", "too much")
- instant: Single word or very short input, user wants fastest possible answer (1-3 words like "hungry", "tired", "sad", "celebrate")

Given the user's input, return ONLY a JSON object:
{
  "agent": "solo",
  "confidence": 92,
  "reason": "one sentence why you picked this agent"
}

agent must be exactly one of: solo, group, budget, reorder, combo, regret, instant`;

let routerModel = null;

export function initRouter(apiKey) {
  const genAI = new GoogleGenerativeAI(apiKey);
  routerModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
}

export async function detectIntent(userInput) {
  if (!routerModel) {
    // fallback: guess from keywords if model not ready
    return fallbackRouter(userInput);
  }

  try {
    const result = await routerModel.generateContent({
      contents: [{ role: 'user', parts: [{ text: userInput }] }],
      systemInstruction: { parts: [{ text: ROUTER_PROMPT }] },
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 128,
        responseMimeType: 'application/json',
      },
    });

    const text = result.response.text();
    const parsed = JSON.parse(text);
    return parsed;
  } catch (e) {
    return fallbackRouter(userInput);
  }
}

// Keyword-based fallback if Gemini call fails
function fallbackRouter(input) {
  const lower = input.toLowerCase().trim();

  if (lower.split(' ').length <= 2) return { agent: 'instant', confidence: 80, reason: 'Very short input' };
  if (/friend|group|team|family|people|together|we are|we're|\d+ of us/.test(lower)) return { agent: 'group', confidence: 85, reason: 'Group keywords detected' };
  if (/broke|cheap|tight|budget|₹|only have|less than|under \d/.test(lower)) return { agent: 'budget', confidence: 85, reason: 'Budget keywords detected' };
  if (/always|usually|same|last time|reorder|habit|pattern/.test(lower)) return { agent: 'reorder', confidence: 85, reason: 'Reorder keywords detected' };
  if (/combo|full meal|complete|sides|drinks|party|spread/.test(lower)) return { agent: 'combo', confidence: 85, reason: 'Combo keywords detected' };
  if (/should i|thinking of|about to order|good idea|regret|too much|too oily|too late/.test(lower)) return { agent: 'regret', confidence: 85, reason: 'Regret keywords detected' };

  return { agent: 'solo', confidence: 70, reason: 'Default to solo decision' };
}