import { ImageSourcePropType } from 'react-native';

export interface GuidanceMessage {
  id: number;
  title: string;
  message: string;
  symbol: string;
  image?: ImageSourcePropType;
}

export const enchantedMessages: GuidanceMessage[] = [
  {
    id: 1,
    title: "The Road",
    message: "The enchanted forest is your life, and only you can find your way through it. Everything begins on the road, and only your heart can be your most reliable compass. Many adventures and unexpected turns lie ahead, but only you can decide whether your journey will be easy or difficult. The forest will offer you many paths - both familiar and unfamiliar and all of them lead you to where you need to be at this moment. Sometimes, you may follow the beaten path and reach a dead end, only to show yourself that you chose it out fear rather than from the heart. But if you take an unfamiliar road while following the call of your heart, you may face fog and uncertainty. Yet with each step, the way will reveal itself to you as if by magic, and your journey will become easier and filled with joy.",
    symbol: "🛤️",
    image: require('@/../assets/images/road-chapter.png'),
  },
  {
    id: 2,
    title: "The Magic Well",
    message: "The magic well is your heart where you make a wish and fulfill it for yourself but your wish must be genuine. All you have to do is to listen to your heart and follow its impulses. Only this way, otherwise the magic well will turn into a swamp. False desires will only lead you into the densest part of the forest.",
    symbol: "🪄",
    image: require('@/../assets/images/magic-well-chapter.png'),
  },
  {
    id: 3,
    title: "The Magic Lake",
    message: "The magic lake is your intuition. When you immerse yourself in it, you first find silence, and then all the answers. To see the lake in the enchanted forest, you must first stop and look around. It is always near, but you cannot see it not with your eyes - only with your heart, where calm and stillness are reflected. When you dive into the depths and find the answer there, you will feel warmth and a sense of home. But when you rise to the surface again, doubts may chain you. The mind's voice will convince you to follow the established path, for it seems secure and every step predictable, while the unfamiliar path may appear dangerous and winding. But remember: the mind always relies on the known and can take you only to the known - while the mystery of the unknown can take you to the places beyond your imagination.",
    symbol: "🌊",
    image: require('@/../assets/images/magic-lake-chapter.png'),
  },
  {
    id: 4,
    title: "Your Guides",
    message: "On your journey, you will encounter various guides and signs. Don't miss them - otherwise, you may find yourself wandering the forest and tripping over the same bumps. And even if you miss them and get lost for a while, it's only temporary - meant to grant you the forest's experience. You won't be late for anything. Remember, there is no time in the forest.",
    symbol: "🧭",
    image: require('@/../assets/images/your-guides-chapter.png'),
  },
  {
    id: 5,
    title: "The Forest Canopy",
    message: "High above, the canopy appears as one great sea of green, yet each leaf has its own story, its own dance with the wind. You are both part of something greater and a masterpiece in your own right. Neither truth diminishes the other.",
    symbol: "🌿",
  },
  {
    id: 6,
    title: "The Spider's Web",
    message: "The spider weaves without knowing who will come—yet the web catches what is meant for it. Create without attachment to outcome. Your work has value beyond what you can foresee. Trust the weaving.",
    symbol: "🕸️",
  },
  {
    id: 7,
    title: "The Morning Mist",
    message: "When mist blankets the forest, paths disappear and familiar landmarks fade. Yet the forest remains unchanged beneath the veil. When confusion clouds your vision, remember: clarity will return. Be still. The fog always lifts.",
    symbol: "🌫️",
  },
  {
    id: 8,
    title: "The Owl's Wisdom",
    message: "The owl sees what others miss in the darkness, not through force of light, but through patient observation. Some truths reveal themselves only to those who watch and wait. Not every answer comes from seeking—some arrive in stillness.",
    symbol: "🦉",
  },
  {
    id: 9,
    title: "The Deer's Path",
    message: "The deer creates trails not by intention, but by following what sustains it—water, shelter, nourishment. Your authentic path forms the same way. Follow what gives you life, and the trail will appear behind you.",
    symbol: "🦌",
  },
  {
    id: 10,
    title: "The Clearing",
    message: "Every forest holds clearings—spaces where sunlight breaks through completely. These are not accidents but invitations. Your life too has openings, moments of pure possibility. Step into the light when it calls you. The forest wants you to bloom.",
    symbol: "☀️",
  },
];
