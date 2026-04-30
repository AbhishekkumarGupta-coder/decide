export const budgetAgent = {
  id: 'budget',
  name: 'Budget Survival',
  icon: '💰',
  tagline: 'Best possible meal within a tight budget',
  description: 'Got a strict budget? I\'ll find the most satisfying, best-value meal possible within it — with nutritional notes.',
  color: '#10B981',
  gradient: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
  fields: [
    { key: 'budget', label: 'Budget (₹)', type: 'number', placeholder: '150' },
    { key: 'city', label: 'City', type: 'text', placeholder: 'e.g. Bangalore, Delhi, Mumbai...' },
    { key: 'dietary_type', label: 'Dietary Type', type: 'select', options: ['No preference', 'Vegetarian', 'Vegan', 'Non-Veg', 'Eggetarian'] },
    { key: 'health_goal', label: 'Health Goal', type: 'select', options: ['No goal', 'High protein', 'Low carb', 'Low calorie', 'Balanced', 'Bulk / high calorie'] },
  ],
  systemPrompt: `You are a budget food survival agent for Swiggy. The user has a strict budget. Find the most satisfying, best-value meal possible within it.

Return ONLY a JSON object:
{
  "meal": "...",
  "restaurant": "...",
  "price": "₹...",
  "value_score": "9.2/10",
  "health_note": "...",
  "why_best_value": "...",
  "what_to_avoid": "what NOT to order at this budget"
}`,
  buildPrompt: (inputs) => {
    return `Budget meal challenge:
- Strict budget: ₹${inputs.budget}
- City: ${inputs.city}
- Dietary type: ${inputs.dietary_type}
- Health goal: ${inputs.health_goal}
- Current time: ${new Date().toLocaleTimeString('en-IN')}

Find me the absolute best value meal.`;
  },
  renderResult: (result) => {
    return {
      headline: result.meal,
      subtitle: `from ${result.restaurant}`,
      badge: result.price,
      score: result.value_score,
      details: [
        { label: 'Value Score', value: result.value_score, isBadge: true },
        { label: 'Health Note', value: result.health_note },
        { label: 'Why Best Value', value: result.why_best_value },
        { label: 'What to Avoid', value: result.what_to_avoid, isWarning: true },
      ],
    };
  },
};
