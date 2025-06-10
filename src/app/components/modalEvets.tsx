import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  FlatList,
  ScrollView,
  Image,
  Platform,
  KeyboardAvoidingView,
  Button,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Calendar, DateData } from "react-native-calendars";
import styles, {
  darkStyles,
  ITEM_HEIGHT,
  PICKER_HEIGHT,
  IMAGE_SIZE,
} from "../events/styles";

interface Event {
  id: string;
  title: string;
  description: string;
  startTime: string;
  location: string;
  date: string;
  imageUri?: string;
}

interface EventCreationModalProps {
  visible: boolean;
  theme: "light" | "dark";
  onClose: () => void;
  onSave: (event: Event) => void;
}

const SPORTS = ["Corrida", "Tênis", "Vôlei", "Beach Tennis", "Yoga"];

const EventCreationModal: React.FC<EventCreationModalProps> = ({
  visible,
  theme,
  onClose,
  onSave,
}) => {
  const [newSport, setNewSport] = useState("");
  const [showSportDropdown, setShowSportDropdown] = useState(false);
  const [newDescription, setNewDescription] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newImageUri, setNewImageUri] = useState<string | undefined>();
  const [newStartTime, setNewStartTime] = useState("");
  const [newDate, setNewDate] = useState("");
  const [showTimePickerModal, setShowTimePickerModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [selectedHour, setSelectedHour] = useState("00");
  const [selectedMinute, setSelectedMinute] = useState("00");

  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0"),
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0"),
  );

  const today = (() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  })();

  const commitTimePicker = () => {
    setNewStartTime(`${selectedHour}:${selectedMinute}`);
    setShowTimePickerModal(false);
  };

  const commitCalendarPicker = () => {
    setShowCalendarModal(false);
  };

  const openImagePickerAsync = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert("Permissão negada!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets.length) {
      setNewImageUri(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    if (
      !newSport ||
      !newDescription.trim() ||
      !newStartTime ||
      !newLocation.trim() ||
      !newDate
    ) {
      alert("Preencha todos os campos corretamente.");
      return;
    }
    if (!/^\d{2}:\d{2}$/.test(newStartTime)) {
      alert("Horário inválido.");
      return;
    }
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(newDate)) {
      alert("Data inválida.");
      return;
    }
    const event: Event = {
      id: Date.now().toString(),
      title: newSport,
      description: newDescription.trim(),
      startTime: newStartTime,
      location: newLocation.trim(),
      date: newDate,
      imageUri: newImageUri,
    };
    onSave(event);
    // Reset form
    setNewSport("");
    setShowSportDropdown(false);
    setNewDescription("");
    setNewLocation("");
    setNewStartTime("");
    setNewDate("");
    setNewImageUri(undefined);
    setSelectedHour("00");
    setSelectedMinute("00");
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={[
            styles.modalContainer,
            { backgroundColor: theme === "dark" ? "#1F1F1F" : "#FFF" },
          ]}
        >
          {/* Esporte */}
          <Text
            style={[
              styles.fieldLabel,
              { color: theme === "dark" ? "#EBEBEB" : "#1F1F1F" },
              { marginBottom: 10 },
            ]}
          >
            Esporte
          </Text>
          <View style={{ position: "relative", marginBottom: 12 }}>
            <TouchableOpacity
              onPress={() => setShowSportDropdown((v) => !v)}
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
                  color: newSport
                    ? theme === "dark"
                      ? "#FFF"
                      : "#000"
                    : "#888",
                }}
              >
                {newSport || "Selecione um esporte..."}
              </Text>
              <Ionicons
                name={showSportDropdown ? "chevron-up" : "chevron-down"}
                size={20}
                color={theme === "dark" ? "#FFF" : "#000"}
              />
            </TouchableOpacity>
            {showSportDropdown && (
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
                  style={{ maxHeight: 140 }}
                  contentContainerStyle={{ paddingVertical: 4 }}
                >
                  {SPORTS.map((sp) => (
                    <TouchableOpacity
                      key={sp}
                      onPress={() => {
                        setNewSport(sp);
                        setShowSportDropdown(false);
                      }}
                      style={[
                        styles.dropdownItem,
                        {
                          borderBottomWidth:
                            sp === SPORTS[SPORTS.length - 1] ? 0 : 1,
                          borderBottomColor: theme === "dark" ? "#444" : "#EEE",
                        },
                      ]}
                    >
                      <Text
                        style={{ color: theme === "dark" ? "#FFF" : "#000" }}
                      >
                        {sp}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          {/* Descrição */}
          <TextInput
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
            placeholder="Descrição"
            placeholderTextColor={theme === "dark" ? "#AAA" : "#888"}
            multiline
            textAlignVertical="top"
            value={newDescription}
            onChangeText={setNewDescription}
          />

          {/* Horário */}
          <TouchableOpacity
            onPress={() => setShowTimePickerModal(true)}
            style={[styles.input, { justifyContent: "center" }]}
          >
            <Text
              style={{
                color: newStartTime
                  ? theme === "dark"
                    ? "#FFF"
                    : "#000"
                  : "#888",
              }}
            >
              {newStartTime || "HH:MM"}
            </Text>
          </TouchableOpacity>

          {/* Modal Horário */}
          <Modal
            visible={showTimePickerModal}
            transparent
            animationType="fade"
            onRequestClose={commitTimePicker}
          >
            <View style={styles.pickerOverlay}>
              <TouchableWithoutFeedback onPress={commitTimePicker}>
                <View style={styles.overlayTouchable} />
              </TouchableWithoutFeedback>
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
                            e.nativeEvent.contentOffset.y / ITEM_HEIGHT,
                          )
                        ],
                      )
                    }
                    renderItem={({ item }) => (
                      <View style={styles.pickerItem}>
                        <Text
                          style={[
                            styles.pickerText,
                            theme === "dark" && darkStyles.pickerText,
                            selectedHour === item && styles.pickerTextSelected,
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
                            e.nativeEvent.contentOffset.y / ITEM_HEIGHT,
                          )
                        ],
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
                <Button title="OK" onPress={commitTimePicker} />
              </View>
            </View>
          </Modal>

          {/* Localização */}
          <TextInput
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
            placeholder="Localização"
            placeholderTextColor={theme === "dark" ? "#AAA" : "#888"}
            value={newLocation}
            onChangeText={setNewLocation}
          />

          {/* Data */}
          <TouchableOpacity
            onPress={() => setShowCalendarModal(true)}
            style={[styles.input, { justifyContent: "center" }]}
          >
            <Text
              style={{
                color: newDate ? (theme === "dark" ? "#FFF" : "#000") : "#888",
              }}
            >
              {newDate || "dd/mm/aaaa"}
            </Text>
          </TouchableOpacity>

          {/* Modal Calendário */}
          <Modal
            visible={showCalendarModal}
            transparent
            animationType="fade"
            onRequestClose={commitCalendarPicker}
          >
            <View style={styles.pickerOverlay}>
              <TouchableWithoutFeedback onPress={commitCalendarPicker}>
                <View style={styles.overlayTouchable} />
              </TouchableWithoutFeedback>
              <View
                style={[
                  styles.calendarContainer,
                  theme === "dark" && darkStyles.calendarContainer,
                ]}
              >
                <Calendar
                  firstDay={1}
                  monthFormat={"MMMM yyyy"}
                  minDate={today}
                  theme={{
                    calendarBackground: theme === "dark" ? "#1F1F1F" : "#fff",
                    textSectionTitleColor:
                      theme === "dark" ? "#BDBDBD" : "#2d4150",
                    dayTextColor: theme === "dark" ? "#fff" : "#2d4150",
                    monthTextColor: theme === "dark" ? "#fff" : "#2d4150",
                    arrowColor: theme === "dark" ? "#fff" : "#2d4150",
                    todayTextColor: theme === "dark" ? "#FFA500" : "#00adf5",
                    selectedDayBackgroundColor:
                      theme === "dark" ? "#FFA500" : "#00adf5",
                    selectedDayTextColor: theme === "dark" ? "#000" : "#fff",
                  }}
                  onDayPress={(day: DateData) => {
                    setNewDate(day.dateString.split("-").reverse().join("/"));
                    commitCalendarPicker();
                  }}
                />
              </View>
            </View>
          </Modal>

          {/* Image Picker */}
          <TouchableOpacity
            onPress={openImagePickerAsync}
            style={[
              styles.imagePickerButton,
              theme === "dark"
                ? { borderColor: "#666", backgroundColor: "#2A2A2A" }
                : { borderColor: "#CCC", backgroundColor: "#F5F5F5" },
            ]}
          >
            <MaterialIcons
              name="image"
              size={20}
              color={theme === "dark" ? "#FFF" : "#333"}
            />
            <Text
              style={{
                marginLeft: 8,
                color: theme === "dark" ? "#FFF" : "#333",
              }}
            >
              Escolher imagem
            </Text>
          </TouchableOpacity>
          {newImageUri && (
            <View style={{ alignItems: "center", marginBottom: 16 }}>
              <Image
                source={{ uri: newImageUri }}
                style={{
                  width: IMAGE_SIZE,
                  height: IMAGE_SIZE,
                  borderRadius: 8,
                }}
                resizeMode="cover"
              />
            </View>
          )}

          {/* Ações */}
          <View style={styles.modalActions}>
            <TouchableOpacity
              onPress={onClose}
              style={[
                styles.modalBtnCancel,
                {
                  backgroundColor: theme === "dark" ? "#444" : "#DDD",
                },
                { marginBottom: 8 },
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
                { marginBottom: 8 },
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

export default EventCreationModal;
