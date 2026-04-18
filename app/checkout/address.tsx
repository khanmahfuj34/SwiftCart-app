import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
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
import StepIndicator from "../../src/components/StepIndicator";
import { useAuth } from "../../src/context/AuthContext";
import { useCheckout } from "../../src/context/CheckoutContext";
import {
    addUserAddress,
    updateUserAddress,
} from "../../src/services/addressService";

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

export default function CheckoutAddressScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const {
    selectedAddress,
    setSelectedAddress,
    setCurrentStep,
    addresses,
    loading,
  } = useCheckout();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [expandedDivision, setExpandedDivision] = useState(false);
  const [expandedType, setExpandedType] = useState(false);

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
      Alert.alert("Error", "Full name required");
      return false;
    }
    if (!formData.phone.trim() || formData.phone.length < 11) {
      Alert.alert("Error", "Valid phone required");
      return false;
    }
    if (!formData.division) {
      Alert.alert("Error", "Division required");
      return false;
    }
    if (!formData.district.trim()) {
      Alert.alert("Error", "District required");
      return false;
    }
    if (!formData.area.trim()) {
      Alert.alert("Error", "Area required");
      return false;
    }
    if (!formData.fullAddress.trim()) {
      Alert.alert("Error", "Full address required");
      return false;
    }
    if (!formData.postalCode.trim()) {
      Alert.alert("Error", "Postal code required");
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

      if (editingId) {
        await updateUserAddress(user.uid, editingId, payload);
      } else {
        const newAddr = await addUserAddress(user.uid, payload);
        setSelectedAddress(newAddr.id);
      }

      resetForm();
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Failed to save address");
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

  const handleContinue = () => {
    if (selectedAddress) {
      setCurrentStep(2);
      router.push("/checkout/delivery");
    } else {
      Alert.alert("Error", "Please select an address");
    }
  };

  const renderAddressCard = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.addressCard,
        selectedAddress === item.id && styles.addressCardSelected,
      ]}
      onPress={() => setSelectedAddress(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        <View style={styles.radioContainer}>
          <View
            style={[
              styles.radio,
              selectedAddress === item.id && styles.radioSelected,
            ]}
          >
            {selectedAddress === item.id && <View style={styles.radioDot} />}
          </View>
        </View>

        <View style={styles.addressInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.addressName}>{item.fullName}</Text>
            <View style={styles.tagsRow}>
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
          </View>

          <Text style={styles.phone}>{item.phone}</Text>

          <View style={styles.addressLines}>
            <Text style={styles.addressText}>{item.fullAddress}</Text>
            <Text style={styles.addressText}>
              {item.area}, {item.district}
            </Text>
            <Text style={styles.addressText}>
              {item.division}, {item.postalCode}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => handleEditAddress(item)}
          style={styles.editBtn}
        >
          <Ionicons name="pencil" size={16} color="#2563EB" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {!showForm ? (
        <>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backBtn}
            >
              <Ionicons name="arrow-back" size={24} color="#1F2937" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Shipping Address</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            <StepIndicator
              currentStep={1}
              steps={["Address", "Delivery", "Payment", "Review"]}
            />

            <Text style={styles.sectionTitle}>Select Delivery Address</Text>

            {addresses && addresses.length > 0 ? (
              <FlatList
                data={addresses}
                renderItem={renderAddressCard}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                contentContainerStyle={styles.list}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="location-outline" size={48} color="#D1D5DB" />
                <Text style={styles.emptyText}>No Saved Addresses</Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.addNewBtn}
              onPress={() => setShowForm(true)}
            >
              <Ionicons name="add-circle" size={20} color="#FFFFFF" />
              <Text style={styles.addNewText}>Add New Address</Text>
            </TouchableOpacity>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.continueBtn}
              onPress={handleContinue}
            >
              <Text style={styles.continueBtnText}>Continue</Text>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <ScrollView contentContainerStyle={styles.formContainer}>
          <View style={styles.formHeader}>
            <TouchableOpacity onPress={resetForm}>
              <Ionicons name="chevron-back" size={24} color="#1F2937" />
            </TouchableOpacity>
            <Text style={styles.formTitle}>
              {editingId ? "Edit Address" : "Add New Address"}
            </Text>
            <View style={{ width: 24 }} />
          </View>

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
            <Text
              style={[
                styles.dropdownText,
                !formData.division && styles.placeholderText,
              ]}
            >
              {formData.division || "Select Division"}
            </Text>
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
                  <Text style={styles.menuItemText}>{d}</Text>
                  {formData.division === d && (
                    <Ionicons name="checkmark" size={18} color="#2563EB" />
                  )}
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
            placeholder="Area / Thana"
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
            multiline
            numberOfLines={3}
            placeholderTextColor="#9CA3AF"
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
            <Text style={styles.dropdownText}>{formData.type}</Text>
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
                  <Text style={styles.menuItemText}>{t}</Text>
                  {formData.type === t && (
                    <Ionicons name="checkmark" size={18} color="#2563EB" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={styles.formButtonGroup}>
            <TouchableOpacity
              onPress={resetForm}
              style={styles.cancelBtn}
              disabled={formLoading}
            >
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
          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F9FAFB" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
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
  headerTitle: { flex: 1, fontSize: 18, fontWeight: "700", color: "#1F2937" },
  scrollContent: { paddingHorizontal: 16, paddingVertical: 12 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 12,
    marginTop: 8,
  },
  list: { marginBottom: 16 },
  addressCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  addressCardSelected: { borderColor: "#2563EB", backgroundColor: "#EFF6FF" },
  cardContent: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  radioContainer: { paddingTop: 4 },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    justifyContent: "center",
    alignItems: "center",
  },
  radioSelected: { borderColor: "#2563EB" },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#2563EB",
  },
  addressInfo: { flex: 1 },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  addressName: { fontSize: 14, fontWeight: "700", color: "#1F2937" },
  tagsRow: { flexDirection: "row", gap: 6 },
  typeTag: {
    backgroundColor: "#DBEAFE",
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  typeTagText: { fontSize: 10, fontWeight: "600", color: "#1E40AF" },
  defaultTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    backgroundColor: "#BFDBFE",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  defaultTagText: { fontSize: 10, fontWeight: "600", color: "#1E40AF" },
  phone: { fontSize: 12, color: "#6B7280", marginBottom: 6 },
  addressLines: { gap: 2 },
  addressText: { fontSize: 12, color: "#4B5563", lineHeight: 16 },
  editBtn: { paddingTop: 4 },
  emptyContainer: { alignItems: "center", paddingVertical: 40 },
  emptyText: { fontSize: 14, color: "#6B7280", marginTop: 8 },
  addNewBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  addNewText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  continueBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    borderRadius: 8,
  },
  continueBtnText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  formContainer: { paddingHorizontal: 16, paddingVertical: 12 },
  formHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  formTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    textAlign: "center",
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
  countryCode: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
    marginRight: 4,
  },
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
  dropdownText: { fontSize: 14, color: "#1F2937" },
  placeholderText: { color: "#9CA3AF" },
  dropdownMenu: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    marginBottom: 12,
    maxHeight: 180,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  menuItemText: { fontSize: 13, color: "#1F2937" },
  formButtonGroup: { flexDirection: "row", gap: 8, marginTop: 8 },
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

