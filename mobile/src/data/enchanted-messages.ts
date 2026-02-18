import { ImageSourcePropType } from 'react-native';

export interface GuidanceMessage {
  id: number;
  title: string;
  message: string;
  symbol: string;
  image?: ImageSourcePropType;
  menuImage?: ImageSourcePropType;
}

export const enchantedMessages: GuidanceMessage[] = [
  {
    id: 1,
    title: "The Road",
    message: "The enchanted forest is your life, and only you can find your way through it. Everything begins on the road, and only your heart can be your most reliable compass. Many adventures and unexpected turns lie ahead, but only you can decide whether your journey will be easy or difficult. The forest will offer you many paths - both familiar and unfamiliar and all of them lead you to where you need to be at this moment. Sometimes, you may follow the beaten path and reach a dead end, only to show yourself that you chose it out fear rather than from the heart. But if you take an unfamiliar road while following the call of your heart, you may face fog and uncertainty. Yet with each step, the way will reveal itself to you as if by magic, and your journey will become easier and filled with joy.",
    symbol: "🛤️",
    image: require('@/../assets/images/road.png'),
  },
  {
    id: 2,
    title: "The Magic Well",
    message: "The magic well is your heart where you make a wish and fulfill it for yourself but your wish must be genuine. All you have to do is to listen to your heart and follow its impulses. Only this way, otherwise the magic well will turn into a swamp. False desires will only lead you into the densest part of the forest.",
    symbol: "🪄",
    image: require('@/../assets/images/magic-well.png'),
    menuImage: require('@/../assets/images/magic-well.png'),
  },
  {
    id: 3,
    title: "The Magic Lake",
    message: "The magic lake is your intuition. When you immerse yourself in it, you first find silence, and then all the answers. To see the lake in the enchanted forest, you must first stop and look around. It is always near, but you cannot see it not with your eyes - only with your heart, where calm and stillness are reflected. When you dive into the depths and find the answer there, you will feel warmth and a sense of home. But when you rise to the surface again, doubts may chain you. The mind's voice will convince you to follow the established path, for it seems secure and every step predictable, while the unfamiliar path may appear dangerous and winding. But remember: the mind always relies on the known and can take you only to the known - while the mystery of the unknown can take you to the places beyond your imagination.",
    symbol: "🌊",
    image: require('@/../assets/images/magic-lake.png'),
    menuImage: require('@/../assets/images/magic-lake.png'),
  },
  {
    id: 4,
    title: "Your Guides",
    message: "On your journey, you will encounter various guides and signs. Don't miss them - otherwise, you may find yourself wandering the forest and tripping over the same bumps. And even if you miss them and get lost for a while, it's only temporary - meant to grant you the forest's experience. You won't be late for anything. Remember, there is no time in the forest.",
    symbol: "🧭",
    image: require('@/../assets/images/your-guides-chapter.png'),
    menuImage: require('@/../assets/images/your-guides-chapter.png'),
  },
  {
    id: 5,
    title: "Invisible to the Eyes",
    message: "When you follow the heart's path, everything around you starts to glow, even if you don't see it yet. Remember: just because you cannot see something doesn't mean it doesn't exist. The forest has its own laws, and in time, everything will fall into place. Don't rush things. Don't rush yourself. Let go of control. All your wishes will come true once you are ready. The forest does not punish you - it loves you and cares for you. Trust and continue your journey.",
    symbol: "🌿",
  },
  {
    id: 6,
    title: "Stop",
    message: "Sometimes you may just want to stop and rest to restore your energy. There is no need to rush anywhere or to think that you might lose something if you take a rest. On the contrary, by doing so you will restore your strength and gain more energy to fulfill your dreams. Don't pursue ideals, don't look at how others do things - instead, always tune in to your inner.",
    symbol: "🕸️",
  },
  {
    id: 7,
    title: "Crossroad",
    message: "Sometimes two roads appear before us, and we need to choose which one to follow. The truth is, we don't really choose - the right path reveals itself the moment we step ahead. And only after taking the step we realize that we are already walking the road. This is the moment when that very step is taken, this is the very impulse from which the movement began. It happened on its own, because the mind didn't have time to interfere and start making choices, giving reasons for what is better and safer. Whichever path that you choose is the right one for you in that moment; it is only the mind that may argue later that you should have taken another one.",
    symbol: "🌫️",
  },
  {
    id: 8,
    title: "Swamp",
    message: "It may happen that you feel as if you've fallen into a swamp and cannot find the way out. Don't believe this image, this is just an illusion. The forest is merely playing with you and testing your strength. What should you do to make the illusion dissolve? Just take a bold step forward, trusting your inner compass, and the swamp will vanish as if by magic. Remember, no matter how frightening the outer picture may seem, it is only an illusion created by your fear.",
    symbol: "🦉",
  },
  {
    id: 9,
    title: "You Are Being Guided",
    message: "Everything around you is woven from who you are and from your faith, because you are the author of this fairy tale; you already know all the roads and paths, and you have also created all the characters who will guide you on this journey. All you have to do is to follow the signs, enjoy the journey, and perceive everything as a fascinating game - then any dead end turns into an opportunity, and every step brings you closer to the fairy tale.",
    symbol: "🦌",
  },
  {
    id: 10,
    title: "The New Beginning",
    message: "And so you have arrived - at the place you have been walking toward for so long: your dream. And you see that this is not the end of your path, but the beginning of something new, and every step you take, each dream fulfilled becomes part of your story, which you experience with wonder. You realize that in the forest everything is connected: one road leads to another, not to reach a destination, but to discover yourself along the way through this enchanted forest.",
    symbol: "☀️",
  },
];
