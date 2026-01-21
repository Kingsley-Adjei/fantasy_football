import React from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { COLORS } from "../../constants/colors";
import { POSITIONS } from "../../constants/positions";

/**
 * Position Filter Component - Senior Dev "Elite Pro" Edition
 * Matches the muted, high-contrast theme of the PlayerCard.
 */
const PositionFilter = ({ selectedPosition, onSelectPosition }) => {
  const positions = ["ALL", ...Object.keys(POSITIONS)];

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {positions.map((pos) => {
          const isSelected = selectedPosition === pos;
          const posConfig = POSITIONS[pos];

          // Use the brand color from positions.js (Dark Purple)
          const activeColor = posConfig?.color || "#37003c";

          return (
            <Pressable
              key={pos}
              onPress={() => onSelectPosition(pos)}
              style={styles.tab}
            >
              <Text
                style={[
                  styles.tabText,
                  isSelected && styles.tabTextActive,
                  isSelected && { color: activeColor },
                ]}
              >
                {pos === "ALL" ? "All" : posConfig?.short || pos}
              </Text>

              {/* Clean, fixed-width indicator line */}
              {isSelected && (
                <View
                  style={[styles.indicator, { backgroundColor: activeColor }]}
                />
              )}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#FFFFFF",
    // Subtle shadow and border to separate from the player list
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  container: {
    paddingHorizontal: 8,
    flexDirection: "row",
    height: 48, // Slightly taller for better touch target
  },
  tab: {
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  tabText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#AAAAAA", // Muted grey for inactive tabs
    textTransform: "uppercase",
    letterSpacing: 1, // Increased tracking for premium feel
  },
  tabTextActive: {
    // Color is handled dynamically by activeColor prop
  },
  indicator: {
    position: "absolute",
    bottom: 0,
    width: "60%", // Line doesn't stretch the whole width, looks more modern
    height: 3,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
});

export default PositionFilter;
