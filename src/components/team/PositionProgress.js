import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";
import { POSITIONS, getPositionCounts } from "../../constants/positions";

/**
 * Position Progress Component
 * Shows visual progress for each position requirement
 */
const PositionProgress = ({ selectedPlayers }) => {
  const counts = getPositionCounts(selectedPlayers);

  return (
    <View style={styles.container}>
      {Object.entries(POSITIONS).map(([pos, config]) => {
        const count = counts[pos];
        const required = config.required;
        const progress = count / required;
        const isComplete = count === required;

        return (
          <View key={pos} style={styles.positionRow}>
            <View style={styles.labelContainer}>
              <Text style={[styles.positionLabel, { color: config.color }]}>
                {config.short}
              </Text>
              <Text style={styles.countText}>
                {count}/{required}
              </Text>
            </View>

            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  {
                    width: `${progress * 100}%`,
                    backgroundColor: isComplete ? COLORS.success : config.color,
                  },
                ]}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  positionRow: {
    marginBottom: 12,
  },
  labelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  positionLabel: {
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1,
  },
  countText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: COLORS.inputBg,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 3,
  },
});

export default PositionProgress;
