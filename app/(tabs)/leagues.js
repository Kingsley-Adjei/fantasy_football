import React, { useState, useRef, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
  Modal,
  FlatList,
  StatusBar,
  ActivityIndicator,
  Dimensions,
  Animated,
  PanResponder,
} from "react-native";

const { width, height } = Dimensions.get("window");

const INITIAL_LEAGUES = {
  invitational: [
    {
      id: "1",
      name: "C.S & I.T 🔥🔥",
      currentRank: 80,
      lastRank: 70,
      isAdmin: true,
    },
    {
      id: "2",
      name: "The Sharks",
      currentRank: 22,
      lastRank: 22,
      isAdmin: false,
    },
  ],
  global: [
    { id: "g1", name: "Ghana", currentRank: 18456, lastRank: 16265 },
    { id: "g2", name: "Overall", currentRank: 1971563, lastRank: 1772612 },
  ],
};

const MOCK_STANDINGS = [
  {
    id: 1,
    teamName: "SERN FC",
    manager: "Norbert Jr",
    gwPoints: 29,
    total: 1368,
    rankChange: 0,
  },
  {
    id: 2,
    teamName: "dionahope",
    manager: "Emmanuel Kwashe",
    gwPoints: 34,
    total: 1355,
    rankChange: 0,
  },
  {
    id: 3,
    teamName: "O4",
    manager: "Randy Kusi",
    gwPoints: 51,
    total: 1355,
    rankChange: 1,
  },
  {
    id: 4,
    teamName: "jodeythecreator 11",
    manager: "Jeffrey Agyei",
    gwPoints: 34,
    total: 1352,
    rankChange: -1,
  },
];

// Mock Squad Data for the Pitch View (Starters + Bench)
const MOCK_OPPONENT_SQUAD = [
  { id: 1, name: "Raya", pos: "GK", pts: 6, color: "#EF0107" },
  { id: 2, name: "Saliba", pos: "DEF", pts: 2, color: "#EF0107" },
  { id: 3, name: "Gabriel", pos: "DEF", pts: 15, color: "#EF0107" },
  { id: 4, name: "Gvardiol", pos: "DEF", pts: 1, color: "#6CABDD" },
  { id: 5, name: "Porro", pos: "DEF", pts: 2, color: "#132257" },
  { id: 6, name: "Saka", pos: "MID", pts: 10, color: "#EF0107" },
  { id: 7, name: "Palmer", pos: "MID", pts: 3, color: "#034694" },
  { id: 8, name: "Foden", pos: "MID", pts: 2, color: "#6CABDD" },
  { id: 9, name: "M.Salah", pos: "MID", pts: 7, color: "#C8102E" },
  { id: 10, name: "Haaland", pos: "FWD", pts: 4, color: "#6CABDD" },
  { id: 11, name: "Watkins", pos: "FWD", pts: 2, color: "#95BFE5" },
  // Bench
  { id: 12, name: "Areola", pos: "GK", pts: 3, color: "#7A263A" },
  { id: 13, name: "Burn", pos: "DEF", pts: 0, color: "#241F20" },
  { id: 14, name: "Gordon", pos: "MID", pts: 1, color: "#241F20" },
  { id: 15, name: "Archer", pos: "FWD", pts: 1, color: "#EE2737" },
];

export default function LeaguesScreen() {
  const [leagues, setLeagues] = useState(INITIAL_LEAGUES);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showStandings, setShowStandings] = useState(false);
  const [showManagerProfile, setShowManagerProfile] = useState(false);
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [selectedManager, setSelectedManager] = useState(null);

  const [leagueCode, setLeagueCode] = useState("");
  const [newLeagueName, setNewLeagueName] = useState("");

  // Swipe-to-Go-Back Logic for Standings Modal
  const translateX = useRef(new Animated.Value(0)).current;
  const standingsPanResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gs) =>
        gs.dx > 20 && Math.abs(gs.dy) < 20,
      onPanResponderMove: (_, gs) => {
        if (gs.dx > 0) translateX.setValue(gs.dx);
      },
      onPanResponderRelease: (_, gs) => {
        if (gs.dx > width * 0.3) {
          Animated.timing(translateX, {
            toValue: width,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            setShowStandings(false);
            translateX.setValue(0);
          });
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  // Pitch Sorting Logic
  const pitchRows = useMemo(
    () => ({
      GKP: MOCK_OPPONENT_SQUAD.slice(0, 11).filter((p) => p.pos === "GK"),
      DEF: MOCK_OPPONENT_SQUAD.slice(0, 11).filter((p) => p.pos === "DEF"),
      MID: MOCK_OPPONENT_SQUAD.slice(0, 11).filter((p) => p.pos === "MID"),
      FWD: MOCK_OPPONENT_SQUAD.slice(0, 11).filter((p) => p.pos === "FWD"),
      BENCH: MOCK_OPPONENT_SQUAD.slice(11, 15),
    }),
    []
  );

  const getRankIndicator = (current, last) => {
    if (current < last) return { icon: "▲", color: "#00FF85" };
    if (current > last) return { icon: "▼", color: "#FF005A" };
    return { icon: "—", color: "#999" };
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      Alert.alert("Updated", "Standings synced.");
    }, 1500);
  };

  const handleJoinLeague = () => {
    if (leagueCode.length < 4) {
      Alert.alert("Error", "Invalid Code");
      return;
    }
    const newEntry = {
      id: Math.random().toString(),
      name: `League ${leagueCode}`,
      currentRank: 500,
      lastRank: 500,
      isAdmin: false,
    };
    setLeagues((prev) => ({
      ...prev,
      invitational: [newEntry, ...prev.invitational],
    }));
    setShowJoinModal(false);
    setLeagueCode("");
  };

  const handleCreateLeague = () => {
    if (!newLeagueName.trim()) return;
    const newEntry = {
      id: Math.random().toString(),
      name: newLeagueName,
      currentRank: 1,
      lastRank: 1,
      isAdmin: true,
    };
    setLeagues((prev) => ({
      ...prev,
      invitational: [newEntry, ...prev.invitational],
    }));
    setShowCreateModal(false);
    setNewLeagueName("");
  };

  const PitchPlayer = ({ player }) => (
    <View style={styles.pitchPlayerContainer}>
      <View
        style={[
          styles.jerseyBox,
          { backgroundColor: player.color || "#37003C" },
        ]}
      >
        <Text style={{ fontSize: 24 }}>👕</Text>
      </View>
      <View style={styles.pitchPlayerNameBox}>
        <Text style={styles.pitchPlayerName} numberOfLines={1}>
          {player.name}
        </Text>
      </View>
      <View style={styles.pitchPlayerPtsBox}>
        <Text style={styles.pitchPlayerPts}>{player.pts}</Text>
      </View>
    </View>
  );

  const LeagueCard = ({ league }) => {
    const indicator = getRankIndicator(league.currentRank, league.lastRank);
    return (
      <TouchableOpacity
        style={styles.proCard}
        onPress={() => {
          setSelectedLeague(league);
          setShowStandings(true);
        }}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{league.name}</Text>
          {league.isAdmin && (
            <View style={styles.adminBadge}>
              <Text style={styles.adminBadgeText}>ADMIN</Text>
            </View>
          )}
        </View>
        <View style={styles.cardStats}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>RANK</Text>
            <View style={styles.rankRow}>
              <Text style={[styles.rankIcon, { color: indicator.color }]}>
                {indicator.icon}
              </Text>
              <Text style={styles.statValue}>
                {league.currentRank.toLocaleString()}
              </Text>
            </View>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>PREVIOUS</Text>
            <Text style={styles.statValueSub}>
              {league.lastRank.toLocaleString()}
            </Text>
          </View>
          <Text style={styles.arrowIcon}>›</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.mainHeader}>
        <Text style={styles.mainTitle}>Leagues</Text>
        <TouchableOpacity
          style={styles.refreshBtn}
          onPress={handleRefresh}
          disabled={isRefreshing}
        >
          {isRefreshing ? (
            <ActivityIndicator size="small" color="#00FF85" />
          ) : (
            <Text style={styles.refreshText}>🔄</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.topStatsRow}>
        <Text style={styles.topStatText}>2 Invitational</Text>
        <Text style={styles.topStatText}>•</Text>
        <Text style={styles.topStatText}>2 Global</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.mainAction}
            onPress={() => setShowJoinModal(true)}
          >
            <Text style={styles.actionEmoji}>⚡</Text>
            <Text style={styles.actionBtnText}>Join League</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.mainAction}
            onPress={() => setShowCreateModal(true)}
          >
            <Text style={styles.actionEmoji}>➕</Text>
            <Text style={styles.actionBtnText}>Create League</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>INVITATIONAL CLASSIC</Text>
          {leagues.invitational.map((l) => (
            <LeagueCard key={l.id} league={l} />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>GLOBAL LEAGUES</Text>
          {leagues.global.map((l) => (
            <LeagueCard key={l.id} league={l} />
          ))}
        </View>
      </ScrollView>

      {/* JOIN / CREATE MODALS (Unchanged logic) */}
      <Modal visible={showJoinModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.proModal}>
            <Text style={styles.modalTitle}>Join League</Text>
            <TextInput
              style={styles.proInput}
              placeholder="Enter Code"
              value={leagueCode}
              onChangeText={setLeagueCode}
              autoCapitalize="characters"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowJoinModal(false)}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={handleJoinLeague}
              >
                <Text style={styles.confirmText}>Join</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showCreateModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.proModal}>
            <Text style={styles.modalTitle}>New League</Text>
            <TextInput
              style={styles.proInput}
              placeholder="League Name"
              value={newLeagueName}
              onChangeText={setNewLeagueName}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowCreateModal(false)}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={handleCreateLeague}
              >
                <Text style={styles.confirmText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* STANDINGS MODAL WITH SWIPE BACK NAVIGATION */}
      <Modal visible={showStandings} animationType="slide">
        <Animated.View
          style={[styles.standingsScreen, { transform: [{ translateX }] }]}
          {...standingsPanResponder.panHandlers}
        >
          <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.standingsTop}>
              <TouchableOpacity onPress={() => setShowStandings(false)}>
                <Text style={styles.backBtn}>← Back</Text>
              </TouchableOpacity>
              <Text style={styles.leagueNameHeader}>
                {selectedLeague?.name}
              </Text>
            </View>
            <FlatList
              data={MOCK_STANDINGS}
              keyExtractor={(item) => item.id.toString()}
              ListHeaderComponent={() => (
                <View style={styles.tableHead}>
                  <Text style={[styles.th, { width: 40 }]}>Pos</Text>
                  <Text style={[styles.th, { flex: 1 }]}>Team & Manager</Text>
                  <Text style={[styles.th, { width: 40, textAlign: "center" }]}>
                    GW
                  </Text>
                  <Text style={[styles.th, { width: 60, textAlign: "right" }]}>
                    Total
                  </Text>
                </View>
              )}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={styles.tableRow}
                  onPress={() => {
                    setSelectedManager(item);
                    setShowManagerProfile(true);
                  }}
                >
                  <Text style={styles.posText}>{index + 1}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.teamText}>{item.teamName}</Text>
                    <Text style={styles.managerText}>{item.manager}</Text>
                  </View>
                  <Text style={styles.gwPoints}>{item.gwPoints}</Text>
                  <Text style={styles.totalPoints}>{item.total}</Text>
                </TouchableOpacity>
              )}
            />
          </SafeAreaView>
        </Animated.View>

        {/* MANAGER PROFILE & STRIPED PITCH VIEW */}
        <Modal visible={showManagerProfile} transparent animationType="slide">
          <View style={styles.managerOverlay}>
            <View style={styles.managerCardFull}>
              <View style={styles.managerCardHeader}>
                <View>
                  <Text style={styles.managerName}>
                    {selectedManager?.manager}
                  </Text>
                  <Text style={styles.managerSub}>
                    {selectedManager?.teamName}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setShowManagerProfile(false)}>
                  <Text style={{ fontSize: 20, color: "#37003C" }}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.managerStatsRow}>
                <View style={styles.mStatItem}>
                  <Text style={styles.mStatLabel}>GW POINTS</Text>
                  <Text style={styles.mStatValue}>
                    {selectedManager?.gwPoints}
                  </Text>
                </View>
                <View style={styles.mStatItem}>
                  <Text style={styles.mStatLabel}>TOTAL POINTS</Text>
                  <Text style={styles.mStatValue}>
                    {selectedManager?.total}
                  </Text>
                </View>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {/* THE PITCH AREA */}
                <View style={styles.pitchContainer}>
                  <View style={StyleSheet.absoluteFill}>
                    {[...Array(10)].map((_, i) => (
                      <View
                        key={i}
                        style={[
                          styles.stripe,
                          {
                            backgroundColor:
                              i % 2 === 0 ? "#37B34A" : "#2FA03F",
                          },
                        ]}
                      />
                    ))}
                  </View>
                  <View style={styles.pitchContent}>
                    <View style={styles.pitchRow}>
                      {pitchRows.GKP.map((p) => (
                        <PitchPlayer key={p.id} player={p} />
                      ))}
                    </View>
                    <View style={styles.pitchRow}>
                      {pitchRows.DEF.map((p) => (
                        <PitchPlayer key={p.id} player={p} />
                      ))}
                    </View>
                    <View style={styles.pitchRow}>
                      {pitchRows.MID.map((p) => (
                        <PitchPlayer key={p.id} player={p} />
                      ))}
                    </View>
                    <View style={styles.pitchRow}>
                      {pitchRows.FWD.map((p) => (
                        <PitchPlayer key={p.id} player={p} />
                      ))}
                    </View>
                  </View>
                </View>

                {/* THE BENCH AREA */}
                <View style={styles.subContainer}>
                  <View style={styles.subHeader}>
                    <Text style={styles.subHeaderTextMain}>SUBSTITUTES</Text>
                  </View>
                  <View style={styles.subRow}>
                    {pitchRows.BENCH.map((p) => (
                      <PitchPlayer key={p.id} player={p} />
                    ))}
                  </View>
                </View>
                <View style={{ height: 40 }} />
              </ScrollView>

              <TouchableOpacity
                style={styles.closeManagerBtn}
                onPress={() => setShowManagerProfile(false)}
              >
                <Text style={styles.closeManagerText}>Close View</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#37003C" },
  mainHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  mainTitle: { fontSize: 32, fontWeight: "900", color: "#FFF" },
  refreshBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
  },
  refreshText: { fontSize: 18 },
  topStatsRow: {
    flexDirection: "row",
    paddingHorizontal: 22,
    gap: 10,
    marginBottom: 20,
  },
  topStatText: { color: "#00FF85", fontSize: 12, fontWeight: "700" },
  actionRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 30,
  },
  mainAction: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    elevation: 4,
  },
  actionEmoji: { fontSize: 18, marginRight: 8 },
  actionBtnText: { fontWeight: "900", color: "#37003C", fontSize: 14 },
  section: { marginBottom: 25 },
  sectionHeader: {
    color: "#00FF85",
    fontSize: 12,
    fontWeight: "900",
    marginLeft: 20,
    marginBottom: 15,
    letterSpacing: 1.5,
  },
  proCard: {
    backgroundColor: "#4D0052",
    marginHorizontal: 18,
    padding: 20,
    borderRadius: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardHeader: { flex: 1 },
  cardTitle: { color: "#FFF", fontSize: 18, fontWeight: "900" },
  adminBadge: {
    backgroundColor: "#00FF85",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 5,
    alignSelf: "flex-start",
  },
  adminBadgeText: { fontSize: 9, fontWeight: "900", color: "#37003C" },
  cardStats: { flexDirection: "row", alignItems: "center" },
  statBox: { marginRight: 20 },
  statLabel: { color: "#AAA", fontSize: 8, fontWeight: "800", marginBottom: 2 },
  rankRow: { flexDirection: "row", alignItems: "center" },
  rankIcon: { fontSize: 10, marginRight: 3 },
  statValue: { color: "#FFF", fontSize: 18, fontWeight: "900" },
  statValueSub: { color: "#AAA", fontSize: 16, fontWeight: "700" },
  arrowIcon: { color: "#00FF85", fontSize: 26, fontWeight: "300" },
  standingsScreen: { flex: 1, backgroundColor: "#37003C" },
  standingsTop: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  backBtn: { color: "#00FF85", fontWeight: "800", fontSize: 16 },
  leagueNameHeader: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "900",
    marginLeft: 20,
  },
  tableHead: { flexDirection: "row", padding: 15, backgroundColor: "#4D0052" },
  th: { color: "#AAA", fontSize: 11, fontWeight: "900" },
  tableRow: {
    flexDirection: "row",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
  },
  posText: { color: "#FFF", width: 40, fontWeight: "900", fontSize: 16 },
  teamText: { color: "#FFF", fontSize: 15, fontWeight: "800" },
  managerText: { color: "#AAA", fontSize: 13 },
  gwPoints: {
    color: "#FFF",
    width: 40,
    textAlign: "center",
    fontWeight: "700",
  },
  totalPoints: {
    color: "#00FF85",
    width: 60,
    textAlign: "right",
    fontWeight: "900",
    fontSize: 16,
  },
  managerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "flex-end",
  },
  managerCardFull: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    height: height * 0.9,
  },
  managerCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  managerName: { fontSize: 22, fontWeight: "900", color: "#37003C" },
  managerSub: { fontSize: 14, color: "#666", fontWeight: "600" },
  managerStatsRow: {
    flexDirection: "row",
    backgroundColor: "#F2F2F2",
    borderRadius: 15,
    padding: 12,
    marginBottom: 15,
  },
  mStatItem: { flex: 1, alignItems: "center" },
  mStatLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "#999",
    marginBottom: 3,
  },
  mStatValue: { fontSize: 18, fontWeight: "900", color: "#37003C" },

  // PITCH STYLE
  pitchContainer: {
    height: height * 0.52,
    backgroundColor: "#2FA03F",
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 15,
  },
  stripe: { flex: 1 },
  pitchContent: {
    flex: 1,
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  pitchRow: { flexDirection: "row", justifyContent: "center", gap: 5 },
  pitchPlayerContainer: { alignItems: "center", width: 65 },
  jerseyBox: {
    width: 45,
    height: 45,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  pitchPlayerNameBox: { backgroundColor: "#FFF", width: "100%", marginTop: 2 },
  pitchPlayerName: {
    fontSize: 8,
    fontWeight: "900",
    color: "#37003C",
    textAlign: "center",
  },
  pitchPlayerPtsBox: {
    backgroundColor: "#37003C",
    width: "100%",
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  pitchPlayerPts: {
    fontSize: 9,
    fontWeight: "900",
    color: "#00FF85",
    textAlign: "center",
  },

  // BENCH STYLE
  subContainer: {
    backgroundColor: "#A9DFC3",
    borderRadius: 15,
    paddingBottom: 15,
  },
  subHeader: { alignItems: "center", paddingVertical: 8 },
  subHeaderTextMain: { fontSize: 11, fontWeight: "900", color: "#37003C" },
  subRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 10,
  },

  closeManagerBtn: {
    backgroundColor: "#37003C",
    paddingVertical: 14,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 10,
  },
  closeManagerText: { color: "#FFF", fontWeight: "900" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    padding: 20,
  },
  proModal: { backgroundColor: "#FFF", borderRadius: 25, padding: 25 },
  modalTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#37003C",
    marginBottom: 20,
  },
  proInput: {
    backgroundColor: "#F2F2F2",
    padding: 18,
    borderRadius: 15,
    fontSize: 16,
    fontWeight: "700",
    color: "#37003C",
    marginBottom: 20,
  },
  modalButtons: { flexDirection: "row", gap: 10 },
  cancelBtn: { flex: 1, alignItems: "center", paddingVertical: 15 },
  confirmBtn: {
    flex: 1,
    backgroundColor: "#37003C",
    borderRadius: 15,
    alignItems: "center",
    paddingVertical: 15,
  },
  confirmText: { color: "#FFF", fontWeight: "900" },
});
