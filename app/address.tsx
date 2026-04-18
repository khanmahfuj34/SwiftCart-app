import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useAuth } from "../src/context/AuthContext";
import {
    addUserAddress,
    deleteUserAddress,
    getUserAddresses,
    isValidBangladeshPhone,
    setDefaultAddress,
    updateUserAddress,
} from "../src/services/addressService";

const BANGLADESH_DIVISIONS = [
  "Dhaka",
  "Chittagong",
  "Khulna",
  "Rajshahi",
  "Barisal",
  "Sylhet",
  "Rangpur",
  "Mymensingh",
];
const ADDRESS_TYPES = ["Home", "Office", "Other"];

export default function AddressScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    division: "",
    district: "",
    area: "",
    fullAddress: "",
    postalCode: "",
    type: "Home",
  });
  const [expandedDivision, setExpandedDivision] = useState(false);
  const [expandedType, setExpandedType] = useState(false);

  useEffect(() => {
    loadAddresses();
  }, [user]);

  const loadAddresses = async () => {
    if (!user?.uid) return;
    try {
      setPageLoading(true);
      const data = await getUserAddresses(user.uid);
      setAddresses(data || []);
    } catch (error) {
      console.error("Error loading addresses:", error);
      Alert.alert("Error", "Failed to load addresses");
    } finally {
      setPageLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      phone: "",
      division: "",
      district: "",
      area: "",
      fullAddress: "",
      postalCode: "",
      type: "Home",
    });
    setEditingId(null);
    setShowForm(false);
    setExpandedDivision(false);
    setExpandedType(false);
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      Alert.alert("Error", "Full name is required");
      return false;
    }
    if (!formData.phone.trim()) {
      Alert.alert("Error", "Phone number is required");
      return false;
    }
    if (!isValidBangladeshPhone(formData.phone)) {
      Alert.alert("Error", "Phone must be 01XXXXXXXXX");
      return false;
    }
    if (!formData.division) {
      Alert.alert("Error", "Division is required");
      return false;
    }
    if (!formData.district.trim()) {
      Alert.alert("Error", "District is required");
      return false;
    }
    if (!formData.area.trim()) {
      Alert.alert("Error", "Area/Thana is required");
      return false;
    }
    if (!formData.fullAddress.trim()) {
      Alert.alert("Error", "Full address is required");
      return false;
    }
    if (!formData.postalCode.trim()) {
      Alert.alert("Error", "Postal code is required");
      return false;
    }
    return true;
  };

  const handleSaveAddress = async () => {
    if (!validateForm() || !user?.uid) return;
    try {
      setFormLoading(true);
      const payload = {
        fullName: formData.fullName.trim(),
        phone: formData.phone,
        division: formData.division,
        district: formData.district.trim(),
        area: formData.area.trim(),
        fullAddress: formData.fullAddress.trim(),
        postalCode: formData.postalCode.trim(),
        type: formData.type,
        isDefault: addresses.length === 0 && !editingId,
      };
      if (editingId) await updateUserAddress(user.uid, editingId, payload);
      else await addUserAddress(user.uid, payload);
      Alert.alert("Success", "Address saved");
      await loadAddresses();
      resetForm();
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Failed to save");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditAddress = (address) => {
    setFormData({
      fullName: address.fullName,
      phone: address.phone,
      division: address.division,
      district: address.district,
      area: address.area,
      fullAddress: address.fullAddress,
      postalCode: address.postalCode,
      type: address.type || "Home",
    });
    setEditingId(address.id);
    setShowForm(true);
  };

  const handleDeleteAddress = (id, name) => {
    Alert.alert("Delete", `Remove "${name}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            if (user?.uid) {
              await deleteUserAddress(user.uid, id);
              await loadAddresses();
            }
          } catch (error) {
            Alert.alert("Error", "Failed");
          }
        },
      },
    ]);
  };

  const handleSetDefault = async (id) => {
    try {
      if (!user?.uid) return;
      await setDefaultAddress(user.uid, id);
      await loadAddresses();
    } catch (error) {
      Alert.alert("Error", "Failed");
    }
  };

  const handlePhoneChange = (text) => {
    const cleaned = text.replace(/[^0-9]/g, "");
    let formatted = "";
    if (cleaned) {
      let digits = cleaned;
      if (digits.startsWith("880")) digits = digits.slice(3);
      if (!digits.startsWith("0")) digits = "0" + digits;
      formatted = digits.slice(0, 11);
    }
    setFormData({ ...formData, phone: formatted });
  };

  const renderAddressCard = ({ item }) => (
    <TouchableOpacity
      style={[styles.addressCard, item.isDefault && styles.addressCardDefault]}
      onPress={() => handleSetDefault(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <View style={styles.typeTag}>
            <Text style={styles.typeTagText}>{item.type}</Text>
          </View>
          {item.isDefault && (
            <View style={styles.defaultBadge}>
              <Ionicons name="star" size={12} color="#2563EB" />
              <Text style={styles.defaultText}>Default</Text>
            </View>
          )}
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={() => handleEditAddress(item)}
            style={styles.iconButton}
          >
            <Ionicons name="pencil" size={18} color="#2563EB" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDeleteAddress(item.id, item.fullName)}
            style={styles.iconButton}
          >
            <Ionicons name="trash" size={18} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.addressName}>{item.fullName}</Text>
      <Text style={styles.addressPhone}>{item.phone}</Text>
      <Text style={styles.addressText}>{item.fullAddress}</Text>
      <Text style={styles.addressText}>
        {item.area}, {item.district}
      </Text>
      <Text style={styles.addressText}>
        {item.division} - {item.postalCode}
      </Text>
    </TouchableOpacity>
  );

  if (pageLoading)
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </SafeAreaView>
    );

  return (
    <SafeAreaView style={styles.container}>
      {!showForm ? (
        <>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backBtn}
            >
              <Ionicons name="arrow-back" size={24} color="#1F2937" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>My Addresses</Text>
            <TouchableOpacity
              onPress={() => setShowForm(true)}
              style={styles.addBtn}
            >
              <Ionicons name="add-circle" size={28} color="#2563EB" />
            </TouchableOpacity>
          </View>
          {addresses.length > 0 ? (
            <FlatList
              data={addresses}
              renderItem={renderAddressCard}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              scrollEnabled={true}
            />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="location-outline" size={64} color="#93C5FD" />
              <Text style={styles.emptyText}>No Addresses</Text>
              <TouchableOpacity
                onPress={() => setShowForm(true)}
                style={styles.emptyAddBtn}
              >
                <Text style={styles.emptyAddBtnText}>Add Address</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      ) : (
        <ScrollView contentContainerStyle={styles.formContainer}>
          <Text style={styles.formTitle}>
            {editingId ? "Edit Address" : "Add New Address"}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={formData.fullName}
            onChangeText={(text) =>
              setFormData({ ...formData, fullName: text })
            }
            placeholderTextColor="#9CA3AF"
          />
          <View style={styles.phoneWrapper}>
            <Text style={styles.countryCode}>+880</Text>
            <TextInput
              style={styles.phoneInput}
              placeholder="1XXXXXXXXX"
              value={formData.phone}
              onChangeText={handlePhoneChange}
              keyboardType="numeric"
              maxLength={11}
              placeholderTextColor="#9CA3AF"
            />
          </View>
          <TouchableOpacity
            onPress={() => setExpandedDivision(!expandedDivision)}
            style={styles.dropdown}
          >
            <Text>{formData.division || "Division"}</Text>
            <Ionicons
              name={expandedDivision ? "chevron-up" : "chevron-down"}
              size={20}
              color="#2563EB"
            />
          </TouchableOpacity>
          {expandedDivision && (
            <View style={styles.dropdownMenu}>
              {BANGLADESH_DIVISIONS.map((d) => (
                <TouchableOpacity
                  key={d}
                  onPress={() => {
                    setFormData({ ...formData, division: d });
                    setExpandedDivision(false);
                  }}
                  style={styles.menuItem}
                >
                  <Text>{d}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          <TextInput
            style={styles.input}
            placeholder="District"
            value={formData.district}
            onChangeText={(text) =>
              setFormData({ ...formData, district: text })
            }
            placeholderTextColor="#9CA3AF"
          />
          <TextInput
            style={styles.input}
            placeholder="Area"
            value={formData.area}
            onChangeText={(text) => setFormData({ ...formData, area: text })}
            placeholderTextColor="#9CA3AF"
          />
          <TextInput
            style={[styles.input, { minHeight: 80 }]}
            placeholder="Full Address"
            value={formData.fullAddress}
            onChangeText={(text) =>
              setFormData({ ...formData, fullAddress: text })
            }
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={3}
          />
          <TextInput
            style={styles.input}
            placeholder="Postal Code"
            value={formData.postalCode}
            onChangeText={(text) =>
              setFormData({ ...formData, postalCode: text })
            }
            keyboardType="numeric"
            placeholderTextColor="#9CA3AF"
          />
          <TouchableOpacity
            onPress={() => setExpandedType(!expandedType)}
            style={styles.dropdown}
          >
            <Text>{formData.type}</Text>
            <Ionicons
              name={expandedType ? "chevron-up" : "chevron-down"}
              size={20}
              color="#2563EB"
            />
          </TouchableOpacity>
          {expandedType && (
            <View style={styles.dropdownMenu}>
              {ADDRESS_TYPES.map((t) => (
                <TouchableOpacity
                  key={t}
                  onPress={() => {
                    setFormData({ ...formData, type: t });
                    setExpandedType(false);
                  }}
                  style={styles.menuItem}
                >
                  <Text>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          <View style={styles.buttonGroup}>
            <TouchableOpacity onPress={resetForm} style={styles.cancelBtn}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSaveAddress}
              style={styles.saveBtn}
              disabled={formLoading}
            >
              {formLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.saveBtnText}>
                  {editingId ? "Update" : "Save"}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backBtn: { padding: 8, marginRight: 12 },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: "700", color: "#1F2937" },
  addBtn: { padding: 4 },
  listContent: { paddingHorizontal: 16, paddingVertical: 12 },
  addressCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  addressCardDefault: { borderColor: "#2563EB", backgroundColor: "#F0F9FF" },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  headerLeft: { flexDirection: "row", gap: 8 },
  headerRight: { flexDirection: "row", gap: 4 },
  typeTag: {
    backgroundColor: "#DBEAFE",
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  typeTagText: { fontSize: 10, fontWeight: "600", color: "#1E40AF" },
  defaultBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    backgroundColor: "#BFDBFE",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  defaultText: { fontSize: 10, fontWeight: "600", color: "#1E40AF" },
  iconButton: { padding: 6 },
  addressName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 2,
  },
  addressPhone: { fontSize: 12, color: "#6B7280", marginBottom: 6 },
  addressText: { fontSize: 12, color: "#4B5563", lineHeight: 16 },
  emptyState: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginTop: 12,
  },
  emptyAddBtn: {
    marginTop: 16,
    backgroundColor: "#2563EB",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  emptyAddBtnText: { color: "#fff", fontWeight: "700" },
  formContainer: { paddingHorizontal: 16, paddingVertical: 12 },
  formTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#1F2937",
    marginBottom: 12,
  },
  phoneWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  countryCode: { fontSize: 13, fontWeight: "600", color: "#6B7280" },
  phoneInput: { flex: 1, paddingVertical: 10, fontSize: 14, color: "#1F2937" },
  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  dropdownMenu: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    marginBottom: 12,
  },
  menuItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  buttonGroup: { flexDirection: "row", gap: 8, marginTop: 12 },
  cancelBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#fff",
  },
  cancelBtnText: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "700",
    color: "#6B7280",
  },
  saveBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },
  saveBtnText: { fontSize: 14, fontWeight: "700", color: "#fff" },
});
