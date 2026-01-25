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
  Modal,
  FlatList,
} from "react-native";
import { POSITIONS, sortPlayersFPLStyle } from "../../src/constants/positions";
import { MOCK_PLAYERS } from "../../src/services/api";
import SearchBar from "../../src/components/ui/SearchBar";

const { width, height } = Dimensions.get("window");

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

const PlayerProfileModal = ({
  visible,
  player,
  onClose,
  onTransferOut,
  onMakeCaptain,
  showTransferButton,
  showCaptainButton,
}) => {
  const slideAnim = React.useRef(new Animated.Value(height)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 50,
          friction: 8,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      slideAnim.setValue(height);
      fadeAnim.setValue(0);
    }
  }, [visible]);

  if (!player) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
        <TouchableOpacity
          style={styles.modalBackground}
          activeOpacity={1}
          onPress={onClose}
        />
        <Animated.View
          style={[
            styles.profileContainer,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View
              style={[
                styles.profileHeader,
                { backgroundColor: player.clubColor || "#37003C" },
              ]}
            >
              <View style={styles.gradientOverlay} />
              <View style={styles.avatarContainer}>
                <View style={styles.avatarCircle}>
                  <Text style={{ fontSize: 50 }}>👤</Text>
                </View>
              </View>
              <View style={styles.playerNameSection}>
                <Text style={styles.playerName}>{player.name}</Text>
                <View style={styles.clubRow}>
                  <Text style={styles.clubText}>
                    {player.realClub} - {player.position}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.actionButtonsRow}>
              {showCaptainButton && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={onMakeCaptain}
                >
                  <View
                    style={[
                      styles.actionIconCircle,
                      { backgroundColor: "#9C27B0" },
                    ]}
                  >
                    <Text style={styles.actionIcon}>C</Text>
                  </View>
                  <Text style={styles.actionLabel}>Make captain</Text>
                </TouchableOpacity>
              )}
              {showTransferButton && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={onTransferOut}
                >
                  <View
                    style={[
                      styles.actionIconCircle,
                      { backgroundColor: "#F44336" },
                    ]}
                  >
                    <Text style={styles.actionIcon}>↔️</Text>
                  </View>
                  <Text style={styles.actionLabel}>Transfer out</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Price</Text>
                <Text style={styles.statValue}>₵{player.price}m</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Total</Text>
                <Text style={styles.statValue}>104 pts</Text>
              </View>
            </View>

            <View style={styles.fixturesSection}>
              <Text style={styles.sectionTitle}>Upcoming Fixtures</Text>
              <View style={styles.fixtureRow}>
                <Text style={styles.fixtureOpponent}>LIV (H)</Text>
                <Text style={styles.fixtureDate}>Sat 31 Jan</Text>
              </View>
            </View>
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default function MyTeamScreen({ selectedPlayers = MOCK_SQUAD }) {
  const [selectedPlayerProfile, setSelectedPlayerProfile] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const [mode, setMode] = useState("team");
  const [squad, setSquad] = useState(selectedPlayers);

  const [originalSquad, setOriginalSquad] = useState(selectedPlayers);
  const [captainId, setCaptainId] = useState(10);
  const [selectedForSwap, setSelectedForSwap] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  const [freeTransfers, setFreeTransfers] = useState(1);
  const [budget, setBudget] = useState(1.1);
  const [playerToTransferOut, setPlayerToTransferOut] = useState(null);
  const [playerToTransferIn, setPlayerToTransferIn] = useState(null);
  const [showPlayerList, setShowPlayerList] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [allPlayers] = useState(sortPlayersFPLStyle(MOCK_PLAYERS));

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

  const pointsDeduction = useMemo(() => {
    const transfersMade = playerToTransferOut && playerToTransferIn ? 1 : 0;
    return transfersMade > freeTransfers
      ? (transfersMade - freeTransfers) * 4
      : 0;
  }, [playerToTransferOut, playerToTransferIn, freeTransfers]);

  const filteredPlayers = useMemo(() => {
    if (!playerToTransferOut) return [];
    return allPlayers.filter((player) => {
      if (player.position !== playerToTransferOut.position) return false;
      if (squad.find((p) => p.id === player.id)) return false;
      return player.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [allPlayers, searchQuery, playerToTransferOut, squad]);

  // --- TEAM FUNCTIONS ---
  const handlePlayerPressTeamMode = (player, isBench) => {
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

  // --- TRANSFER FUNCTIONS ---
  const handlePlayerPressTransferMode = (player, isBench) => {
    if (playerToTransferOut?.id === player.id) {
      setPlayerToTransferOut(null);
      return;
    }
    setPlayerToTransferOut(player);
    setShowPlayerList(true);
  };

  const handleSelectIn = (player) => {
    const priceDiff = player.price - playerToTransferOut.price;
    if (priceDiff > budget) {
      Alert.alert(
        "Insufficient Budget",
        `You need ₵${(priceDiff - budget).toFixed(1)}m more.`
      );
      return;
    }
    const clubCount = squad.filter(
      (p) => p.realClub === player.realClub && p.id !== playerToTransferOut.id
    ).length;
    if (clubCount >= 3) {
      Alert.alert(
        "Club Limit",
        `Max 3 players allowed from ${player.realClub}`
      );
      return;
    }
    setPlayerToTransferIn(player);
    setShowPlayerList(false);
  };

  const executeTransfer = () => {
    const wasCaptain = playerToTransferOut.id === captainId;
    const newSquad = squad.map((p) =>
      p.id === playerToTransferOut.id ? playerToTransferIn : p
    );
    if (wasCaptain) {
      setCaptainId(pendingTransferIn.id);
    }
    const priceDiff = playerToTransferOut.price - playerToTransferIn.price;
    setSquad(newSquad);
    setBudget((prev) => prev + priceDiff);
    if (freeTransfers > 0) setFreeTransfers((prev) => prev - 1);
    setPlayerToTransferOut(null);
    setPlayerToTransferIn(null);
    Alert.alert("Success! ✅", "Transfer completed!");
  };

  // --- RENDER HELPERS ---
  const PlayerSlot = ({ player, isBench }) => {
    if (!player) return null;
    const isCaptain = player.id === captainId;
    const isSelectedSwap = mode === "team" && selectedForSwap?.id === player.id;
    const isTransferOut =
      mode === "transfers" && playerToTransferOut?.id === player.id;

    return (
      <View style={styles.playerSlotContainer}>
        {/* 1. JERSEY AREA: For Management (Swaps/Transfers) */}
        <TouchableOpacity
          style={[
            styles.playerSlot,
            (isSelectedSwap || isTransferOut) && styles.playerSlotSelected,
          ]}
          onPress={() =>
            mode === "team"
              ? handlePlayerPressTeamMode(player, isBench)
              : handlePlayerPressTransferMode(player, isBench)
          }
          onLongPress={() =>
            mode === "team" && !isBench && setCaptainId(player.id)
          }
        >
          <View
            style={[
              styles.jerseyCard,
              { backgroundColor: player.clubColor },
              isSelectedSwap && styles.jerseyGlow,
              isTransferOut && styles.jerseyTransferOut,
            ]}
          >
            <Text style={styles.jerseyEmoji}>👕</Text>
            {isCaptain && !isBench && mode === "team" && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>C</Text>
              </View>
            )}
            {isTransferOut && (
              <View style={styles.transferOutBadge}>
                <Text style={styles.transferOutText}>OUT</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>

        {/* 2. TEXT AREA: For Information (Player Profile) */}
        <TouchableOpacity
          onPress={() => {
            setSelectedPlayerProfile(player);
            setShowProfileModal(true);
          }}
          style={styles.infoTouchArea} // FIX: Changed StyleSheet to styles
        >
          <View style={styles.playerNameBox}>
            <Text style={styles.playerNameText} numberOfLines={1}>
              {player.name}
            </Text>
          </View>
          <View style={styles.fixtureBox}>
            <Text style={styles.fixtureText}>
              {mode === "transfers"
                ? `₵${player.price.toFixed(1)}m`
                : player.nextFixture}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const handleRevertChanges = () => {
    Alert.alert(
      "Reset Changes?",
      "This will undo all unsaved swaps or transfers.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Revert",
          onPress: () => {
            setSquad(originalSquad);
            setPlayerToTransferOut(null);
            setPlayerToTransferIn(null);
            setSelectedForSwap(null);
            setHasChanges(false);
            setBudget(1.1);
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.headerTitle}>Pick Team</Text>

            <View style={styles.headerButtonGroup}>
              {(hasChanges || playerToTransferOut) && (
                <TouchableOpacity
                  style={[styles.saveBtn || { backgroundColor: "#EEE" }]}
                  onPress={handleRevertChanges}
                >
                  <Text style={[styles.saveBtnText, { color: "#666" }]}>
                    Revert
                  </Text>
                </TouchableOpacity>
              )}

              {(hasChanges || (playerToTransferOut && playerToTransferIn)) && (
                <TouchableOpacity
                  style={styles.saveBtn}
                  onPress={() =>
                    mode === "team"
                      ? (Alert.alert("Saved!"), setHasChanges(false))
                      : executeTransfer()
                  }
                >
                  <Text style={styles.saveBtnText}>Save</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          <Text style={styles.headerSubtitle}>
            Gameweek 23 •{" "}
            <Text style={{ fontWeight: "700" }}>
              Deadline: Sat 24 Jan, 11:00
            </Text>
          </Text>
        </View>

        <View style={styles.modeToggle}>
          <TouchableOpacity
            style={[styles.toggleBtn, mode === "team" && styles.toggleActive]}
            onPress={() => setMode("team")}
          >
            <Text
              style={[
                styles.toggleText,
                mode === "team" && styles.toggleTextActive,
              ]}
            >
              My Team
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleBtn,
              mode === "transfers" && styles.toggleActive,
            ]}
            onPress={() => setMode("transfers")}
          >
            <Text
              style={[
                styles.toggleText,
                mode === "transfers" && styles.toggleTextActive,
              ]}
            >
              Transfers
            </Text>
          </TouchableOpacity>
        </View>

        {mode === "transfers" && (
          <View style={styles.transferStats}>
            <View style={styles.statBox}>
              <Text style={styles.statVal}>{freeTransfers}</Text>
              <Text style={styles.statLab}>Free</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statVal}>{pointsDeduction}</Text>
              <Text style={styles.statLab}>Cost</Text>
            </View>
            <View style={[styles.statBox, styles.budgetBox]}>
              <Text style={styles.statVal}>₵{budget.toFixed(1)}m</Text>
              <Text style={styles.statLab}>Budget</Text>
            </View>
          </View>
        )}

        <View style={styles.chipsGrid}>
          {[
            { n: "Bench Boost", e: "⬆️" },
            { n: "Triple Captain", e: "👑" },
            { n: "Wildcard", e: "🃏" },
            { n: "Free Hit", e: "⚡" },
          ].map((c, i) => (
            <View key={i} style={styles.chipCard}>
              <View style={styles.chipIcon}>
                <Text style={{ fontSize: 18 }}>{c.e}</Text>
              </View>
              <Text style={styles.chipName}>{c.n}</Text>
              <TouchableOpacity style={styles.playBtn}>
                <Text style={styles.playText}>Play</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.pitchContainer}>
          <View style={StyleSheet.absoluteFill}>
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
            {bench.map((p, index) => (
              <PlayerSlot key={`bench-${p.id}-${index}`} player={p} />
            ))}
          </View>
        </View>
      </ScrollView>

      <Modal visible={showPlayerList} animationType="slide">
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowPlayerList(false)}>
              <Text style={{ fontSize: 18 }}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              Replace {playerToTransferOut?.name}
            </Text>
          </View>
          <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
          <FlatList
            data={filteredPlayers}
            keyExtractor={(item) => `list-${item.id}`} // FIXED UNIQUE KEY ERROR
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.listCard}
                onPress={() => handleSelectIn(item)}
              >
                <View
                  style={[
                    styles.listJersey,
                    { backgroundColor: item.clubColor },
                  ]}
                >
                  <Text>👕</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 15 }}>
                  <Text style={styles.listName}>{item.name}</Text>
                  <Text style={styles.listClub}>
                    {item.realClub} • {item.position}
                  </Text>
                </View>
                <Text style={styles.listPrice}>₵{item.price.toFixed(1)}m</Text>
              </TouchableOpacity>
            )}
          />
        </SafeAreaView>
      </Modal>
      <PlayerProfileModal
        visible={showProfileModal}
        player={selectedPlayerProfile}
        onClose={() => setShowProfileModal(false)}
        onTransferOut={() => {
          setShowProfileModal(false);
          handlePlayerPressTransferMode(selectedPlayerProfile, false);
        }}
        onMakeCaptain={() => {
          setCaptainId(selectedPlayerProfile.id);
          setHasChanges(true);
          setShowProfileModal(false);
        }}
        showTransferButton={mode === "transfers"}
        showCaptainButton={mode === "team"}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
  },
  modalBackground: { flex: 1 },
  profileContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "85%",
    elevation: 10,
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: { fontSize: 20, color: "#FFFFFF", fontWeight: "700" },
  profileHeader: {
    paddingTop: 40,
    paddingBottom: 24,
    paddingHorizontal: 20,
    position: "relative",
    overflow: "hidden",
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  playerName: {
    fontSize: 28,
    fontWeight: "900",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  clubText: { fontSize: 15, fontWeight: "700", color: "#FFFFFF" },
  actionButtonsRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 20,
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  actionIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  actionIcon: { fontSize: 24, color: "#FFFFFF", fontWeight: "700" },
  actionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#37003C",
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#F8F8F8",
    marginHorizontal: 20,
    marginVertical: 16,
    padding: 16,
    borderRadius: 12,
  },
  statItem: { flex: 1, alignItems: "center" },
  statValue: { fontSize: 18, fontWeight: "900", color: "#37003C" },
  statDivider: { width: 1, backgroundColor: "#E0E0E0", marginHorizontal: 12 },
  fixturesSection: { paddingHorizontal: 20, paddingVertical: 16 },
  fixtureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
  },

  playerSlotContainer: {
    alignItems: "center",
    width: width / 5.4,
    marginBottom: 10,
  },
  infoTouchArea: {
    width: "100%",
    alignItems: "center",
    marginTop: 2,
  },
  // Modal Styles for Profile
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  profileContainer: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "60%",
  },
  container: { flex: 1, backgroundColor: "#FFF" },
  header: { alignItems: "center", paddingVertical: 10 },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // Keeps Title centered
    width: "100%",
    position: "relative", // Context for the absolute button group
  },
  headerButtonGroup: {
    position: "absolute",
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6, // Space between Revert and Save
  }, // Style for Revert (Secondary)
  revertBtn: {
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DDD",
  },
  revertBtnText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#666",
  },

  // Style for Save (Primary)
  saveBtnAction: {
    backgroundColor: "#00FF85",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    elevation: 2, // Slight shadow for the primary action
  },
  saveBtnText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#37003C",
  },
  headerTitle: { fontSize: 22, fontWeight: "900", color: "#37003C" },
  headerSubtitle: { fontSize: 12, color: "#666", marginTop: 4 },
  saveBtn: {
    backgroundColor: "#00FF85",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  saveBtnText: { fontSize: 12, fontWeight: "900", color: "#37003C" },

  modeToggle: {
    flexDirection: "row",
    backgroundColor: "#F0F0F0",
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 3,
    marginVertical: 10,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 8,
  },
  toggleActive: { backgroundColor: "#FFF", elevation: 2 },
  toggleText: { fontSize: 13, fontWeight: "800", color: "#888" },
  toggleTextActive: { color: "#37003C" },

  transferStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  statBox: {
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    padding: 8,
    borderRadius: 8,
    width: "30%",
  },
  statVal: { fontSize: 16, fontWeight: "900", color: "#37003C" },
  statLab: { fontSize: 10, fontWeight: "700", color: "#888" },
  budgetBox: { backgroundColor: "#E8F5E9" },
  chipsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  chipCard: {
    width: (width - 40) / 4,
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 6,
    borderWidth: 1,
    borderColor: "#EEE",
    elevation: 1,
  },
  chipIcon: {
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: "#F0F8FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  chipName: {
    fontSize: 8,
    fontWeight: "800",
    color: "#37003C",
    textAlign: "center",
    height: 20,
  },
  playBtn: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: "#37003C",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  playText: { fontSize: 9, fontWeight: "900", color: "#37003C" },

  pitchContainer: {
    height: height * 0.55,
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
  row: { flexDirection: "row", justifyContent: "center", gap: 2 },

  playerSlot: { alignItems: "center", width: width / 5.4 },
  playerSlotSelected: { transform: [{ scale: 1.05 }] },
  jerseyCard: {
    width: 55,
    height: 65,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
    elevation: 5,
  },
  jerseyGlow: {
    shadowColor: "#00FF85",
    shadowOpacity: 1,
    shadowRadius: 15,
    borderColor: "#00FF85",
    borderWidth: 3,
  },
  jerseyTransferOut: { opacity: 0.5, borderColor: "#FF005A", borderWidth: 2 },
  jerseyEmoji: { fontSize: 35 },
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#37003C",
    borderWidth: 2,
    borderColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: { color: "#FFF", fontSize: 11, fontWeight: "900" },
  transferOutBadge: {
    position: "absolute",
    top: -5,
    left: -5,
    backgroundColor: "#FF005A",
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  transferOutText: { color: "#FFF", fontSize: 8, fontWeight: "900" },

  playerNameBox: {
    backgroundColor: "#FFF",
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
    color: "#FFF",
    textAlign: "center",
    fontWeight: "bold",
  },

  subContainer: {
    backgroundColor: "#A9DFC3",
    marginHorizontal: 5,
    marginTop: 10,
    borderRadius: 15,
    paddingBottom: 15,
  },
  subContainerActive: {
    backgroundColor: "#E8F5E9",
    borderTopColor: "#00FF85",
    borderTopWidth: 4,
  },
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
  },
  benchLabel: { width: width / 5.4, alignItems: "center" },
  benchLabelText: {
    fontSize: 9,
    fontWeight: "900",
    color: "#37003C",
    opacity: 0.7,
  },
  subRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 5,
  },

  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#EEE",
  },
  listTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "900",
    color: "#37003C",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderColor: "#EEE",
  },
  modalTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  listCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#EEE",
  },
  listJersey: { width: 30, height: 30, borderRadius: 15 },
  listName: { fontSize: 16, fontWeight: "bold", color: "#333" },
  listClub: { fontSize: 12, color: "#666" },
  listPrice: { fontSize: 16, fontWeight: "900", color: "#37003C" },
});
