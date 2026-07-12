import { GamePrompt } from "../types";

// 18+ party game deck. Mild = easygoing icebreakers, Spicy = flirty/bold,
// Wild = fully unhinged R-rated. Nothing here involves minors, non-consent,
// illegal activity, or anything beyond raunchy-adult-party-game territory.
let _id = 0;
const nid = () => `gp-${_id++}`;

const build = (
  type: GamePrompt["type"],
  intensity: GamePrompt["intensity"],
  lines: string[]
): GamePrompt[] => lines.map((text) => ({ id: nid(), type, intensity, text }));

export const GAME_PROMPTS: GamePrompt[] = [
  // ---------- NEVER HAVE I EVER ----------
  ...build("never-have-i-ever", "mild", [
    "Never have I ever cried at a movie in a theater.",
    "Never have I ever pretended to text to avoid someone.",
    "Never have I ever shown up somewhere in the wrong outfit.",
    "Never have I ever fallen asleep in a group setting.",
    "Never have I ever stalked an ex on social media.",
    "Never have I ever lied about being on my way.",
    "Never have I ever sung karaoke sober.",
    "Never have I ever ghosted someone.",
  ]),
  ...build("never-have-i-ever", "spicy", [
    "Never have I ever sent a risky text to the wrong person.",
    "Never have I ever hooked up with someone I met that night.",
    "Never have I ever had a crush on someone in this group.",
    "Never have I ever kissed someone whose name I forgot.",
    "Never have I ever flirted my way out of a bill.",
    "Never have I ever had a one-night stand.",
    "Never have I ever used a dating app during this crawl.",
    "Never have I ever made out with a stranger at a bar.",
  ]),
  ...build("never-have-i-ever", "wild", [
    "Never have I ever hooked up with someone at a party while others were nearby.",
    "Never have I ever had a hookup I regretted the next morning.",
    "Never have I ever sent a nude.",
    "Never have I ever had a threesome.",
    "Never have I ever hooked up with a friend's ex.",
    "Never have I ever had a hookup in a bathroom.",
    "Never have I ever lied to hook up with someone.",
    "Never have I ever had a wild one-night stand story I've never told this group.",
  ]),

  // ---------- TRUTH ----------
  ...build("truth", "mild", [
    "What's the most embarrassing thing in your search history?",
    "What's a lie you told that snowballed out of control?",
    "What's your most irrational fear?",
    "What's the worst gift you've ever received?",
    "What app do you spend way too much time on?",
  ]),
  ...build("truth", "spicy", [
    "Who in this group would you go on a date with?",
    "What's the boldest move you've made on someone?",
    "What's your biggest turn-on?",
    "Describe your worst date in detail.",
    "What's the closest you've come to hooking up with someone here?",
  ]),
  ...build("truth", "wild", [
    "What's the wildest place you've hooked up?",
    "What's your most outrageous hookup story?",
    "Who's the last person you thought about in a way you shouldn't have?",
    "What's a fantasy you've never told anyone in this group?",
    "What's the most scandalous thing you've done at a bar?",
  ]),

  // ---------- DARE ----------
  ...build("dare", "mild", [
    "Do your best impression of someone in the group.",
    "Let the group pick your next drink order.",
    "Compliment a stranger at the bar right now.",
    "Do 10 seconds of your best dance move, right here.",
    "Talk in an accent for the next round.",
  ]),
  ...build("dare", "spicy", [
    "Ask a stranger for their honest opinion of you.",
    "Send a flirty text to your #1 contact (group reviews it first).",
    "Let the group choose who you have to slow dance with.",
    "Do a dramatic slow-motion entrance into the next bar.",
    "Give your best pickup line to the bartender.",
  ]),
  ...build("dare", "wild", [
    "Recreate your best hookup story as a silent movie for the group.",
    "Let the group vote on a bold (consensual, tasteful) dance-off partner.",
    "Confess your most scandalous secret to the group.",
    "Do your most convincing seduction walk across the room.",
    "Let the group caption an old photo of you — you can't object.",
  ]),

  // ---------- WOULD YOU RATHER ----------
  ...build("would-you-rather", "mild", [
    "Would you rather always be 10 minutes late or 30 minutes early?",
    "Would you rather only drink beer or only drink wine, forever?",
    "Would you rather lose your phone or your wallet tonight?",
    "Would you rather karaoke solo or never karaoke again?",
  ]),
  ...build("would-you-rather", "spicy", [
    "Would you rather date your last match or your last ex?",
    "Would you rather send an embarrassing text to your crush or your boss?",
    "Would you rather kiss the bartender or the next person who walks in?",
    "Would you rather have a wild one-night stand or a boring long relationship?",
  ]),
  ...build("would-you-rather", "wild", [
    "Would you rather have your search history read aloud or your DMs?",
    "Would you rather hook up with your celebrity crush once, or a friend's ex forever?",
    "Would you rather never hook up again or only hook up with exes?",
    "Would you rather everyone here see your camera roll or your texts?",
  ]),

  // ---------- ON THE SPOT (group challenges, no cards needed) ----------
  ...build("on-the-spot", "mild", [
    "Group toast: everyone shares one word for how tonight's going.",
    "Buy the group a round of shots (or mocktails) — loser of rock-paper-scissors pays.",
    "Everyone swaps a piece of clothing for one song.",
    "Take a group photo with a stranger you just met.",
  ]),
  ...build("on-the-spot", "spicy", [
    "Everyone rates the bar's vibe 1-10 and the lowest score buys a round.",
    "Group challenge: get a stranger's Instagram handle before you leave this bar.",
    "Whoever laughs first has to do the next dare.",
    "Trade seats/spots with a stranger for one song.",
  ]),
  ...build("on-the-spot", "wild", [
    "Group votes on who's most likely to hook up with someone tonight — that person goes first on the next dare.",
    "Everyone confesses their most 'wild' decade era alter ego, in character, for one round.",
    "Loser of a staring contest has to hit on the bartender (respectfully, no means no).",
    "Group picks your next drink AND your dance move for the next song.",
  ]),
];

export const promptsByIntensity = (
  intensity: GamePrompt["intensity"]
): GamePrompt[] => GAME_PROMPTS.filter((p) => p.intensity === intensity);
