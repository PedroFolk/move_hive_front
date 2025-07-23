import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  FlatList,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles, {
  darkStyles,
  ITEM_HEIGHT,
  PICKER_HEIGHT,
} from "../events/styles";

export interface ModalActivity {
  id: string;
  sport: string;
  time: string;
  location: string;
  category: string;
}

interface ActivityCreationModalProps {
  visible: boolean;
  theme: "light" | "dark";
  defaultCategory: string;
  onClose: () => void;
  onSave: (activity: ModalActivity) => void;
}

export const SPORTS = ["Corrida", "Tênis", "Vôlei", "Beach Tennis", "Yoga"];

const ActivityCreationModal: React.FC<ActivityCreationModalProps> = ({
  visible,
  theme,
  defaultCategory,
  onClose,
  onSave,
}) => {
  const [sport, setSport] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedHour, setSelectedHour] = useState("00");
  const [selectedMinute, setSelectedMinute] = useState("00");
  const [location, setLocation] = useState("");

  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0")
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  );

  useEffect(() => {
    if (visible) {
      setSport("");
      setShowDropdown(false);
      setShowTimePicker(false);
      setSelectedHour("00");
      setSelectedMinute("00");
      setLocation("");
    }
  }, [visible]);

  const commitTimePicker = () => setShowTimePicker(false);

  const handleSave = () => {
    const time = `${selectedHour}:${selectedMinute}`;
    if (!sport || !location.trim()) return;
    onSave({
      id: Date.now().toString(),
      sport,
      time,
      location,
      category: defaultCategory,
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{
            backgroundColor: theme === "dark" ? "#1F1F1F" : "#FFF",
            padding: 16,
            borderRadius: 8,
            width: "90%",
            alignSelf: "center",
          }}
        >
          <Text
            style={[
              styles.fieldLabel,
              {
                marginBottom: 10,
                color: theme === "dark" ? "#EBEBEB" : "#1F1F1F",
              },
            ]}
          >
            Esporte
          </Text>
          <View style={{ position: "relative", marginBottom: 12 }}>
            <TouchableOpacity
              onPress={() => setShowDropdown((v) => !v)}
              style={[
                styles.dropdownTrigger,
                {
                  backgroundColor: theme === "dark" ? "#272727" : "#FFF",
                  borderColor: theme === "dark" ? "#555" : "#CCC",
                },
              ]}
            >
              <Text
                style={{
                  color: sport ? (theme === "dark" ? "#FFF" : "#000") : "#888",
                }}
              >
                {sport || "Selecione esporte"}
              </Text>
              <Ionicons
                name={showDropdown ? "chevron-up" : "chevron-down"}
                size={20}
                color={theme === "dark" ? "#FFF" : "#000"}
              />
            </TouchableOpacity>
            {showDropdown && (
              <View
                style={[
                  styles.dropdownListAbsolute,
                  {
                    backgroundColor: theme === "dark" ? "#272727" : "#FFF",
                    borderColor: theme === "dark" ? "#555" : "#CCC",
                  },
                ]}
              >
                <ScrollView
                  contentContainerStyle={{ paddingVertical: 4 }}
                  style={{ maxHeight: 140 }}
                >
                  {SPORTS.map((s) => (
                    <TouchableOpacity
                      key={s}
                      onPress={() => {
                        setSport(s);
                        setShowDropdown(false);
                      }}
                      style={[
                        styles.dropdownItem,
                        {
                          borderBottomWidth:
                            s === SPORTS[SPORTS.length - 1] ? 0 : 1,
                          borderBottomColor: theme === "dark" ? "#444" : "#EEE",
                        },
                      ]}
                    >
                      <Text
                        style={{ color: theme === "dark" ? "#FFF" : "#000" }}
                      >
                        {s}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          <TouchableOpacity
            onPress={() => setShowTimePicker(true)}
            style={[
              styles.input,
              { justifyContent: "center", marginBottom: 12 },
            ]}
          >
            <Text
              style={{ color: theme === "dark" ? "#FFF" : "#000" }}
            >{`${selectedHour}:${selectedMinute}`}</Text>
          </TouchableOpacity>
          {showTimePicker && (
            <Modal
              visible
              transparent
              animationType="fade"
              onRequestClose={commitTimePicker}
            >
              <View style={styles.pickerOverlay}>
                <TouchableOpacity
                  style={styles.overlayTouchable}
                  activeOpacity={1}
                  onPress={commitTimePicker}
                />
                <View
                  style={[
                    styles.pickerContainer,
                    theme === "dark" && darkStyles.pickerContainer,
                  ]}
                >
                  <View style={styles.pickerWheelRow}>
                    <FlatList
                      data={hours}
                      keyExtractor={(h) => h}
                      style={styles.pickerWheel}
                      showsVerticalScrollIndicator={false}
                      snapToInterval={ITEM_HEIGHT}
                      decelerationRate="fast"
                      getItemLayout={(_, i) => ({
                        length: ITEM_HEIGHT,
                        offset: ITEM_HEIGHT * i,
                        index: i,
                      })}
                      contentContainerStyle={{
                        paddingVertical: (PICKER_HEIGHT - ITEM_HEIGHT) / 2,
                      }}
                      onMomentumScrollEnd={(e) =>
                        setSelectedHour(
                          hours[
                            Math.round(
                              e.nativeEvent.contentOffset.y / ITEM_HEIGHT
                            )
                          ]
                        )
                      }
                      renderItem={({ item }) => (
                        <View style={styles.pickerItem}>
                          <Text
                            style={[
                              styles.pickerText,
                              theme === "dark" && darkStyles.pickerText,
                              selectedHour === item &&
                                styles.pickerTextSelected,
                              theme === "dark" &&
                                selectedHour === item &&
                                darkStyles.pickerTextSelected,
                            ]}
                          >
                            {item}
                          </Text>
                        </View>
                      )}
                    />
                    <FlatList
                      data={minutes}
                      keyExtractor={(m) => m}
                      style={styles.pickerWheel}
                      showsVerticalScrollIndicator={false}
                      snapToInterval={ITEM_HEIGHT}
                      decelerationRate="fast"
                      getItemLayout={(_, i) => ({
                        length: ITEM_HEIGHT,
                        offset: ITEM_HEIGHT * i,
                        index: i,
                      })}
                      contentContainerStyle={{
                        paddingVertical: (PICKER_HEIGHT - ITEM_HEIGHT) / 2,
                      }}
                      onMomentumScrollEnd={(e) =>
                        setSelectedMinute(
                          minutes[
                            Math.round(
                              e.nativeEvent.contentOffset.y / ITEM_HEIGHT
                            )
                          ]
                        )
                      }
                      renderItem={({ item }) => (
                        <View style={styles.pickerItem}>
                          <Text
                            style={[
                              styles.pickerText,
                              theme === "dark" && darkStyles.pickerText,
                              selectedMinute === item &&
                                styles.pickerTextSelected,
                              theme === "dark" &&
                                selectedMinute === item &&
                                darkStyles.pickerTextSelected,
                            ]}
                          >
                            {item}
                          </Text>
                        </View>
                      )}
                    />
                    <View
                      style={[
                        styles.pickerHighlight,
                        theme === "dark" && darkStyles.pickerHighlight,
                      ]}
                    />
                  </View>
                </View>
              </View>
            </Modal>
          )}

          <TextInput
            placeholder="Localização"
            placeholderTextColor={theme === "dark" ? "#AAA" : "#888"}
            value={location}
            onChangeText={setLocation}
            style={[
              styles.input,
              theme === "dark"
                ? {
                    borderColor: "#444",
                    backgroundColor: "#333",
                    color: "#FFF",
                  }
                : {
                    borderColor: "#CCC",
                    backgroundColor: "#FFF",
                    color: "#000",
                  },
            ]}
          />

          <View style={styles.modalActions}>
            <TouchableOpacity
              onPress={onClose}
              style={[
                styles.modalBtnCancel,
                { backgroundColor: theme === "dark" ? "#444" : "#DDD" },
              ]}
            >
              <Text style={{ color: theme === "dark" ? "#FFF" : "#000" }}>
                Cancelar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              style={[
                styles.modalBtnSave,
                { backgroundColor: theme === "dark" ? "#FFD700" : "#FFA500" },
              ]}
            >
              <Text style={{ color: "#FFF" }}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default ActivityCreationModal;
