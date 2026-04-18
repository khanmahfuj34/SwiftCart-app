import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { useAuth } from "../../src/context/AuthContext";
import { useProfile } from "../../src/context/ProfileContext";

export default function EditProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { profile, updateProfile, uploadPhoto, uploading, loading } =
    useProfile();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [localPhotoURL, setLocalPhotoURL] = useState("");

  const [photoLoading, setPhotoLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showGenderPicker, setShowGenderPicker] = useState(false);

  // Initialize form with profile data
  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || "");
      setPhone(profile.phone || "");
      setGender(profile.gender || "");
      setDateOfBirth(profile.dateOfBirth || "");
      setLocalPhotoURL(profile.photoURL || "");
    }
  }, [profile]);

  const pickImage = async () => {
    try {
      // Request permissions
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "We need access to your photo library to upload a profile photo.",
        );
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setPhotoLoading(true);

        try {
          const photoURL = await uploadPhoto(imageUri);
          setLocalPhotoURL(photoURL);

          Alert.alert("Success", "Profile photo updated successfully!");
        } catch (error) {
          Alert.alert("Error", "Failed to upload photo. Please try again.");
          console.error("Upload error:", error);
        } finally {
          setPhotoLoading(false);
        }
      }
    } catch (error) {
      console.error("Image picker error:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const handleSaveProfile = async () => {
    if (!fullName.trim()) {
      Alert.alert("Error", "Please enter your full name");
      return;
    }

    setSaving(true);

    try {
      await updateProfile({
        fullName: fullName.trim(),
        phone: phone.trim(),
        gender: gender.trim(),
        dateOfBirth: dateOfBirth.trim(),
      });

      Alert.alert("Success", "Profile updated successfully!");
      router.back();
    } catch (error) {
      Alert.alert("Error", "Failed to update profile. Please try again.");
      console.error("Update error:", error);
    } finally {
      setSaving(false);
    }
  };

  const genderOptions = ["Male", "Female", "Other"];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Photo Section */}
        <View style={styles.photoSection}>
          <View style={styles.photoContainer}>
            {localPhotoURL ? (
              <Image
                source={{ uri: localPhotoURL }}
                style={styles.profilePhoto}
              />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Ionicons name="person" size={60} color="#9CA3AF" />
              </View>
            )}

            {photoLoading && (
              <View style={styles.photoLoadingOverlay}>
                <ActivityIndicator size="large" color="#FFFFFF" />
              </View>
            )}
          </View>

          <TouchableOpacity
            style={[
              styles.uploadButton,
              (photoLoading || uploading) && styles.uploadButtonDisabled,
            ]}
            onPress={pickImage}
            disabled={photoLoading || uploading}
          >
            {photoLoading || uploading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="image-outline" size={20} color="#FFFFFF" />
                <Text style={styles.uploadButtonText}>Change Photo</Text>
              </>
            )}
          </TouchableOpacity>

          <Text style={styles.photoHint}>JPG, PNG or GIF (Max 5MB)</Text>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          {/* Full Name Field */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#6B7280" />
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                value={fullName}
                onChangeText={setFullName}
                placeholderTextColor="#D1D5DB"
                editable={!saving}
              />
            </View>
          </View>

          {/* Email Field (Read-only) */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email Address</Text>
            <View style={[styles.inputContainer, styles.disabledInput]}>
              <Ionicons name="mail-outline" size={20} color="#D1D5DB" />
              <TextInput
                style={[styles.input, styles.disabledText]}
                value={user?.email || ""}
                editable={false}
                placeholderTextColor="#D1D5DB"
              />
            </View>
            <Text style={styles.helperText}>Email cannot be changed</Text>
          </View>

          {/* Phone Field */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="call-outline" size={20} color="#6B7280" />
              <TextInput
                style={styles.input}
                placeholder="Enter your phone number"
                value={phone}
                onChangeText={setPhone}
                placeholderTextColor="#D1D5DB"
                keyboardType="phone-pad"
                editable={!saving}
              />
            </View>
          </View>

          {/* Gender Field */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Gender</Text>
            <TouchableOpacity
              style={styles.inputContainer}
              onPress={() => setShowGenderPicker(!showGenderPicker)}
              disabled={saving}
            >
              <Ionicons name="person-add-outline" size={20} color="#6B7280" />
              <Text
                style={[styles.inputText, !gender && styles.placeholderText]}
              >
                {gender || "Select your gender"}
              </Text>
              <Ionicons
                name={showGenderPicker ? "chevron-up" : "chevron-down"}
                size={20}
                color="#6B7280"
                style={{ marginLeft: "auto" }}
              />
            </TouchableOpacity>

            {showGenderPicker && (
              <View style={styles.dropdownMenu}>
                {genderOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.dropdownItem,
                      gender === option && styles.dropdownItemSelected,
                    ]}
                    onPress={() => {
                      setGender(option);
                      setShowGenderPicker(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        gender === option && styles.dropdownItemTextSelected,
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Date of Birth Field */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Date of Birth</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="calendar-outline" size={20} color="#6B7280" />
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                value={dateOfBirth}
                onChangeText={setDateOfBirth}
                placeholderTextColor="#D1D5DB"
                editable={!saving}
              />
            </View>
            <Text style={styles.helperText}>Format: YYYY-MM-DD</Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.saveButton,
            (saving || uploading || loading) && styles.saveButtonDisabled,
          ]}
          onPress={handleSaveProfile}
          disabled={saving || uploading || loading}
        >
          {saving || uploading || loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backBtn: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },

  // Photo Section
  scrollContent: {
    paddingBottom: 100,
  },
  photoSection: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  photoContainer: {
    position: "relative",
    marginBottom: 16,
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#E5E7EB",
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  photoLoadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 60,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DC2626",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  uploadButtonDisabled: {
    opacity: 0.6,
  },
  uploadButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  photoHint: {
    color: "#6B7280",
    fontSize: 12,
    marginTop: 8,
  },

  // Form Section
  formSection: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  fieldGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#1F2937",
    marginLeft: 12,
  },
  inputText: {
    flex: 1,
    fontSize: 14,
    color: "#1F2937",
    marginLeft: 12,
  },
  placeholderText: {
    color: "#D1D5DB",
  },
  disabledInput: {
    backgroundColor: "#F9FAFB",
  },
  disabledText: {
    color: "#9CA3AF",
  },
  helperText: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 6,
  },

  // Gender Dropdown
  dropdownMenu: {
    position: "absolute",
    top: 56,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    overflow: "hidden",
    zIndex: 10,
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  dropdownItemSelected: {
    backgroundColor: "#FEE2E2",
  },
  dropdownItemText: {
    fontSize: 14,
    color: "#1F2937",
  },
  dropdownItemTextSelected: {
    color: "#DC2626",
    fontWeight: "600",
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DC2626",
    paddingVertical: 14,
    borderRadius: 8,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
