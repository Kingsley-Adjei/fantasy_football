/**
 * API Service
 * Handles all backend communication
 */

const API_BASE_URL = "http://your-backend-url.com/api"; // Update this

/**
 * Fetch all available players
 */
export const fetchPlayers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/players`);
    if (!response.ok) throw new Error("Failed to fetch players");
    return await response.json();
  } catch (error) {
    console.error("Error fetching players:", error);
    throw error;
  }
};

/**
 * Check if team name is available
 */
export const checkTeamNameAvailability = async (teamName) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/teams/check-name?name=${encodeURIComponent(teamName)}`
    );
    if (!response.ok) throw new Error("Failed to check team name");
    const data = await response.json();
    return !data.exists; // Return true if available
  } catch (error) {
    console.error("Error checking team name:", error);
    throw error;
  }
};

/**
 * Create initial squad
 */
export const createInitialSquad = async (userId, teamName, playerIds) => {
  try {
    const response = await fetch(`${API_BASE_URL}/teams/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        teamName,
        playerIds,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create team");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating team:", error);
    throw error;
  }
};

/**
 * Mock data for development (remove when backend is ready)
 */
export const MOCK_PLAYERS = [
  {
    id: "1",
    name: "Haaland",
    position: "FWD",
    realClub: "Man City",
    price: 15.0,
  },
  { id: "2", name: "Saka", position: "MID", realClub: "Arsenal", price: 12.0 },
  {
    id: "3",
    name: "Palmer",
    position: "MID",
    realClub: "Chelsea",
    price: 11.5,
  },
  {
    id: "4",
    name: "Salah",
    position: "MID",
    realClub: "Liverpool",
    price: 13.5,
  },
  {
    id: "5",
    name: "Pickford",
    position: "GK",
    realClub: "Everton",
    price: 5.0,
  },
  {
    id: "6",
    name: "Kingsley",
    position: "MID",
    realClub: "Man City",
    price: 12.0,
  },
  { id: "7", name: "Sadik", position: "DF", realClub: "Man City", price: 6.3 },
  {
    id: "8",
    name: "Dennis",
    position: "MID",
    realClub: "Man City",
    price: 5.7,
  },
  {
    id: "9",
    name: "Blaise",
    position: "MID",
    realClub: "Man City",
    price: 6.0,
  },
  {
    id: "10",
    name: "Justice",
    position: "DF",
    realClub: "Man City",
    price: 5.5,
  },
  {
    id: "11",
    name: "Don-Kay",
    position: "MID",
    realClub: "Man City",
    price: 6.5,
  },
  {
    id: "12",
    name: "Charles",
    position: "FWD",
    realClub: "Man City",
    price: 7.0,
  },
  {
    id: "13",
    name: "Osei",
    position: "FWD",
    realClub: "Man City",
    price: 10.0,
  },
  { id: "14", name: "Brain", position: "DF", realClub: "Man City", price: 6.0 },
  { id: "15", name: "Nigel", position: "GK", realClub: "Man City", price: 6.0 },
  {
    id: "16",
    name: "UglyBoy",
    position: "GK",
    realClub: "Man City",
    price: 5.3,
  },
  {
    id: "17",
    name: "Santos",
    position: "FWD",
    realClub: "Man City",
    price: 6.8,
  },
  {
    id: "18",
    name: "Arnold",
    position: "DF",
    realClub: "Man City",
    price: 5.2,
  },
  {
    id: "19",
    name: "Banasco",
    position: "FWD",
    realClub: "Man City",
    price: 6.0,
  },
  {
    id: "20",
    name: "Frequency",
    position: "DF",
    realClub: "Man City",
    price: 5.0,
  },
  {
    id: "21",
    name: "Prince",
    position: "DF",
    realClub: "Man City",
    price: 6.5,
  },
  { id: "22", name: "Paul", position: "MID", realClub: "Man City", price: 5.8 },
];
