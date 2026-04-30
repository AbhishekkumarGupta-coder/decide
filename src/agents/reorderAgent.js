export const reorderAgent = {
  id: 'reorder',
  name: 'Reorder Intelligence',
  icon: '🔄',
  tagline: 'Detect patterns in past orders, suggest smarter versions',
  description: 'Share your last 3–5 orders. I\'ll find hidden patterns — unhealthy repetition, overspending, missed variety — and suggest upgrades.',
  color: '#F59E0B',
  gradient: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
  fields: [
    { key: 'past_orders', label: 'Your Last 3–5 Orders', type: 'textarea', placeholder: 'Order 1: Butter chicken + naan from Biryani Blues — ₹350\nOrder 2: Paneer tikka roll from Rolls Mania — ₹180\nOrder 3: Chicken biryani from Behrouz — ₹420\nOrder 4: Veg fried rice from Chinese Wok — ₹200\nOrder 5: Butter chicken from Delhi Darbar — ₹300' },
    { key: 'complaints', label: 'Any Complaints?', type: 'textarea', placeholder: 'e.g. portions were small, too oily, getting bored of same stuff...' },
  ],
  systemPrompt: `You are a reorder intelligence agent. Analyze a user's Swiggy order history to find patterns and suggest a smarter version of what they usually get.

Look for: frequency patterns, unhealthy repetition, overspending, missed variety, diet drift.

Return ONLY a JSON object:
{
  "pattern_detected": "what you noticed",
  "your_usual": "...",
  "upgrade": "better version of same craving",
  "upgrade_reason": "...",
  "health_delta": "how it's better or worse",
  "price_delta": "₹... cheaper/more expensive",
  "break_the_loop": "one wildcard suggestion to try something new"
}`,
  buildPrompt: (inputs) => {
    return `Analyze my order history:

Past orders:
${inputs.past_orders}

${inputs.complaints ? `Complaints/feedback: ${inputs.complaints}` : 'No specific complaints.'}

Find patterns and suggest upgrades.`;
  },
  renderResult: (result) => {
    return {
      headline: result.upgrade,
      subtitle: `Upgrade from: ${result.your_usual}`,
      details: [
        { label: 'Pattern Detected', value: result.pattern_detected, isWarning: true },
        { label: 'Why Upgrade', value: result.upgrade_reason },
        { label: 'Health Impact', value: result.health_delta },
        { label: 'Price Difference', value: result.price_delta, isBadge: true },
        { label: 'Break the Loop', value: result.break_the_loop, isHighlight: true },
      ],
    };
  },
};
