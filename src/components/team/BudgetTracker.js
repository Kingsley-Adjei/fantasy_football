import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";
import { MAX_BUDGET } from "../../constants/positions";

/**
 * Budget Tracker Component
 * Shows remaining budget and selected players count
 */
const BudgetTracker = ({ spent, selectedCount, totalRequired }) => {
  const remaining = MAX_BUDGET - spent;
  const isOverBudget = spent > MAX_BUDGET;

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>Budget</Text>
        <Text style={[styles.value, isOverBudget && styles.errorValue]}>
          ₵{remaining.toFixed(1)}
        </Text>
        <Text style={styles.subtext}>
          Spent: ₵{spent.toFixed(1)} / ₵{MAX_BUDGET}
        </Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.section}>
        <Text style={styles.label}>Players</Text>
        <Text
          style={[
            styles.value,
            selectedCount === totalRequired && styles.successValue,
          ]}
        >
          {selectedCount}/{totalRequired}
        </Text>
        <Text style={styles.subtext}>
          {totalRequired - selectedCount} remaining
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 20,
  },
  section: {
    alignItems: "center",
    flex: 1,
  },
  divider: {
    width: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 16,
  },
  label: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  value: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 4,
  },
  errorValue: {
    color: COLORS.error,
  },
  successValue: {
    color: COLORS.success,
  },
  subtext: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});

export default BudgetTracker;
