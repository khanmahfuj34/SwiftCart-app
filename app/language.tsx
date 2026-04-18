import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { BorderRadius, Shadows, Spacing } from "../constants/theme";

interface Language {
  id: string;
  name: string;
  code: string;
  flag: string;
}

const LANGUAGES: Language[] = [
  { id: "1", name: "English", code: "en", flag: "🇬🇧" },
  { id: "2", name: "Spanish", code: "es", flag: "🇪🇸" },
  { id: "3", name: "French", code: "fr", flag: "🇫🇷" },
  { id: "4", name: "German", code: "de", flag: "🇩🇪" },
  { id: "5", name: "Italian", code: "it", flag: "🇮🇹" },
  { id: "6", name: "Portuguese", code: "pt", flag: "🇵🇹" },
  { id: "7", name: "Japanese", code: "ja", flag: "🇯🇵" },
  { id: "8", name: "Chinese (Simplified)", code: "zh", flag: "🇨🇳" },
  { id: "9", name: "Korean", code: "ko", flag: "🇰🇷" },
  { id: "10", name: "Hindi", code: "hi", flag: "🇮🇳" },
  { id: "11", name: "Arabic", code: "ar", flag: "🇸🇦" },
  { id: "12", name: "Russian", code: "ru", flag: "🇷🇺" },
];

export default function LanguageScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const handleSelectLanguage = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    // Here you would typically save to context/storage
    // For now, we just update local state
  };

  const renderLanguageItem = ({ item }: { item: Language }) => {
    const isSelected = selectedLanguage === item.code;

    return (
      <TouchableOpacity
        onPress={() => handleSelectLanguage(item.code)}
        style={[
          styles.languageItem,
          {
            backgroundColor: isDark
              ? isSelected
                ? "#2A2A2A"
                : "#1A1A1A"
              : isSelected
                ? "#F3F4F6"
                : "#FFFFFF",
            borderColor: isSelected ? "#0F172A" : "#E5E7EB",
            borderWidth: isSelected ? 2 : 1,
          },
        ]}
      >
        <View style={styles.languageContent}>
          <Text style={styles.languageFlag}>{item.flag}</Text>
          <View style={styles.languageInfo}>
            <Text
              style={[
                styles.languageName,
                {
                  color: isDark ? "#FFFFFF" : "#0F172A",
                  fontWeight: isSelected ? "700" : "600",
                },
              ]}
            >
              {item.name}
            </Text>
            <Text
              style={[
                styles.languageCode,
                { color: isDark ? "#AAAAAA" : "#6B7280" },
              ]}
            >
              {item.code.toUpperCase()}
            </Text>
          </View>
        </View>

        {isSelected && (
          <View style={styles.checkmark}>
            <Ionicons name="checkmark-circle" size={24} color="#10B981" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDark ? "#0F0F0F" : "#FFFFFF" },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={isDark ? "#FFFFFF" : "#0F172A"}
          />
        </TouchableOpacity>
        <Text
          style={[
            styles.headerTitle,
            { color: isDark ? "#FFFFFF" : "#0F172A" },
          ]}
        >
          Select Language
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Language List */}
      <FlatList
        data={LANGUAGES}
        renderItem={renderLanguageItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
      />

      {/* Info Text */}
      <View style={styles.infoSection}>
        <Ionicons name="information-circle" size={20} color="#3B82F6" />
        <Text
          style={[styles.infoText, { color: isDark ? "#AAAAAA" : "#6B7280" }]}
        >
          Your selected language will be applied across the entire app
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    padding: Spacing.sm,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  languageItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  languageContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  languageFlag: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    marginBottom: 4,
  },
  languageCode: {
    fontSize: 12,
    fontWeight: "500",
  },
  checkmark: {
    marginLeft: Spacing.md,
  },
  infoSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: "#DBEAFE",
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
  },
  infoText: {
    fontSize: 13,
    fontWeight: "500",
    marginLeft: Spacing.md,
    flex: 1,
  },
});
