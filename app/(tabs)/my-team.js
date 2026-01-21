import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Alert,
} from "react-native";

const { width } = Dimensions.get("window");

const MOCK_SQUAD = [
  {
    id: 1,
    name: "Raya",
    position: "GK",
    price: 5.0,
    realClub: "Arsenal",
    clubColor: "#EF0107",
    nextFixture: "LIV (H)",
  },
  {
    id: 2,
    name: "Saliba",
    position: "DEF",
    price: 6.0,
    realClub: "Arsenal",
    clubColor: "#EF0107",
    nextFixture: "LIV (H)",
  },
  {
    id: 3,
    name: "Gabriel",
    position: "DEF",
    price: 6.0,
    realClub: "Arsenal",
    clubColor: "#EF0107",
    nextFixture: "LIV (H)",
  },
  {
    id: 4,
    name: "Van Dijk",
    position: "DEF",
    price: 6.5,
    realClub: "Liverpool",
    clubColor: "#C8102E",
    nextFixture: "ARS (A)",
  },
  {
    id: 5,
    name: "Udogie",
    position: "DEF",
    price: 5.0,
    realClub: "Spurs",
    clubColor: "#132257",
    nextFixture: "MCI (H)",
  },
  {
    id: 6,
    name: "Saka",
    position: "MID",
    price: 8.5,
    realClub: "Arsenal",
    clubColor: "#EF0107",
    nextFixture: "LIV (H)",
  },
  {
    id: 7,
    name: "Salah",
    position: "MID",
    price: 12.5,
    realClub: "Liverpool",
    clubColor: "#C8102E",
    nextFixture: "ARS (A)",
  },
  {
    id: 8,
    name: "Son",
    position: "MID",
    price: 9.0,
    realClub: "Spurs",
    clubColor: "#132257",
    nextFixture: "MCI (H)",
  },
  {
    id: 9,
    name: "Palmer",
    position: "MID",
    price: 6.0,
    realClub: "Chelsea",
    clubColor: "#034694",
    nextFixture: "NEW (A)",
  },
  {
    id: 10,
    name: "Haaland",
    position: "FWD",
    price: 14.0,
    realClub: "Man City",
    clubColor: "#6CABDD",
    nextFixture: "TOT (A)",
  },
  {
    id: 11,
    name: "Watkins",
    position: "FWD",
    price: 8.0,
    realClub: "Aston Villa",
    clubColor: "#95BFE5",
    nextFixture: "BOU (H)",
  },
  // Bench
  {
    id: 12,
    name: "Areola",
    position: "GK",
    price: 4.0,
    realClub: "West Ham",
    clubColor: "#7A263A",
    nextFixture: "MUN (A)",
  },
  {
    id: 13,
    name: "Burn",
    position: "DEF",
    price: 4.5,
    realClub: "Newcastle",
    clubColor: "#241F20",
    nextFixture: "CHE (H)",
  },
  {
    id: 14,
    name: "Gordon",
    position: "MID",
    price: 5.5,
    realClub: "Newcastle",
    clubColor: "#241F20",
    nextFixture: "CHE (H)",
  },
  {
    id: 15,
    name: "Archer",
    position: "FWD",
    price: 4.5,
    realClub: "Sheffield Utd",
    clubColor: "#EE2737",
    nextFixture: "EVE (A)",
  },
];

export default function MyTeamPitch({ selectedPlayers = MOCK_SQUAD }) {
  const [squad, setSquad] = useState(selectedPlayers);
  const [captainId, setCaptainId] = useState(10);
  const [selectedForSwap, setSelectedForSwap] = useState(null);

  const starters = useMemo(() => squad.slice(0, 11), [squad]);
  const bench = useMemo(() => squad.slice(11, 15), [squad]);

  const pitchRows = useMemo(
    () => ({
      GKP: starters.filter((p) => p.position === "GK"),
      DEF: starters.filter((p) => p.position === "DEF"),
      MID: starters.filter((p) => p.position === "MID"),
      FWD: starters.filter((p) => p.position === "FWD"),
    }),
    [starters]
  );

  const handlePlayerPress = (player, isBench) => {
    // 1. Toggle Deselection
    if (selectedForSwap?.id === player.id) {
      setSelectedForSwap(null);
      return;
    }

    // 2. Initial Selection
    if (!selectedForSwap) {
      setSelectedForSwap({ ...player, fromBench: isBench });
      return;
    }

    // 3. EXECUTE SWAP
    // If we have a pitch player selected and tap a bench player (OR vice versa)
    if (selectedForSwap.fromBench !== isBench) {
      executePitchToBenchSwap(selectedForSwap, player);
    }
    // If we have a bench player selected and tap another bench player (REORDER)
    else if (
      selectedForSwap.fromBench &&
      isBench &&
      player.position !== "GK" &&
      selectedForSwap.position !== "GK"
    ) {
      executeBenchReorder(selectedForSwap, player);
    }
  };

  const executePitchToBenchSwap = (pitchSide, benchSide) => {
    // Identify which is which regardless of click order
    const pPlayer = pitchSide.fromBench ? benchSide : pitchSide;
    const bPlayer = benchSide.fromBench ? benchSide : pitchSide;

    // FPL Formation Validation
    const newStarters = starters.map((p) =>
      p.id === pPlayer.id ? bPlayer : p
    );
    const defCount = newStarters.filter((p) => p.position === "DEF").length;
    const fwdCount = newStarters.filter((p) => p.position === "FWD").length;
    const gkCount = newStarters.filter((p) => p.position === "GK").length;

    if (gkCount !== 1) {
      Alert.alert("Error", "Must have 1 Goalkeeper.");
      return;
    }
    if (defCount < 3 || defCount > 5) {
      Alert.alert("Invalid Formation", "Must have 3-5 Defenders.");
      return;
    }
    if (fwdCount < 1 || fwdCount > 3) {
      Alert.alert("Invalid Formation", "Must have 1-3 Forwards.");
      return;
    }

    const newSquad = [...squad];
    const pIdx = squad.findIndex((p) => p.id === pPlayer.id);
    const bIdx = squad.findIndex((p) => p.id === bPlayer.id);

    [newSquad[pIdx], newSquad[bIdx]] = [newSquad[bIdx], newSquad[pIdx]];

    // CAPTAIN HANDOVER: If the player leaving was captain, move 'C' to the new player
    if (pPlayer.id === captainId) {
      setCaptainId(bPlayer.id);
    }

    setSquad(newSquad);
    setSelectedForSwap(null);
  };

  const executeBenchReorder = (sub1, sub2) => {
    const newSquad = [...squad];
    const idx1 = squad.findIndex((p) => p.id === sub1.id);
    const idx2 = squad.findIndex((p) => p.id === sub2.id);
    [newSquad[idx1], newSquad[idx2]] = [newSquad[idx2], newSquad[idx1]];
    setSquad(newSquad);
    setSelectedForSwap(null);
  };

  const PlayerSlot = ({ player, isBench }) => {
    if (!player)
      return (
        <View style={styles.slot}>
          <View style={styles.emptyJersey}>
            <Text style={styles.emptyPlus}>+</Text>
          </View>
        </View>
      );

    const isCaptain = player.id === captainId;
    const isSelected = selectedForSwap?.id === player.id;
    const jerseyColor =
      player.position === "GK" ? "#FFB800" : player.clubColor || "#38003c";

    return (
      <TouchableOpacity
        style={[styles.slot, isSelected && styles.selectedSlot]}
        onPress={() => handlePlayerPress(player, isBench)}
        onLongPress={() => !isBench && setCaptainId(player.id)}
      >
        <View style={styles.jerseyContainer}>
          <Text
            style={{
              fontSize: 42,
              color: jerseyColor,
              opacity: isSelected ? 0.6 : 1,
            }}
          >
            👕
          </Text>
          {isCaptain && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>C</Text>
            </View>
          )}
        </View>
        <View style={styles.playerNameBg}>
          <Text style={styles.playerName} numberOfLines={1}>
            {player.name}
          </Text>
        </View>
        <View style={styles.fixtureBg}>
          <Text style={styles.fixtureText}>{player.nextFixture}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.pitchArea}>
        <PitchBackground />
        <View style={styles.pitchContent}>
          <View style={styles.row}>
            {pitchRows.GKP.map((p) => (
              <PlayerSlot key={p.id} player={p} />
            ))}
          </View>
          <View style={styles.row}>
            {pitchRows.DEF.map((p) => (
              <PlayerSlot key={p.id} player={p} />
            ))}
          </View>
          <View style={styles.row}>
            {pitchRows.MID.map((p) => (
              <PlayerSlot key={p.id} player={p} />
            ))}
          </View>
          <View style={styles.row}>
            {pitchRows.FWD.map((p) => (
              <PlayerSlot key={p.id} player={p} />
            ))}
          </View>
        </View>
      </View>

      {/* BENCH SECTION with Dynamic Glow */}
      <View
        style={[
          styles.benchContainer,
          selectedForSwap && styles.benchActiveGlow,
        ]}
      >
        <View style={styles.benchHeader}>
          <Text
            style={[styles.benchTitle, selectedForSwap && { color: "#38003c" }]}
          >
            {selectedForSwap ? "SELECT SUB TO SWAP" : "SUBSTITUTES"}
          </Text>
        </View>
        <View style={styles.benchRow}>
          {bench.map((p) => (
            <PlayerSlot key={p.id} player={p} isBench />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1b5e20" },
  pitchArea: {
    flex: 1,
    margin: 5,
    borderRadius: 15,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.2)",
  },
  pitchContent: {
    flex: 1,
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  stripe: { flex: 1 },
  centerLine: {
    position: "absolute",
    top: "50%",
    width: "100%",
    height: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  centerCircle: {
    position: "absolute",
    top: "43%",
    left: width / 2 - 50,
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  penaltyAreaTop: {
    position: "absolute",
    top: -1,
    left: "20%",
    width: "60%",
    height: 70,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  penaltyAreaBottom: {
    position: "absolute",
    bottom: -1,
    left: "20%",
    width: "60%",
    height: 70,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },

  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  slot: {
    alignItems: "center",
    width: width / 5.8,
    marginHorizontal: 2,
    paddingVertical: 5,
    borderRadius: 8,
  },
  selectedSlot: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 1,
    borderColor: "#00ff85",
  },

  jerseyContainer: { position: "relative" },
  badge: {
    position: "absolute",
    top: -2,
    right: -8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#38003C",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#FFF",
  },
  badgeText: { color: "#FFF", fontSize: 10, fontWeight: "900" },

  playerNameBg: {
    backgroundColor: "#38003c",
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 2,
    marginTop: 2,
    width: "98%",
  },
  playerName: {
    color: "#fff",
    fontSize: 8,
    fontWeight: "800",
    textAlign: "center",
    textTransform: "uppercase",
  },

  fixtureBg: {
    backgroundColor: "#fff",
    paddingHorizontal: 2,
    marginTop: 1,
    borderRadius: 2,
    width: "98%",
  },
  fixtureText: {
    color: "#333",
    fontSize: 7,
    fontWeight: "700",
    textAlign: "center",
  },

  // BENCH STYLES
  benchContainer: {
    backgroundColor: "#fff",
    paddingBottom: 30,
    paddingTop: 12,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    elevation: 20,
    borderTopWidth: 4,
    borderTopColor: "transparent",
  },
  benchActiveGlow: { borderTopColor: "#00ff85", backgroundColor: "#f0fff4" }, // Subtle green glow when active
  benchHeader: { alignItems: "center", marginBottom: 8 },
  benchTitle: {
    fontSize: 9,
    fontWeight: "900",
    color: "#AAA",
    letterSpacing: 1.5,
  },
  benchRow: { flexDirection: "row", justifyContent: "space-evenly" },
});
