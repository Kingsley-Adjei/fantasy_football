import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";

/**
 * Step Indicator Component
 * Shows current step in team creation process
 */
const StepIndicator = ({ currentStep, totalSteps }) => {
  return (
    <View style={styles.container}>
      {Array(totalSteps)
        .fill(0)
        .map((_, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <React.Fragment key={stepNumber}>
              <View
                style={[
                  styles.step,
                  isActive && styles.stepActive,
                  isCompleted && styles.stepCompleted,
                ]}
              >
                <Text
                  style={[
                    styles.stepText,
                    (isActive || isCompleted) && styles.stepTextActive,
                  ]}
                >
                  {stepNumber}
                </Text>
              </View>
              {stepNumber < totalSteps && (
                <View
                  style={[styles.line, isCompleted && styles.lineCompleted]}
                />
              )}
            </React.Fragment>
          );
        })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  step: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.inputBg,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  stepActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  stepCompleted: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  stepText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },
  stepTextActive: {
    color: COLORS.text,
  },
  line: {
    width: 40,
    height: 2,
    backgroundColor: COLORS.border,
    marginHorizontal: 8,
  },
  lineCompleted: {
    backgroundColor: COLORS.success,
  },
});

export default StepIndicator;
