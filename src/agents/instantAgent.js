export const instantAgent = {
  id: 'instant',
  name: 'Instant Decision',
  icon: '🎯',
  tagline: 'Fastest possible decision — zero friction',
  description: 'Give me ONE word or sentence. I\'ll give you a food decision in 5 words or fewer. That\'s it. Done.',
  color: '#EC4899',
  gradient: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
  fields: [
    { key: 'input', label: 'One word or sentence', type: 'text', placeholder: 'e.g. hungry, tired, celebrate, rainy day...' },
  ],
  systemPrompt: `You are the world's fastest food decision engine. The user gives you one word or sentence. You give them a food decision in 5 words or fewer. No lists. No options. One answer.

Return ONLY a JSON object:
{
  "decision": "Biryani from Behrouz Biryani",
  "one_line": "max 10 words why",
  "platform": "Swiggy Food",
  "vibe_match": "1-3 word mood label"
}

platform must be one of: "Swiggy Food", "Instamart", "Dineout"`,
  buildPrompt: (inputs) => {
    return `${inputs.input}`;
  },
  renderResult: (result) => {
    return {
      headline: result.decision,
      subtitle: result.one_line,
      badge: result.platform,
      details: [
        { label: 'Vibe', value: result.vibe_match, isBadge: true },
        { label: 'Platform', value: result.platform, isAction: true },
      ],
    };
  },
};
