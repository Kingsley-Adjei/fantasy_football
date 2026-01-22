import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Alert,
  ScrollView,
} from "react-native";

const { width, height } = Dimensions.get("window");

const MOCK_SQUAD = [
  {
    id: 1,
    name: "Raya",
    position: "GK",
    realClub: "Arsenal",
    clubColor: "#EF0107",
    nextFixture: "LIV (H)",
  },
  {
    id: 2,
    name: "Saliba",
    position: "DEF",
    realClub: "Arsenal",
    clubColor: "#EF0107",
    nextFixture: "LIV (H)",
  },
  {
    id: 3,
    name: "Gabriel",
    position: "DEF",
    realClub: "Arsenal",
    clubColor: "#EF0107",
    nextFixture: "LIV (H)",
  },
  {
    id: 4,
    name: "Van Dijk",
    position: "DEF",
    realClub: "Liverpool",
    clubColor: "#C8102E",
    nextFixture: "ARS (A)",
  },
  {
    id: 5,
    name: "Udogie",
    position: "DEF",
    realClub: "Spurs",
    clubColor: "#132257",
    nextFixture: "MCI (H)",
  },
  {
    id: 6,
    name: "Saka",
    position: "MID",
    realClub: "Arsenal",
    clubColor: "#EF0107",
    nextFixture: "LIV (H)",
  },
  {
    id: 7,
    name: "Salah",
    position: "MID",
    realClub: "Liverpool",
    clubColor: "#C8102E",
    nextFixture: "ARS (A)",
  },
  {
    id: 8,
    name: "Son",
    position: "MID",
    realClub: "Spurs",
    clubColor: "#132257",
    nextFixture: "MCI (H)",
  },
  {
    id: 9,
    name: "Palmer",
    position: "MID",
    realClub: "Chelsea",
    clubColor: "#034694",
    nextFixture: "NEW (A)",
  },
  {
    id: 10,
    name: "Haaland",
    position: "FWD",
    realClub: "Man City",
    clubColor: "#6CABDD",
    nextFixture: "TOT (A)",
  },
  {
    id: 11,
    name: "Watkins",
    position: "FWD",
    realClub: "Aston Villa",
    clubColor: "#95BFE5",
    nextFixture: "BOU (H)",
  },
  {
    id: 12,
    name: "Areola",
    position: "GK",
    realClub: "West Ham",
    clubColor: "#7A263A",
    nextFixture: "MUN (A)",
  },
  {
    id: 13,
    name: "Burn",
    position: "DEF",
    realClub: "Newcastle",
    clubColor: "#241F20",
    nextFixture: "CHE (H)",
  },
  {
    id: 14,
    name: "Gordon",
    position: "MID",
    realClub: "Newcastle",
    clubColor: "#241F20",
    nextFixture: "CHE (H)",
  },
  {
    id: 15,
    name: "Archer",
    position: "FWD",
    realClub: "Sheffield Utd",
    clubColor: "#EE2737",
    nextFixture: "EVE (A)",
  },
];

export default function MyTeamPitch({ selectedPlayers = MOCK_SQUAD }) {
  const [squad, setSquad] = useState(selectedPlayers);
  const [captainId, setCaptainId] = useState(10);
  const [selectedForSwap, setSelectedForSwap] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

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
    if (selectedForSwap?.id === player.id) {
      setSelectedForSwap(null);
      return;
    }
    if (!selectedForSwap) {
      setSelectedForSwap({ ...player, fromBench: isBench });
      return;
    }

    if (selectedForSwap.fromBench !== isBench) {
      executeSwap(selectedForSwap, { ...player, fromBench: isBench });
    } else if (selectedForSwap.fromBench && isBench) {
      if (player.position === "GK" || selectedForSwap.position === "GK") {
        Alert.alert(
          "Locked Position",
          "Substitute Goalkeeper must stay in slot 1."
        );
        setSelectedForSwap(null);
        return;
      }
      executeBenchReorder(selectedForSwap, player);
    } else {
      setSelectedForSwap({ ...player, fromBench: isBench });
    }
  };

  const executeSwap = (first, second) => {
    const pitchP = first.fromBench ? second : first;
    const benchP = first.fromBench ? first : second;

    if (
      (pitchP.position === "GK" || benchP.position === "GK") &&
      pitchP.position !== benchP.position
    ) {
      Alert.alert(
        "Invalid Swap",
        "Goalkeepers can only be swapped with Goalkeepers."
      );
      setSelectedForSwap(null);
      return;
    }

    const newStarters = starters.map((p) => (p.id === pitchP.id ? benchP : p));
    const defCount = newStarters.filter((p) => p.position === "DEF").length;
    const fwdCount = newStarters.filter((p) => p.position === "FWD").length;

    if (defCount < 3 || defCount > 5 || fwdCount < 1 || fwdCount > 3) {
      Alert.alert(
        "Invalid Formation",
        "Formation must be 3-5 DEF and 1-3 FWD."
      );
      setSelectedForSwap(null);
      return;
    }

    const newSquad = [...squad];
    const pIdx = squad.findIndex((p) => p.id === pitchP.id);
    const bIdx = squad.findIndex((p) => p.id === benchP.id);
    [newSquad[pIdx], newSquad[bIdx]] = [newSquad[bIdx], newSquad[pIdx]];

    if (pitchP.id === captainId) setCaptainId(benchP.id);
    setSquad(newSquad);
    setSelectedForSwap(null);
    setHasChanges(true);
  };

  const executeBenchReorder = (sub1, sub2) => {
    const newSquad = [...squad];
    const idx1 = squad.findIndex((p) => p.id === sub1.id);
    const idx2 = squad.findIndex((p) => p.id === sub2.id);
    [newSquad[idx1], newSquad[idx2]] = [newSquad[idx2], newSquad[idx1]];
    setSquad(newSquad);
    setSelectedForSwap(null);
    setHasChanges(true);
  };

  const PlayerSlot = ({ player, isBench }) => {
    if (!player) return null;
    const isCaptain = player.id === captainId;
    const isSelected = selectedForSwap?.id === player.id;

    return (
      <TouchableOpacity
        style={[styles.playerSlot, isSelected && styles.playerSlotSelected]}
        onPress={() => handlePlayerPress(player, isBench)}
        onLongPress={() => !isBench && setCaptainId(player.id)}
      >
        <View
          style={[
            styles.jerseyCard,
            { backgroundColor: player.clubColor },
            isSelected && styles.jerseyGlow,
          ]}
        >
          <Text style={styles.jerseyEmoji}>👕</Text>
          {isCaptain && !isBench && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>C</Text>
            </View>
          )}
        </View>
        <View style={styles.playerNameBox}>
          <Text style={styles.playerNameText} numberOfLines={1}>
            {player.name}
          </Text>
        </View>
        <View style={styles.fixtureBox}>
          <Text style={styles.fixtureText}>{player.nextFixture}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER SECTION WITH SAVE TEAM */}
        <View style={styles.topSection}>
          <View style={styles.headerRow}>
            <Text style={styles.pickTeamTitle}>Pick Team</Text>
            {hasChanges && (
              <TouchableOpacity
                style={styles.saveBtnTop}
                onPress={() => {
                  Alert.alert("Success", "Squad Saved!");
                  setHasChanges(false);
                }}
              >
                <Text style={styles.saveBtnText}>Save Team</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.gameweekBar}>
            <Text style={styles.gwText}>Gameweek 23 • </Text>
            <Text style={styles.deadlineText}>Deadline: Sat 24 Jan, 11:00</Text>
          </View>
        </View>

        {/* CHIPS GRID */}
        <View style={styles.chipsGrid}>
          {[
            { name: "Bench Boost", icon: "⬆️" },
            { name: "Triple Captain", icon: "👑" },
            { name: "Wildcard", icon: "🃏" },
            { name: "Free Hit", icon: "⚡" },
          ].map((chip, idx) => (
            <View key={idx} style={styles.chipCard}>
              <View style={styles.chipIconCircle}>
                <Text style={{ fontSize: 20 }}>{chip.icon}</Text>
              </View>
              <Text style={styles.chipNameText}>{chip.name}</Text>
              <TouchableOpacity style={styles.chipPlayBtn}>
                <Text style={styles.chipPlayText}>Play</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* PITCH AREA */}
        <View style={styles.pitchContainer}>
          <View
            style={[StyleSheet.absoluteFill, { backgroundColor: "#37B34A" }]}
          >
            {[...Array(14)].map((_, i) => (
              <View
                key={i}
                style={[
                  styles.stripe,
                  { backgroundColor: i % 2 === 0 ? "#37B34A" : "#2FA03F" },
                ]}
              />
            ))}
            <View style={styles.centerLine} />
            <View style={styles.centerCircle} />
            <View style={styles.penaltyAreaTop} />
            <View style={styles.penaltyAreaBottom} />
          </View>
          <View style={styles.pitchContent}>
            <View style={styles.pitchRow}>
              {pitchRows.GKP.map((p) => (
                <PlayerSlot key={p.id} player={p} />
              ))}
            </View>
            <View style={styles.pitchRow}>
              {pitchRows.DEF.map((p) => (
                <PlayerSlot key={p.id} player={p} />
              ))}
            </View>
            <View style={styles.pitchRow}>
              {pitchRows.MID.map((p) => (
                <PlayerSlot key={p.id} player={p} />
              ))}
            </View>
            <View style={styles.pitchRow}>
              {pitchRows.FWD.map((p) => (
                <PlayerSlot key={p.id} player={p} />
              ))}
            </View>
          </View>
        </View>

        {/* FIXED SUBSTITUTES AREA */}
        <View
          style={[
            styles.subContainer,
            selectedForSwap && styles.subContainerActive,
          ]}
        >
          <View style={styles.subHeader}>
            <Text style={styles.subHeaderTextMain}>
              {selectedForSwap ? "COMPLETE SWAP" : "SUBSTITUTES"}
            </Text>
          </View>
          <View style={styles.benchHeaderRow}>
            {bench.map((p) => (
              <View key={p.id} style={styles.benchLabel}>
                <Text style={styles.benchLabelText}>{p.position}</Text>
              </View>
            ))}
          </View>
          <View style={styles.subRow}>
            {bench.map((p) => (
              <PlayerSlot key={p.id} player={p} isBench />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  topSection: {
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  pickTeamTitle: { fontSize: 24, fontWeight: "900", color: "#37003C" },
  saveBtnTop: {
    position: "absolute",
    right: 0,
    backgroundColor: "#00FF85",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  saveBtnText: { color: "#37003C", fontWeight: "900", fontSize: 11 },
  gameweekBar: { flexDirection: "row", marginTop: 4 },
  gwText: { fontSize: 13, color: "#666" },
  deadlineText: { fontSize: 13, fontWeight: "700", color: "#37003C" },

  chipsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  chipCard: {
    width: (width - 40) / 4,
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 6,
    borderWidth: 1,
    borderColor: "#eee",
    elevation: 2,
  },
  chipIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F0F8FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  chipNameText: {
    fontSize: 8,
    fontWeight: "800",
    color: "#37003C",
    textAlign: "center",
  },
  chipPlayBtn: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: "#37003C",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  chipPlayText: { fontSize: 9, fontWeight: "900", color: "#37003C" },

  pitchContainer: {
    height: height * 0.58,
    marginHorizontal: 5,
    borderRadius: 15,
    overflow: "hidden",
  },
  stripe: { flex: 1 },
  centerLine: {
    position: "absolute",
    top: "50%",
    width: "100%",
    height: 2,
    backgroundColor: "rgba(255,255,255,0.6)",
  },
  centerCircle: {
    position: "absolute",
    top: "43%",
    left: width / 2 - 45,
    width: 85,
    height: 85,
    borderRadius: 42.5,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.6)",
  },
  penaltyAreaTop: {
    position: "absolute",
    top: -1,
    left: "20%",
    width: "60%",
    height: 65,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.6)",
  },
  penaltyAreaBottom: {
    position: "absolute",
    bottom: -1,
    left: "20%",
    width: "60%",
    height: 65,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.6)",
  },

  pitchContent: {
    flex: 1,
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  pitchRow: { flexDirection: "row", justifyContent: "center", gap: 2 },

  playerSlot: { alignItems: "center", width: width / 5.4 },
  playerSlotSelected: { borderRadius: 8 },
  jerseyCard: {
    width: 55,
    height: 65,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  jerseyGlow: {
    shadowColor: "#00FF85",
    shadowOpacity: 1,
    shadowRadius: 15,
    borderColor: "#00FF85",
    borderWidth: 3,
    elevation: 15,
  },
  jerseyEmoji: { fontSize: 38 },
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#37003C",
    borderWidth: 2,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: { color: "#fff", fontSize: 11, fontWeight: "900" },

  playerNameBox: {
    backgroundColor: "#fff",
    width: "100%",
    borderRadius: 2,
    paddingVertical: 2,
  },
  playerNameText: {
    fontSize: 9,
    fontWeight: "900",
    textAlign: "center",
    color: "#333",
  },
  fixtureBox: {
    backgroundColor: "#37003C",
    width: "100%",
    borderRadius: 2,
    marginTop: 1,
  },
  fixtureText: {
    fontSize: 8,
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },

  subContainer: {
    backgroundColor: "#A9DFC3",
    marginHorizontal: 5,
    marginTop: 10,
    marginBottom: 30,
    borderRadius: 15,
    paddingBottom: 15,
    borderTopWidth: 5,
    borderTopColor: "transparent",
  },
  subContainerActive: { borderTopColor: "#00FF85", backgroundColor: "#E8F5E9" },
  subHeader: { alignItems: "center", paddingVertical: 10 },
  subHeaderTextMain: {
    fontSize: 12,
    fontWeight: "900",
    color: "#37003C",
    letterSpacing: 1,
  },
  benchHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 5,
    marginBottom: 5,
  },
  benchLabel: { width: width / 5.4, alignItems: "center" },
  benchLabelText: { fontSize: 10, fontWeight: "900", color: "#37003C" },
  subRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 5,
  },
});
