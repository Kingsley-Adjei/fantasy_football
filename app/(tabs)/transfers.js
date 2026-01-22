import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Alert,
  ScrollView,
  FlatList,
  Modal,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MOCK_PLAYERS } from "../../src/services/api"; // Ensure this matches your path

const { width, height } = Dimensions.get("window");

export default function TransfersScreen() {
  // --- STATE ---
  const [squad, setSquad] = useState([]); // Loaded from backend/storage usually
  const [budget, setBudget] = useState(100.0);
  const [freeTransfers, setFreeTransfers] = useState(1);
  const [isListView, setIsListView] = useState(false);

  // Selection Logic
  const [playerToSell, setPlayerToSell] = useState(null);
  const [isPlayerModalVisible, setIsPlayerModalVisible] = useState(false);
  const [isReplacementListVisible, setIsReplacementListVisible] =
    useState(false);

  // --- INITIAL LOAD ---
  useEffect(() => {
    // In a real app, fetch current squad from backend
    // Using first 15 from MOCK_PLAYERS for demo
    setSquad(MOCK_PLAYERS.slice(0, 15));
  }, []);

  // --- CALCULATIONS ---
  const starters = useMemo(() => squad.slice(0, 11), [squad]);
  const bench = useMemo(() => squad.slice(11, 15), [squad]);
  const totalValue = useMemo(
    () => squad.reduce((sum, p) => sum + p.price, 0),
    [squad]
  );

  const pitchRows = useMemo(
    () => ({
      GKP: starters.filter((p) => p.position === "GK"),
      DEF: starters.filter((p) => p.position === "DEF"),
      MID: starters.filter((p) => p.position === "MID"),
      FWD: starters.filter((p) => p.position === "FWD"),
    }),
    [starters]
  );

  // --- TRANSFER LOGIC ---
  const handleTransferOut = (player) => {
    setPlayerToSell(player);
    setIsPlayerModalVisible(false);
    setIsReplacementListVisible(true);
  };

  const executeTransfer = (newPlayer) => {
    // Validation: Budget check
    const currentBudget = budget + playerToSell.price;
    if (newPlayer.price > currentBudget) {
      Alert.alert(
        "Insufficient Funds",
        "You don't have enough budget for this player."
      );
      return;
    }

    // Validation: Club Limit (Max 3)
    const clubCount = squad.filter(
      (p) => p.realClub === newPlayer.realClub && p.id !== playerToSell.id
    ).length;
    if (clubCount >= 3) {
      Alert.alert(
        "Club Limit",
        `Max 3 players allowed from ${newPlayer.realClub}`
      );
      return;
    }

    // Validation: Position Match (FPL Rule)
    if (newPlayer.position !== playerToSell.position) {
      Alert.alert(
        "Position Error",
        `You must replace a ${playerToSell.position} with another ${playerToSell.position}.`
      );
      return;
    }

    // Perform Swap
    const newSquad = squad.map((p) =>
      p.id === playerToSell.id ? newPlayer : p
    );
    setSquad(newSquad);
    setBudget(currentBudget - newPlayer.price);
    setIsReplacementListVisible(false);
    setPlayerToSell(null);
  };

  // --- COMPONENTS ---
  const HeaderStats = () => (
    <View style={styles.headerStats}>
      <View style={styles.statBox}>
        <Text style={styles.statLabel}>Free Transfers</Text>
        <Text style={styles.statValue}>{freeTransfers}</Text>
      </View>
      <View style={styles.statBox}>
        <Text style={styles.statLabel}>Cost</Text>
        <Text style={styles.statValue}>0 pts</Text>
      </View>
      <View
        style={[
          styles.statBox,
          { backgroundColor: "#00FF87", borderRadius: 8 },
        ]}
      >
        <Text style={[styles.statLabel, { color: "#38003c" }]}>Budget</Text>
        <Text style={[styles.statValue, { color: "#38003c" }]}>
          ₵{budget.toFixed(1)}m
        </Text>
      </View>
    </View>
  );

  const PlayerSlot = ({ player, isBench }) => (
    <TouchableOpacity
      style={styles.playerSlot}
      onPress={() => {
        setPlayerToSell(player);
        setIsPlayerModalVisible(true);
      }}
    >
      <View
        style={[
          styles.jerseyCard,
          { backgroundColor: player.clubColor || "#38003c" },
        ]}
      >
        <Text style={{ fontSize: 32 }}>👕</Text>
        <View style={styles.priceTag}>
          <Text style={styles.priceText}>₵{player.price}m</Text>
        </View>
      </View>
      <View style={styles.nameContainer}>
        <Text style={styles.playerName} numberOfLines={1}>
          {player.name}
        </Text>
      </View>
      <View style={styles.fixtureContainer}>
        <Text style={styles.fixtureText}>{player.nextFixture || "TBC"}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* TOP BAR */}
        <View style={styles.topBar}>
          <Text style={styles.screenTitle}>Transfers</Text>
          <Text style={styles.deadlineText}>Deadline: Sat 24 Jan, 11:00</Text>
        </View>

        <HeaderStats />

        {/* PITCH VIEW */}
        <View style={styles.pitchArea}>
          {/* Reusing your MyTeam CSS Background Logic here */}
          <View style={styles.pitchLines}>
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

        {/* BENCH */}
        <View style={styles.benchArea}>
          <Text style={styles.benchTitle}>BENCH</Text>
          <View style={styles.benchRow}>
            {bench.map((p) => (
              <PlayerSlot key={p.id} player={p} isBench />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* PLAYER PROFILE MODAL (Image 2) */}
      <Modal visible={isPlayerModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalPlayerName}>{playerToSell?.name}</Text>
              <TouchableOpacity onPress={() => setIsPlayerModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalActionRow}>
              <TouchableOpacity
                style={styles.transferOutBtn}
                onPress={() => handleTransferOut(playerToSell)}
              >
                <Ionicons name="swap-horizontal" size={24} color="#fff" />
                <Text style={styles.transferOutText}>Transfer Out</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalStatsRow}>
              <View style={styles.modalStat}>
                <Text style={styles.modalStatVal}>37%</Text>
                <Text style={styles.modalStatLab}>Selected By</Text>
              </View>
              <View style={styles.modalStat}>
                <Text style={styles.modalStatVal}>56 pts</Text>
                <Text style={styles.modalStatLab}>Total</Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* REPLACEMENT LIST MODAL (Image 3 / Create Team List) */}
      <Modal visible={isReplacementListVisible} animationType="slide">
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.replacementHeader}>
            <TouchableOpacity
              onPress={() => setIsReplacementListVisible(false)}
            >
              <Ionicons name="arrow-back" size={24} color="#38003c" />
            </TouchableOpacity>
            <Text style={styles.replacementTitle}>
              Replace {playerToSell?.name}
            </Text>
          </View>

          <FlatList
            data={MOCK_PLAYERS.filter(
              (p) =>
                p.position === playerToSell?.position &&
                p.id !== playerToSell?.id
            )}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.listPlayerCard}
                onPress={() => executeTransfer(item)}
              >
                <View
                  style={[
                    styles.listJersey,
                    { backgroundColor: item.clubColor },
                  ]}
                />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.listName}>{item.name}</Text>
                  <Text style={styles.listClub}>{item.realClub}</Text>
                </View>
                <Text style={styles.listPrice}>₵{item.price}m</Text>
              </TouchableOpacity>
            )}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  topBar: { padding: 15, backgroundColor: "#fff", alignItems: "center" },
  screenTitle: { fontSize: 22, fontWeight: "900", color: "#38003c" },
  deadlineText: { fontSize: 12, color: "#666", marginTop: 4 },

  headerStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  statBox: { alignItems: "center", paddingHorizontal: 15, paddingVertical: 5 },
  statLabel: { fontSize: 10, color: "#888", fontWeight: "bold" },
  statValue: { fontSize: 16, fontWeight: "900", color: "#333" },

  pitchArea: {
    height: 450,
    backgroundColor: "#37B34A",
    margin: 10,
    borderRadius: 15,
    overflow: "hidden",
  },
  pitchLines: { flex: 1, paddingVertical: 10, justifyContent: "space-around" },
  row: { flexDirection: "row", justifyContent: "center", gap: 5 },

  playerSlot: { width: width / 5.5, alignItems: "center" },
  jerseyCard: {
    width: 50,
    height: 60,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  priceTag: {
    position: "absolute",
    top: -10,
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  priceText: { fontSize: 9, fontWeight: "900", color: "#333" },
  nameContainer: {
    backgroundColor: "#fff",
    width: "100%",
    marginTop: 2,
    paddingVertical: 1,
  },
  playerName: { fontSize: 8, fontWeight: "bold", textAlign: "center" },
  fixtureContainer: { backgroundColor: "#38003c", width: "100%" },
  fixtureText: { fontSize: 8, color: "#fff", textAlign: "center" },

  benchArea: {
    backgroundColor: "#A9DFC3",
    margin: 10,
    padding: 15,
    borderRadius: 15,
  },
  benchTitle: {
    fontSize: 10,
    fontWeight: "900",
    color: "#38003c",
    textAlign: "center",
    marginBottom: 10,
  },
  benchRow: { flexDirection: "row", justifyContent: "center", gap: 10 },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  modalPlayerName: { fontSize: 20, fontWeight: "900" },
  transferOutBtn: {
    backgroundColor: "#FF005A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 10,
  },
  transferOutText: { color: "#fff", fontWeight: "900", marginLeft: 10 },

  replacementHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  replacementTitle: { fontSize: 18, fontWeight: "900", marginLeft: 15 },
  listPlayerCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  listJersey: { width: 30, height: 30, borderRadius: 15 },
  listName: { fontSize: 16, fontWeight: "bold" },
  listClub: { fontSize: 12, color: "#888" },
  listPrice: { fontSize: 16, fontWeight: "900", color: "#38003c" },
});
