/**
 * userContext.js
 * Shared state that all 7 agents read from and write back to.
 * Persists to sessionStorage so it survives page refresh.
 * 
 * Usage:
 *   import { getContext, updateContext, saveDecision, getHistory } from './userContext';
 */

const STORAGE_KEY = 'decide_user_context';
const HISTORY_KEY = 'decide_decision_history';

// Default context
const DEFAULT_CONTEXT = {
  name: '',
  city: '',
  dietary_pref: 'No preference',
  budget: 300,
  hunger_level: 3,
  mood: '',
  last_agent_used: null,
  session_start: new Date().toISOString(),
};

/**
 * Get the current user context.
 * Merges sessionStorage data with defaults.
 */
export function getContext() {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_CONTEXT, ...JSON.parse(stored) };
    }
  } catch (e) {}
  return { ...DEFAULT_CONTEXT };
}

/**
 * Update context with new values.
 * Partial update — only keys you pass get changed.
 * 
 * Example:
 *   updateContext({ city: 'Mumbai', budget: 500 });
 */
export function updateContext(patch) {
  const current = getContext();
  const updated = { ...current, ...patch };
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {}
  return updated;
}

/**
 * Learn from agent inputs — auto-update context from whatever user filled in.
 * Call this after every agent run with the inputs object.
 * 
 * Example:
 *   learnFromInputs('solo', { city: 'Delhi', budget: '200', dietary_preference: 'Vegetarian' });
 */
export function learnFromInputs(agentId, inputs) {
  const patch = { last_agent_used: agentId };

  if (inputs.city)               patch.city = inputs.city;
  if (inputs.budget)             patch.budget = parseInt(inputs.budget) || getContext().budget;
  if (inputs.hunger_level)       patch.hunger_level = parseInt(inputs.hunger_level);
  if (inputs.mood)               patch.mood = inputs.mood;
  if (inputs.dietary_preference) patch.dietary_pref = inputs.dietary_preference;

  return updateContext(patch);
}

/**
 * Pre-fill agent fields from stored context.
 * Returns an object with field keys matched to context values.
 * 
 * Example:
 *   const prefilled = prefillFromContext(soloAgent.fields);
 *   // { city: 'Bangalore', budget: 300, dietary_preference: 'Vegetarian', ... }
 */
export function prefillFromContext(fields) {
  const ctx = getContext();
  const prefilled = {};

  fields.forEach((field) => {
    if (field.key === 'city' && ctx.city)               prefilled[field.key] = ctx.city;
    if (field.key === 'budget' && ctx.budget)           prefilled[field.key] = ctx.budget;
    if (field.key === 'hunger_level')                   prefilled[field.key] = ctx.hunger_level;
    if (field.key === 'mood' && ctx.mood)               prefilled[field.key] = ctx.mood;
    if (field.key === 'dietary_preference' && ctx.dietary_pref) prefilled[field.key] = ctx.dietary_pref;
  });

  return prefilled;
}

/**
 * Save a completed decision to history.
 * The reorder + regret agents use this automatically.
 */
export function saveDecision(agentId, inputs, result) {
  const history = getHistory();
  const entry = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    agent: agentId,
    inputs,
    result,
  };
  history.unshift(entry); // newest first
  const trimmed = history.slice(0, 20); // keep last 20 decisions
  try {
    sessionStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
  } catch (e) {}
  return entry;
}

/**
 * Get decision history for reorder + regret agents.
 */
export function getHistory() {
  try {
    const stored = sessionStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
}

/**
 * Format history as a readable string for agent prompts.
 * Pass this into reorderAgent and regretAgent buildPrompt.
 */
export function getHistorySummary() {
  const history = getHistory();
  if (history.length === 0) return 'No past orders recorded yet.';

  return history
    .slice(0, 5)
    .map((h, i) => {
      const dish = h.result?.dish || h.result?.meal || h.result?.verdict || 'Unknown';
      const date = new Date(h.timestamp).toLocaleDateString('en-IN');
      return `${i + 1}. ${dish} (via ${h.agent} agent, ${date})`;
    })
    .join('\n');
}

/**
 * Clear everything — for testing or user reset.
 */
export function clearContext() {
  sessionStorage.removeItem(STORAGE_KEY);
  sessionStorage.removeItem(HISTORY_KEY);
}