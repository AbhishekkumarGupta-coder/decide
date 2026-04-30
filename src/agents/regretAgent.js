export const regretAgent = {
  id: 'regret',
  name: 'Regret Minimization',
  icon: '😬',
  tagline: 'Predict and prevent post-order regret',
  description: 'About to order something? Tell me what it is. I\'ll predict your post-meal regret probability and tell you whether to ORDER IT or PIVOT.',
  color: '#EF4444',
  gradient: 'linear-gradient(135deg, #EF4444 0%, #F97316 100%)',
  fields: [
    { key: 'about_to_order', label: 'What are you about to order?', type: 'text', placeholder: 'e.g. Large pizza with extra cheese and garlic bread' },
    { key: 'restaurant', label: 'From which restaurant?', type: 'text', placeholder: 'e.g. Dominos, Behrouz...' },
    { key: 'time_of_day', label: 'Time of Day', type: 'select', options: ['Morning (6-11 AM)', 'Lunch (11 AM-2 PM)', 'Afternoon (2-5 PM)', 'Evening (5-8 PM)', 'Dinner (8-10 PM)', 'Late Night (10 PM-2 AM)', 'Very Late (2-6 AM)'] },
    { key: 'mood', label: 'Current Mood', type: 'text', placeholder: 'e.g. bored, stressed, celebrating, sad...' },
    { key: 'recent_diet', label: 'What you\'ve eaten recently', type: 'textarea', placeholder: 'e.g. Had pizza yesterday, burger day before, been eating out all week...' },
  ],
  systemPrompt: `You are a food regret prediction agent. Analyze what someone is about to order and predict their post-meal regret probability.

Regret triggers: too oily, too heavy for time of day, too expensive, ordered same thing 3 times this week, eating out of boredom, late-night junk.

Be honest but not preachy.

Return ONLY a JSON object:
{
  "regret_probability": 72,
  "regret_type": "health / financial / repetition / timing",
  "verdict": "ORDER IT",
  "reason": "honest and direct, like a good friend",
  "if_pivot": "what to get instead if verdict is PIVOT",
  "green_flag": "one thing that's actually fine about their choice"
}

verdict must be exactly "ORDER IT" or "PIVOT".`,
  buildPrompt: (inputs) => {
    return `Regret check for my order:
- About to order: ${inputs.about_to_order}
- Restaurant: ${inputs.restaurant}
- Time of day: ${inputs.time_of_day}
- Current mood: ${inputs.mood}
- Recent diet: ${inputs.recent_diet}

Should I go for it or pivot?`;
  },
  renderResult: (result) => {
    const isPivot = result.verdict === 'PIVOT';
    return {
      headline: result.verdict,
      subtitle: `${result.regret_probability}% regret probability`,
      badge: `${result.regret_probability}%`,
      badgeColor: result.regret_probability > 60 ? '#EF4444' : result.regret_probability > 30 ? '#F59E0B' : '#10B981',
      details: [
        { label: 'Regret Type', value: result.regret_type, isBadge: true },
        { label: 'Honest Take', value: result.reason },
        ...(isPivot ? [{ label: 'Pivot To', value: result.if_pivot, isHighlight: true }] : []),
        { label: 'Green Flag', value: result.green_flag },
      ],
    };
  },
};
