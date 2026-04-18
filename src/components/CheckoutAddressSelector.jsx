import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {
    getUserAddresses,
    setDefaultAddress,
} from "../services/addressService";
import { useAuth } from "./AuthContext";

export const CheckoutAddressSelector = ({
  onAddressSelect,
  onAddNewAddress,
  currentAddressId,
}) => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(currentAddressId);

  useEffect(() => {
    loadAddresses();
  }, [user]);

  const loadAddresses = async () => {
    if (!user?.uid) return;
    try {
      setLoading(true);
      const data = await getUserAddresses(user.uid);
      setAddresses(data || []);

      // Select first address or current if not set
      if (data.length > 0) {
        const defaultAddr = data.find((a) => a.isDefault);
        setSelectedId(defaultAddr?.id || data[0].id);
        onAddressSelect(defaultAddr || data[0]);
      }
    } catch (error) {
      console.error("Error loading addresses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAddress = (address) => {
    setSelectedId(address.id);
    onAddressSelect(address);
  };

  const handleSetAsDefault = async (address) => {
    try {
      if (user?.uid) {
        await setDefaultAddress(user.uid, address.id);
        await loadAddresses();
      }
    } catch (error) {
      Alert.alert("Error", "Failed to set default address");
    }
  };

  const renderAddressOption = ({ item }) => (
    <TouchableOpacity
      style={[styles.option, selectedId === item.id && styles.optionSelected]}
      onPress={() => handleSelectAddress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.radio}>
        {selectedId === item.id && <View style={styles.radioDot} />}
      </View>

      <View style={styles.addressInfo}>
        <View style={styles.addressHeader}>
          <Text style={styles.addressName}>{item.fullName}</Text>
          <View style={styles.typeTag}>
            <Text style={styles.typeTagText}>{item.type}</Text>
          </View>
          {item.isDefault && (
            <View style={styles.defaultTag}>
              <Ionicons name="star" size={10} color="#2563EB" />
              <Text style={styles.defaultTagText}>Default</Text>
            </View>
          )}
        </View>

        <Text style={styles.phone}>{item.phone}</Text>
        <Text style={styles.addressText}>{item.fullAddress}</Text>
        <Text style={styles.addressText}>
          {item.area}, {item.district}
        </Text>

        {!item.isDefault && (
          <TouchableOpacity
            onPress={() => handleSetAsDefault(item)}
            style={styles.setDefaultBtn}
          >
            <Ionicons name="star-outline" size={12} color="#6B7280" />
            <Text style={styles.setDefaultText}>Set as Default</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Delivery Address</Text>
        <TouchableOpacity onPress={onAddNewAddress} style={styles.addNewBtn}>
          <Ionicons name="add-circle-outline" size={20} color="#2563EB" />
          <Text style={styles.addNewText}>Add New</Text>
        </TouchableOpacity>
      </View>

      {addresses.length > 0 ? (
        <FlatList
          data={addresses}
          renderItem={renderAddressOption}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      ) : (
        <View style={styles.empty}>
          <Ionicons name="location-outline" size={40} color="#D1D5DB" />
          <Text style={styles.emptyText}>No addresses saved</Text>
          <TouchableOpacity
            onPress={onAddNewAddress}
            style={styles.emptyAddBtn}
          >
            <Text style={styles.emptyAddBtnText}>Add Address</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2937",
  },
  addNewBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  addNewText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2563EB",
  },
  option: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
  },
  optionSelected: {
    borderColor: "#2563EB",
    backgroundColor: "#EFF6FF",
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 2,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#2563EB",
  },
  addressInfo: {
    flex: 1,
  },
  addressHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  addressName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F2937",
  },
  typeTag: {
    backgroundColor: "#DBEAFE",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  typeTagText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#1E40AF",
  },
  defaultTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    backgroundColor: "#E0E7FF",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  defaultTagText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#4F46E5",
  },
  phone: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },
  addressText: {
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 16,
  },
  setDefaultBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: "#F3F4F6",
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  setDefaultText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6B7280",
  },
  empty: {
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 14,
    color: "#6B7280",
    marginVertical: 8,
  },
  emptyAddBtn: {
    marginTop: 12,
    backgroundColor: "#2563EB",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  emptyAddBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
});
