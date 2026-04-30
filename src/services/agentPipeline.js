/**
 * agentPipeline.js
 * Chains agents so output of one feeds into the next.
 * 
 * Key chain for demo:
 *   Solo Decision → Regret Check (if confidence < 70, auto-run regret agent)
 * 
 * Usage:
 *   import { runPipeline } from './agentPipeline';
 *   const result = await runPipeline('solo', inputs);
 */

import { runAgent } from './gemini';
import { getAgent } from '../agents/registry';
import { learnFromInputs, saveDecision, getHistorySummary } from './userContext';

/**
 * Run a single agent with context learning + history saving.
 * Drop-in replacement for runAgent() — use this everywhere in your UI.
 */
export async function runPipeline(agentId, inputs) {
  const agent = getAgent(agentId);
  if (!agent) throw new Error(`Agent not found: ${agentId}`);

  // 1. Learn from inputs — update shared context
  learnFromInputs(agentId, inputs);

  // 2. Inject history into reorder + regret agents automatically
  const enrichedInputs = enrichInputs(agentId, inputs);

  // 3. Run the primary agent
  const primary = await runAgent(agent, enrichedInputs);

  if (!primary.success) {
    return { primary, chain: [] };
  }

  // 4. Save decision to history
  saveDecision(agentId, enrichedInputs, primary.data);

  // 5. Auto-chain: if Solo confidence < 70, run Regret check
  const chain = [];
  if (agentId === 'solo' && primary.data?.confidence < 70) {
    const regretInputs = buildRegretFromSolo(primary.data, inputs);
    const regretAgent = getAgent('regret');
    if (regretAgent) {
      const regretResult = await runAgent(regretAgent, regretInputs);
      if (regretResult.success) {
        chain.push({
          agent: 'regret',
          label: 'Auto regret check (low confidence)',
          result: regretResult,
        });
      }
    }
  }

  // 6. Auto-chain: if Regret verdict is PIVOT, suggest instant alternative
  if (agentId === 'regret' && primary.data?.verdict === 'PIVOT') {
    const instantAgent = getAgent('instant');
    if (instantAgent) {
      const instantInputs = { query: primary.data?.if_pivot || 'something light and quick' };
      const instantResult = await runAgent(instantAgent, instantInputs);
      if (instantResult.success) {
        chain.push({
          agent: 'instant',
          label: 'Quick alternative',
          result: instantResult,
        });
      }
    }
  }

  return { primary, chain };
}

/**
 * Enrich inputs with context data before sending to agent.
 * Reorder + regret agents get history injected automatically.
 */
function enrichInputs(agentId, inputs) {
  if (agentId === 'reorder' || agentId === 'regret') {
    return {
      ...inputs,
      order_history: getHistorySummary(),
    };
  }
  return inputs;
}

/**
 * Build regret agent inputs from solo agent output.
 * Used in the Solo → Regret auto-chain.
 */
function buildRegretFromSolo(soloResult, originalInputs) {
  return {
    considering: `${soloResult.dish} from ${soloResult.restaurant} (${soloResult.price_estimate})`,
    time_of_day: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    feeling: originalInputs.mood || 'neutral',
    recent_diet: 'Not specified',
  };
}