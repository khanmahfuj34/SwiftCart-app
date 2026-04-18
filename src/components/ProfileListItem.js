import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ProfileListItem() {
  const router = useRouter();

  const items = [
    {
      id: "notifications",
      title: "Notifications",
      icon: "notifications",
      route: "/profile",
    },
    { id: "privacy", title: "Privacy", icon: "lock-closed", route: "/profile" },
    {
      id: "help",
      title: "Help & Support",
      icon: "help-circle",
      route: "/profile",
    },
    {
      id: "about",
      title: "Information",
      icon: "information-circle",
      route: "/profile",
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Preferences</Text>
      <View style={styles.list}>
        {items.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.item, index === items.length - 1 && styles.lastItem]}
            onPress={() => router.push(item.route)}
          >
            <View style={styles.left}>
              <Ionicons name={item.icon} size={22} color="#4A5568" />
              <Text style={styles.title}>{item.title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#CBD5E0" />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 15,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 15,
  },
  list: {
    backgroundColor: "transparent",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18,
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    color: "#2D3748",
    marginLeft: 16,
    fontWeight: "500",
  },
});
