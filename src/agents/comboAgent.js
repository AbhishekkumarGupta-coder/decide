export const comboAgent = {
  id: 'combo',
  name: 'Smart Combo Builder',
  icon: '🧩',
  tagline: 'Build the perfect multi-item meal combo',
  description: 'Tell me the occasion, headcount, and cuisine — I\'ll architect a complete combo with mains, sides, drinks, and dessert.',
  color: '#06B6D4',
  gradient: 'linear-gradient(135deg, #06B6D4 0%, #8B5CF6 100%)',
  fields: [
    { key: 'occasion', label: 'Occasion', type: 'select', options: ['Regular meal', 'Movie night', 'Date night', 'House party', 'Birthday', 'Late-night craving', 'Work lunch', 'Family dinner', 'Game day'] },
    { key: 'num_people', label: 'Number of People', type: 'number', placeholder: '4', min: 1, max: 20 },
    { key: 'cuisine', label: 'Cuisine Preference', type: 'select', options: ['Any cuisine', 'North Indian', 'South Indian', 'Chinese', 'Italian', 'Continental', 'Mughlai', 'Street Food', 'Mixed'] },
    { key: 'budget', label: 'Total Budget (₹)', type: 'number', placeholder: '2000' },
  ],
  systemPrompt: `You are a Swiggy combo architect. Build the perfect multi-item meal combo for any occasion.

Think like a menu designer: what goes together, what's missing (sides, drinks, dessert), right quantities per person.

Return ONLY a JSON object:
{
  "combo_name": "give it a fun name",
  "items": [
    { "name": "...", "qty": 1, "price": "₹...", "role": "main/side/drink/dessert" }
  ],
  "total": "₹...",
  "per_person": "₹...",
  "combo_logic": "why these items work together",
  "what_ties_it": "the hero item",
  "skip": "what people usually add but shouldn't"
}`,
  buildPrompt: (inputs) => {
    return `Build me a combo:
- Occasion: ${inputs.occasion}
- Number of people: ${inputs.num_people}
- Cuisine preference: ${inputs.cuisine}
- Total budget: ₹${inputs.budget}

Design the perfect multi-item combo.`;
  },
  renderResult: (result) => {
    const itemsList = Array.isArray(result.items)
      ? result.items.map(i => `${i.name} x${i.qty} (${i.role}) — ${i.price}`).join('\n')
      : result.items;
    return {
      headline: result.combo_name,
      subtitle: `${result.total} total • ${result.per_person}/person`,
      badge: result.total,
      details: [
        { label: 'Items', value: itemsList, isList: true },
        { label: 'Combo Logic', value: result.combo_logic },
        { label: 'Hero Item', value: result.what_ties_it, isHighlight: true },
        { label: 'Skip This', value: result.skip, isWarning: true },
      ],
    };
  },
};
