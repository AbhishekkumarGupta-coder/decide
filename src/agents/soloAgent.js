export const soloAgent = {
  id: 'solo',
  name: 'Solo Decision',
  icon: '⚡',
  tagline: 'Eliminate personal decision fatigue',
  description: 'Tell me your mood, hunger level, and budget — I\'ll make ONE decisive recommendation. No lists. No hedging.',
  color: '#FF6B35',
  gradient: 'linear-gradient(135deg, #FF6B35 0%, #F7C948 100%)',
  fields: [
    { key: 'mood', label: 'Mood', type: 'text', placeholder: 'e.g. tired, happy, stressed, lazy...' },
    { key: 'hunger_level', label: 'Hunger Level', type: 'range', min: 1, max: 5, default: 3 },
    { key: 'budget', label: 'Budget (₹)', type: 'number', placeholder: '300' },
    { key: 'time_available', label: 'Time Available', type: 'select', options: ['15 min', '30 min', '45 min', '1 hour', 'No rush'] },
    { key: 'city', label: 'City', type: 'text', placeholder: 'e.g. Bangalore, Delhi, Mumbai...' },
    { key: 'dietary_preference', label: 'Dietary Preference', type: 'select', options: ['No preference', 'Vegetarian', 'Vegan', 'Non-Veg', 'Eggetarian', 'Jain'] },
  ],
  systemPrompt: `You are a hyper-intelligent food decision agent for Swiggy. Your job is to eliminate decision fatigue completely.

Given context (mood, hunger level 1-5, budget in ₹, time of day, dietary prefs), make ONE decisive food recommendation. Never hedge. Never list options. Be a confident friend who just says "get the butter chicken from Paradise, ₹280, thank me later."

Return ONLY a JSON object:
{
  "dish": "...",
  "restaurant": "...",
  "price_estimate": "₹...",
  "why": "2 sentences max, specific to their context",
  "confidence": 85,
  "order_action": "Order now on Swiggy Food"
}`,
  buildPrompt: (inputs) => {
    return `Here's my context:
- Mood: ${inputs.mood}
- Hunger Level: ${inputs.hunger_level}/5
- Budget: ₹${inputs.budget}
- Time Available: ${inputs.time_available}
- City: ${inputs.city}
- Dietary Preference: ${inputs.dietary_preference}
- Current Time: ${new Date().toLocaleTimeString('en-IN')}

Make your ONE decisive recommendation.`;
  },
  renderResult: (result) => {
    return {
      headline: result.dish,
      subtitle: `from ${result.restaurant}`,
      badge: result.price_estimate,
      confidence: result.confidence,
      details: [
        { label: 'Why This', value: result.why },
        { label: 'Action', value: result.order_action, isAction: true },
      ],
    };
  },
};
