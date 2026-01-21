import React from "react";
import { View, Text, FlatList, StyleSheet, Pressable } from "react-native";
import { COLORS } from "../../constants/colors";
import { POSITIONS } from "../../constants/positions";

/**
 * Selected Players List Component
 * Shows compact list of selected players grouped by position
 */
const SelectedPlayersList = ({ players, onRemovePlayer }) => {
  // Group by position
  const groupedPlayers = players.reduce((acc, player) => {
    if (!acc[player.position]) acc[player.position] = [];
    acc[player.position].push(player);
    return acc;
  }, {});

  if (players.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No players selected yet</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {Object.entries(POSITIONS).map(([pos, config]) => {
        const posPlayers = groupedPlayers[pos] || [];

        return (
          <View key={pos} style={styles.positionGroup}>
            <View style={styles.positionHeader}>
              <Text style={[styles.positionTitle, { color: config.color }]}>
                {config.short}
              </Text>
              <Text style={styles.positionCount}>
                {posPlayers.length}/{config.max}
              </Text>
            </View>

            {posPlayers.map((player) => (
              <View key={player.id} style={styles.playerRow}>
                <Text style={styles.playerName} numberOfLines={1}>
                  {player.name}
                </Text>
                <Text style={styles.playerPrice}>
                  ₵{player.price.toFixed(1)}
                </Text>
                <Pressable
                  onPress={() => onRemovePlayer(player.id)}
                  style={styles.removeButton}
                >
                  <Text style={styles.removeText}>×</Text>
                </Pressable>
              </View>
            ))}

            {/* Empty slots */}
            {Array(config.max - posPlayers.length)
              .fill(0)
              .map((_, i) => (
                <View key={`empty-${i}`} style={styles.emptySlot}>
                  <Text style={styles.emptySlotText}>Empty slot</Text>
                </View>
              ))}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  emptyContainer: {
    padding: 32,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  positionGroup: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  positionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  positionTitle: {
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 1,
  },
  positionCount: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  playerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: COLORS.inputBg,
    borderRadius: 8,
    marginBottom: 6,
  },
  playerName: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "600",
  },
  playerPrice: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "700",
    marginRight: 8,
  },
  removeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.error,
    alignItems: "center",
    justifyContent: "center",
  },
  removeText: {
    fontSize: 18,
    color: COLORS.text,
    fontWeight: "700",
  },
  emptySlot: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: "dashed",
    marginBottom: 6,
  },
  emptySlotText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontStyle: "italic",
  },
});

export default SelectedPlayersList;
