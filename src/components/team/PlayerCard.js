import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";
import { POSITIONS } from "../../constants/positions";

/**
 * Player Card Component - Senior Dev "Professional Clean" Edition
 * Maintains existing logic for selection, budget, and position limits.
 */
const PlayerCard = ({
  player,
  isSelected,
  onPress,
  disabled,
  positionFull,
}) => {
  const posConfig = POSITIONS[player.position];

  return (
    <Pressable
      style={[
        styles.card,
        isSelected && styles.cardSelected,
        disabled && styles.cardDisabled,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      {/* Left Section: Jersey & Name Details */}
      <View style={styles.leftSection}>
        <View style={styles.jerseyIcon}>
          <Text style={{ fontSize: 18 }}>👕</Text>
        </View>

        <View style={styles.nameContainer}>
          <View style={styles.nameRow}>
            <Text
              style={[styles.name, disabled && styles.nameDisabled]}
              numberOfLines={1}
            >
              {player.name}
            </Text>

            {/* NEUTRAL POSITION BADGE - Professional Muted Style */}
            <View
              style={[styles.inlineBadge, disabled && styles.badgeDisabled]}
            >
              <Text style={styles.inlineBadgeText}>
                {posConfig?.short || player.position}
              </Text>
            </View>
          </View>

          <Text style={[styles.club, disabled && styles.clubDisabled]}>
            {player.realClub}
          </Text>
        </View>
      </View>

      {/* Right Section: Price & Action */}
      <View style={styles.rightSection}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>PRICE</Text>
          <Text style={[styles.priceValue, disabled && styles.priceDisabled]}>
            ₵{player.price.toFixed(1)}
          </Text>
        </View>

        {/* Priority: Show FULL badge first if position is maxed out */}
        {positionFull && !isSelected ? (
          <View style={styles.fullBadge}>
            <Text style={styles.fullText}>FULL</Text>
          </View>
        ) : (
          <View
            style={[
              styles.actionButton,
              isSelected && styles.buttonSelected,
              disabled && styles.buttonDisabled,
            ]}
          >
            <Text style={styles.buttonText}>{isSelected ? "✓" : "+"}</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  cardSelected: {
    backgroundColor: "#F9F9F9",
    borderLeftWidth: 4,
    borderLeftColor: "#38003C", // Primary Brand Accent
  },
  cardDisabled: {
    opacity: 0.45, // Slightly more faded for clarity
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  jerseyIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  nameContainer: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 2,
  },
  name: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333333",
  },
  nameDisabled: {
    color: "#999999",
  },
  inlineBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 3,
    backgroundColor: "#E8E8E8", // Unified Neutral Grey
  },
  inlineBadgeText: {
    color: "#666666", // Muted Text
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  badgeDisabled: {
    backgroundColor: "#EEEEEE",
  },
  club: {
    fontSize: 12,
    color: "#777777",
  },
  clubDisabled: {
    color: "#BBBBBB",
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  priceContainer: {
    alignItems: "flex-end",
  },
  priceLabel: {
    fontSize: 8,
    color: "#AAAAAA",
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  priceValue: {
    fontSize: 14,
    fontWeight: "800",
    color: "#333333",
  },
  priceDisabled: {
    color: "#CCCCCC",
  },
  actionButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#38003C", // Professional Dark Purple
    alignItems: "center",
    justifyContent: "center",
  },
  buttonSelected: {
    backgroundColor: "#00FF85", // Neon Green only for success/selected
  },
  buttonDisabled: {
    backgroundColor: "#D0D0D0",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  fullBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#FFF0F0",
    borderRadius: 4,
  },
  fullText: {
    fontSize: 10,
    fontWeight: "900",
    color: "#E00000", // Error red for feedback
  },
});

export default PlayerCard;
