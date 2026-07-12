// Central place for non-Tailwind theme values (gradients, shadows, icon colors)
// Tailwind color tokens live in tailwind.config.js — keep these in sync.

export const GRADIENTS = {
  background: ["#050019", "#0B0033", "#1A0B4D"] as const,
  card: ["#1A0B4D", "#2A1466"] as const,
  plasma: ["#FF2E9F", "#7B2FF7"] as const,
  acid: ["#B4FF39", "#00F0FF"] as const,
  starlight: ["#FFD23F", "#FF6B35"] as const,
};

export const GLOW_SHADOW = {
  shadowColor: "#B4FF39",
  shadowOpacity: 0.6,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 0 },
  elevation: 8,
};

export const PLASMA_SHADOW = {
  shadowColor: "#FF2E9F",
  shadowOpacity: 0.55,
  shadowRadius: 14,
  shadowOffset: { width: 0, height: 0 },
  elevation: 8,
};

export const INTENSITY_META = {
  mild: { label: "Mild 🍃", color: "#B4FF39", desc: "Easygoing, low-key spicy" },
  spicy: { label: "Spicy 🌶️", color: "#FF6B35", desc: "Cheeky and bold" },
  wild: { label: "Wild 🔥", color: "#FF2E9F", desc: "Fully unhinged, R-rated" },
};
