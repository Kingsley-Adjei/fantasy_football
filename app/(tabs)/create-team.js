import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { COLORS } from "../../src/constants/colors";
import {
  TOTAL_SQUAD_SIZE,
  MAX_BUDGET,
  validateSquadComposition,
  sortPlayersFPLStyle,
  isPositionFull,
  POSITIONS,
} from "../../src/constants/positions";
import { MOCK_PLAYERS, createInitialSquad } from "../../src/services/api";

import SearchBar from "../../src/components/ui/SearchBar";
import CustomInput from "../../src/components/ui/CustomInput";
import CustomButton from "../../src/components/ui/CustomButton";
import BudgetTracker from "../../src/components/team/BudgetTracker";
import PositionFilter from "../../src/components/team/PositionFilter";
import PlayerCard from "../../src/components/team/PlayerCard";
import StepIndicator from "../../src/components/team/StepIndicator";

export default function CreateTeamScreen() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [teamName, setTeamName] = useState("");
  const [teamNameError, setTeamNameError] = useState("");
  const [allPlayers, setAllPlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("ALL");
  const [loading, setLoading] = useState(false);

  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadPlayers();
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [step]);

  const loadPlayers = async () => {
    try {
      const sorted = sortPlayersFPLStyle(MOCK_PLAYERS);
      setAllPlayers(sorted);
    } catch (error) {
      Alert.alert("Error", "Failed to load players");
    }
  };

  const totalSpent = selectedPlayers.reduce((sum, p) => sum + p.price, 0);
  const isOverBudget = totalSpent > MAX_BUDGET;

  const filteredPlayers = allPlayers.filter((player) => {
    const matchesSearch = player.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesPosition =
      selectedPosition === "ALL" || player.position === selectedPosition;
    return matchesSearch && matchesPosition;
  });

  const canAddPlayer = (player) => {
    if (selectedPlayers.find((p) => p.id === player.id)) return false;
    if (selectedPlayers.length >= TOTAL_SQUAD_SIZE) return false;
    if (totalSpent + player.price > MAX_BUDGET) return false;

    // NEW: Club Limit Check
    const clubCount = selectedPlayers.filter(
      (p) => p.realClub === player.realClub
    ).length;
    if (clubCount >= 3) {
      Alert.alert(
        "Club Limit",
        `You can only select 3 players from ${player.realClub}`
      );
      return false;
    }
  };

  const togglePlayer = (player) => {
    const isSelected = selectedPlayers.find((p) => p.id === player.id);
    if (isSelected) {
      setSelectedPlayers((prev) => prev.filter((p) => p.id !== player.id));
    } else {
      if (!canAddPlayer(player)) {
        return;
      }
      setSelectedPlayers((prev) => [...prev, player]);
    }
  };

  const handleSmartShuffle = () => {
    let currentSquad = [...selectedPlayers];
    let currentBudget = totalSpent;
    const limits = { GK: 2, DF: 5, MID: 5, FWD: 3 };
    let available = allPlayers.filter(
      (p) => !currentSquad.find((s) => s.id === p.id)
    );

    ["GK", "DF", "MID", "FWD"].forEach((pos) => {
      const currentCount = currentSquad.filter(
        (p) => p.position === pos
      ).length;
      const needed = limits[pos] - currentCount;
      for (let i = 0; i < needed; i++) {
        const affordable = available.filter(
          (p) => p.position === pos && currentBudget + p.price <= MAX_BUDGET
        );
        if (affordable.length > 0) {
          const chosen = affordable.sort((a, b) => a.price - b.price)[0];
          currentSquad.push(chosen);
          currentBudget += chosen.price;
          available = available.filter((p) => p.id !== chosen.id);
        }
      }
    });
    setSelectedPlayers(currentSquad);
  };

  const handleResetSquad = () => {
    Alert.alert("Reset Squad?", "This will clear all your selections.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Reset",
        style: "destructive",
        onPress: () => setSelectedPlayers([]),
      },
    ]);
  };

  const handleNextStep = () => {
    if (!teamName.trim()) {
      setTeamNameError("Please enter a team name");
      return;
    }
    fadeAnim.setValue(0);
    setStep(2);
  };

  const handlePreviousStep = () => {
    fadeAnim.setValue(0);
    setStep(1);
  };

  const handleCreateTeam = async () => {
    const validation = validateSquadComposition(selectedPlayers);
    if (!validation.isValid) {
      Alert.alert("Incomplete Squad", validation.errors.join("\n"));
      return;
    }
    setLoading(true);
    try {
      await createInitialSquad(
        1,
        teamName,
        selectedPlayers.map((p) => p.id)
      );
      Alert.alert("Success! 🎉", "Team created!", [
        { text: "OK", onPress: () => router.replace("/(tabs)/my-team") },
      ]);
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Team Name Input
  if (step === 1) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <StepIndicator currentStep={1} totalSteps={2} />

          <View style={styles.setupContainer}>
            <View style={styles.welcomeSection}>
              <Text style={styles.emoji}>⚽</Text>
              <Text style={styles.title}>Create Your Team</Text>
              <Text style={styles.setupSubtitle}>
                Choose a unique name that represents your squad
              </Text>
            </View>

            <View style={styles.formSection}>
              <CustomInput
                label="Team Name"
                value={teamName}
                onChangeText={(text) => {
                  setTeamName(text);
                  setTeamNameError("");
                }}
                placeholder="e.g., The Mighty Eagles"
                error={teamNameError}
                autoFocus
              />

              <View style={styles.tipBox}>
                <Text style={styles.tipIcon}>💡</Text>
                <Text style={styles.tipText}>
                  Your team name will be visible in leagues and leaderboards
                </Text>
              </View>
            </View>

            <View style={styles.step1Footer}>
              <CustomButton
                title="Next: Build Squad →"
                onPress={handleNextStep}
                disabled={!teamName.trim()}
              />
            </View>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    );
  }

  // Step 2: Player Selection
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <StepIndicator currentStep={2} totalSteps={2} />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header with Team Name */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Build Your Squad</Text>
              <View style={styles.teamNameBadge}>
                <Text style={styles.teamNameLabel}>TEAM:</Text>
                <Text style={styles.teamNameText}>{teamName}</Text>
              </View>
            </View>
          </View>

          {/* Squad Overview Dashboard */}
          <View style={styles.dashboardContainer}>
            <View style={styles.dashboardHeader}>
              <Text style={styles.dashboardTitle}>Squad Overview</Text>
              <View style={styles.dashboardBadge}>
                <Text style={styles.dashboardBadgeText}>
                  {selectedPlayers.length}/{TOTAL_SQUAD_SIZE}
                </Text>
              </View>
            </View>

            <View style={styles.statRow}>
              {Object.entries(POSITIONS).map(([key, config]) => {
                const count = selectedPlayers.filter(
                  (p) => p.position === key
                ).length;
                const isComplete = count === config.required;

                return (
                  <View key={key} style={styles.statItem}>
                    <View
                      style={[
                        styles.statCircle,
                        isComplete && styles.statCircleComplete,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statValue,
                          isComplete && styles.statValueComplete,
                        ]}
                      >
                        {count}
                      </Text>
                    </View>
                    <Text style={styles.statLabel}>{config.short}</Text>
                    <Text style={styles.statRequired}>/{config.required}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Budget Tracker */}
          <BudgetTracker
            spent={totalSpent}
            selectedCount={selectedPlayers.length}
            totalRequired={TOTAL_SQUAD_SIZE}
          />

          {/* Action Buttons Row */}
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity
              style={[
                styles.secondaryButton,
                selectedPlayers.length >= TOTAL_SQUAD_SIZE &&
                  styles.secondaryButtonDisabled,
              ]}
              onPress={handleSmartShuffle}
              disabled={selectedPlayers.length >= TOTAL_SQUAD_SIZE}
            >
              <Text style={styles.secondaryButtonIcon}>✨</Text>
              <Text
                style={[
                  styles.secondaryButtonText,
                  selectedPlayers.length >= TOTAL_SQUAD_SIZE &&
                    styles.secondaryButtonTextDisabled,
                ]}
              >
                Auto-Pick
              </Text>
            </TouchableOpacity>

            {selectedPlayers.length > 0 && (
              <TouchableOpacity
                style={styles.resetButton}
                onPress={handleResetSquad}
              >
                <Text style={styles.resetButtonIcon}>↺</Text>
                <Text style={styles.resetButtonText}>Reset</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Search Bar */}
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search players..."
          />

          {/* Position Filter */}
          <PositionFilter
            selectedPosition={selectedPosition}
            onSelectPosition={setSelectedPosition}
          />

          {/* Players List */}
          <FlatList
            data={filteredPlayers}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => {
              const isSelected = !!selectedPlayers.find(
                (p) => p.id === item.id
              );
              const positionIsFull = isPositionFull(
                item.position,
                selectedPlayers
              );
              const disabled =
                !isSelected &&
                (positionIsFull || totalSpent + item.price > MAX_BUDGET);
              return (
                <PlayerCard
                  player={item}
                  isSelected={isSelected}
                  onPress={() => togglePlayer(item)}
                  disabled={disabled}
                  positionFull={positionIsFull}
                />
              );
            }}
            contentContainerStyle={styles.list}
            scrollEnabled={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No players found</Text>
                <Text style={styles.emptySubtext}>
                  Try adjusting your search or filters
                </Text>
              </View>
            }
          />
        </ScrollView>

        {/* Bottom Actions */}
        <View style={styles.bottomActions}>
          {isOverBudget && (
            <View style={styles.warningBanner}>
              <Text style={styles.warningIcon}>⚠️</Text>
              <Text style={styles.warningText}>
                Budget exceeded by ₵{(totalSpent - MAX_BUDGET).toFixed(1)}
              </Text>
            </View>
          )}

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handlePreviousStep}
            >
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>

            <View style={styles.flex}>
              <CustomButton
                title="Create Team"
                onPress={handleCreateTeam}
                loading={loading}
                disabled={
                  selectedPlayers.length !== TOTAL_SQUAD_SIZE ||
                  isOverBudget ||
                  loading
                }
              />
            </View>
          </View>
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 140,
  },

  // Step 1 Styles
  setupContainer: {
    flex: 1,
    padding: 24,
    justifyContent: "space-between",
  },
  welcomeSection: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 40,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  setupSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
  formSection: {
    flex: 1,
    justifyContent: "center",
  },
  tipBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#F8F4FF",
    padding: 14,
    borderRadius: 10,
    marginTop: 16,
    borderLeftWidth: 3,
    borderLeftColor: "#38003C",
  },
  tipIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: "#555",
    lineHeight: 18,
  },
  step1Footer: {
    paddingBottom: 20,
  },

  // Step 2 Styles
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#333",
    marginBottom: 6,
  },
  teamNameBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  teamNameLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#888",
    letterSpacing: 0.5,
  },
  teamNameText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#38003C",
  },

  // Dashboard Styles
  dashboardContainer: {
    backgroundColor: "#F8F8F8",
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  dashboardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  dashboardTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#666",
    letterSpacing: 0.3,
  },
  dashboardBadge: {
    backgroundColor: "#38003C",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dashboardBadgeText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#E8E8E8",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  statCircleComplete: {
    backgroundColor: "#00FF87",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "900",
    color: "#666",
  },
  statValueComplete: {
    color: "#38003C",
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#38003C",
  },
  statRequired: {
    fontSize: 10,
    fontWeight: "600",
    color: "#999",
    marginTop: 1,
  },

  // Action Buttons Row
  actionButtonsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0F0F0",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  secondaryButtonDisabled: {
    opacity: 0.4,
  },
  secondaryButtonIcon: {
    fontSize: 16,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
  },
  secondaryButtonTextDisabled: {
    color: "#999",
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF5F5",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: "#FFE0E0",
  },
  resetButtonIcon: {
    fontSize: 18,
    color: "#FF005A",
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FF005A",
  },

  // List Styles
  list: {
    paddingTop: 10,
  },
  emptyContainer: {
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#999",
    marginBottom: 6,
  },
  emptySubtext: {
    fontSize: 13,
    color: "#BBB",
  },

  // Bottom Actions
  bottomActions: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: Platform.OS === "ios" ? 24 : 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E8E8E8",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  warningBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF5E6",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#FFB800",
  },
  warningIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: "#8B6700",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  backButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#555",
  },
  flex: {
    flex: 1,
  },
});
