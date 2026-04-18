import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function StepIndicator({ currentStep, steps }) {
  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const stepNum = index + 1;
        const isActive = stepNum <= currentStep;
        const isCompleted = stepNum < currentStep;

        return (
          <View key={stepNum} style={styles.stepWrapper}>
            <View
              style={[
                styles.stepCircle,
                isActive && styles.stepCircleActive,
                isCompleted && styles.stepCircleCompleted,
              ]}
            >
              {isCompleted ? (
                <Ionicons name="checkmark" size={20} color="#FFFFFF" />
              ) : (
                <Text
                  style={[
                    styles.stepNumber,
                    isActive && styles.stepNumberActive,
                  ]}
                >
                  {stepNum}
                </Text>
              )}
            </View>
            <Text
              style={[styles.stepLabel, isActive && styles.stepLabelActive]}
            >
              {step}
            </Text>
            {stepNum < steps.length && (
              <View
                style={[
                  styles.stepLine,
                  isCompleted && styles.stepLineCompleted,
                ]}
              />
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  stepWrapper: {
    flex: 1,
    alignItems: "center",
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EDF2F7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  stepCircleActive: {
    backgroundColor: "#1A1A1A",
  },
  stepCircleCompleted: {
    backgroundColor: "#48BB78",
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: "700",
    color: "#718096",
  },
  stepNumberActive: {
    color: "#FFFFFF",
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#718096",
    textAlign: "center",
  },
  stepLabelActive: {
    color: "#1A1A1A",
  },
  stepLine: {
    position: "absolute",
    width: 2,
    height: 2,
    backgroundColor: "#EDF2F7",
    top: 20,
    left: "50%",
    right: "-50%",
  },
  stepLineCompleted: {
    backgroundColor: "#48BB78",
  },
});
