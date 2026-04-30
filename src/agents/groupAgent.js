export const groupAgent = {
  id: 'group',
  name: 'Group Decision',
  icon: '👥',
  tagline: 'Find the optimal order when friends can\'t agree',
  description: 'Enter each person\'s preferences and a shared budget. I\'ll find the single best order that maximizes group satisfaction.',
  color: '#7C3AED',
  gradient: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)',
  fields: [
    { key: 'num_people', label: 'Number of People', type: 'number', placeholder: '4', min: 2, max: 8 },
    { key: 'preferences', label: 'Each Person\'s Preferences', type: 'textarea', placeholder: 'Person 1: Wants spicy biryani, no seafood\nPerson 2: Vegetarian, loves paneer\nPerson 3: Anything goes, wants dessert\nPerson 4: On a diet, wants something light' },
    { key: 'shared_budget', label: 'Shared Budget (₹)', type: 'number', placeholder: '1500' },
    { key: 'city', label: 'City', type: 'text', placeholder: 'e.g. Bangalore, Delhi, Mumbai...' },
  ],
  systemPrompt: `You are a group food consensus agent. You receive a list of people and their individual preferences/restrictions. Find the single best shared order that maximizes satisfaction across the group.

Be decisive. Groups never agree — you are the tiebreaker.

Return ONLY a JSON object:
{
  "verdict": "the winning order",
  "restaurant": "...",
  "items": ["item 1", "item 2"],
  "total_estimate": "₹...",
  "per_person": "₹...",
  "why_it_wins": "explain how it satisfies each person briefly",
  "compromises": "who compromised and how much",
  "split_note": "..."
}`,
  buildPrompt: (inputs) => {
    return `Group order decision needed:
- Number of people: ${inputs.num_people}
- Shared budget: ₹${inputs.shared_budget}
- City: ${inputs.city}

Individual preferences:
${inputs.preferences}

Find the best consensus order.`;
  },
  renderResult: (result) => {
    return {
      headline: result.verdict,
      subtitle: `from ${result.restaurant}`,
      badge: result.total_estimate,
      details: [
        { label: 'Items', value: Array.isArray(result.items) ? result.items.join(', ') : result.items },
        { label: 'Per Person', value: result.per_person, isBadge: true },
        { label: 'Why It Wins', value: result.why_it_wins },
        { label: 'Compromises', value: result.compromises },
        { label: 'Split Note', value: result.split_note },
      ],
    };
  },
};
