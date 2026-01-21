/**
 * Position Constants - Senior Dev "Clean" Edition
 * This palette focuses on brand consistency rather than color-coding every category.
 */
export const POSITIONS = {
  GK: {
    name: "Goalkeeper",
    short: "GKP",
    color: "#37003c", // FPL Deep Purple
    required: 2,
    order: 1,
  },
  DF: {
    name: "Defender",
    short: "DEF",
    color: "#37003c",
    required: 5,
    order: 2,
  },
  MID: {
    name: "Midfielder",
    short: "MID",
    color: "#37003c",
    required: 5,
    order: 3,
  },
  FWD: {
    name: "Forward",
    short: "FWD",
    color: "#37003c",
    required: 3,
    order: 4,
  },
};

export const TOTAL_SQUAD_SIZE = 15;
export const MAX_BUDGET = 100.0;

/**
 * Get position counts from selected players
 */
export const getPositionCounts = (players) => {
  return {
    GK: players.filter((p) => p.position === "GK").length,
    DF: players.filter((p) => p.position === "DF").length,
    MID: players.filter((p) => p.position === "MID").length,
    FWD: players.filter((p) => p.position === "FWD").length,
  };
};

/**
 * Check if a position is full
 */
export const isPositionFull = (position, players) => {
  const counts = getPositionCounts(players);
  return counts[position] >= POSITIONS[position].required;
};

/**
 * Validate squad composition
 */
export const validateSquadComposition = (players) => {
  const counts = getPositionCounts(players);
  const errors = [];

  Object.entries(POSITIONS).forEach(([pos, config]) => {
    if (counts[pos] < config.required) {
      errors.push(
        `Need ${config.required - counts[pos]} more ${config.name}${
          counts[pos] !== 1 ? "s" : ""
        }`
      );
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    counts,
  };
};

/**
 * Sort players FPL-style: by position order, then by price (high to low)
 */
export const sortPlayersFPLStyle = (players) => {
  return [...players].sort((a, b) => {
    const posOrderA = POSITIONS[a.position]?.order || 999;
    const posOrderB = POSITIONS[b.position]?.order || 999;

    if (posOrderA !== posOrderB) {
      return posOrderA - posOrderB;
    }

    return b.price - a.price;
  });
};
