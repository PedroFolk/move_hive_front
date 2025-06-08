// events/index.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
  Modal,
  TextInput,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  LayoutAnimation,
  UIManager,
  ScrollView,
  Button,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Calendar, DateData, LocaleConfig } from "react-native-calendars";
import { BottomNav } from "../components/menuBottom";

import styles, {
  darkStyles,
  ITEM_HEIGHT,
  PICKER_HEIGHT,
  IMAGE_SIZE,
} from "./styles";

LocaleConfig.locales["pt-br"] = {
  monthNames: [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ],
  monthNamesShort: [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ],
  dayNames: [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
  ],
  dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
  today: "Hoje",
};
LocaleConfig.defaultLocale = "pt-br";

interface Event {
  id: string;
  title: string;
  description: string;
  startTime: string;
  location: string;
  date: string;
  imageUri?: string;
}

const SPORTS = ["Corrida", "Tênis", "Vôlei", "Beach Tennis", "Yoga"];

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function Events() {
  const theme = useColorScheme() || "light";

  // Lista de eventos
  const [selectedTab, setSelectedTab] = useState<"events" | "tournaments">(
    "events"
  );
  const [events, setEvents] = useState<Event[]>([]);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  // Modais
  const [showModal, setShowModal] = useState(false);
  const [showTimePickerModal, setShowTimePickerModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);

  // Campos do formulário
  const [newSport, setNewSport] = useState("");
  const [showSportDropdown, setShowSportDropdown] = useState(false);
  const [newDescription, setNewDescription] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newImageUri, setNewImageUri] = useState<string>();

  // Horário e data
  const [newStartTime, setNewStartTime] = useState("");
  const [newDate, setNewDate] = useState("");
  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0")
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  );
  const [selectedHour, setSelectedHour] = useState("00");
  const [selectedMinute, setSelectedMinute] = useState("00");

  // data de hoje
  const today = (() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`; // ex: "2025-06-07"
  })();

  // Confirma pickers
  const commitTimePicker = () => {
    setNewStartTime(`${selectedHour}:${selectedMinute}`);
    setShowTimePickerModal(false);
  };
  const commitCalendarPicker = () => {
    setShowCalendarModal(false);
  };

  // Image Picker
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

  // Criar evento
  const handleCreateEvent = () => {
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
    const e: Event = {
      id: Date.now().toString(),
      title: newSport,
      description: newDescription.trim(),
      startTime: newStartTime,
      location: newLocation.trim(),
      date: newDate,
      imageUri: newImageUri,
    };
    setEvents((prev) => [e, ...prev]);
    // reset
    setNewSport("");
    setShowSportDropdown(false);
    setNewDescription("");
    setNewLocation("");
    setNewStartTime("");
    setNewDate("");
    setNewImageUri(undefined);
    setSelectedHour("00");
    setSelectedMinute("00");
    setShowModal(false);
  };

  // Expandir card
  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedCardId((prev) => (prev === id ? null : id));
  };

  // Render card
  const renderEventCard = ({ item }: { item: Event }) => {
    const open = item.id === expandedCardId;
    return (
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme === "dark" ? "#1F1F1F" : "#FFF",
            borderColor: theme === "dark" ? "#333" : "#ECECEC",
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => toggleExpand(item.id)}
          activeOpacity={0.8}
          style={{ flexDirection: "row", minHeight: IMAGE_SIZE }}
        >
          {item.imageUri ? (
            <Image
              source={{ uri: item.imageUri }}
              style={[
                styles.cardImage,
                { borderBottomLeftRadius: open ? 0 : 8 },
              ]}
              resizeMode="cover"
            />
          ) : (
            <View
              style={[
                styles.cardImage,
                {
                  backgroundColor: theme === "dark" ? "#2A2A2A" : "#F5F5F5",
                  borderBottomLeftRadius: open ? 0 : 8,
                },
              ]}
            >
              <MaterialIcons
                name="image"
                size={24}
                color={theme === "dark" ? "#555" : "#AAA"}
              />
            </View>
          )}
          <View style={styles.cardContent}>
            <Text
              style={[
                styles.cardTitle,
                { color: theme === "dark" ? "#FFF" : "#1F1F1F" },
              ]}
            >
              {item.title}
            </Text>
            <View style={styles.cardInfoRow}>
              <MaterialIcons
                name="access-time"
                size={14}
                color={theme === "dark" ? "#DDD" : "#666"}
              />
              <Text
                style={[
                  styles.cardInfoText,
                  { color: theme === "dark" ? "#CCC" : "#666" },
                ]}
              >
                {item.startTime}
              </Text>
            </View>
            <View style={styles.cardInfoRow}>
              <MaterialIcons
                name="place"
                size={14}
                color={theme === "dark" ? "#DDD" : "#666"}
              />
              <Text
                style={[
                  styles.cardInfoText,
                  { color: theme === "dark" ? "#CCC" : "#666" },
                ]}
              >
                {item.location}
              </Text>
            </View>
            <Text
              style={[
                styles.cardDate,
                { color: theme === "dark" ? "#CCC" : "#444" },
              ]}
            >
              {item.date}
            </Text>
          </View>
        </TouchableOpacity>
        {open && (
          <View
            style={[
              styles.cardFooter,
              { backgroundColor: theme === "dark" ? "#272727" : "#F9F9F9" },
            ]}
          >
            <Text
              style={[
                styles.cardDesc,
                { color: theme === "dark" ? "#DDD" : "#333" },
              ]}
            >
              {item.description}
            </Text>
            <TouchableOpacity
              style={[
                styles.cardButton,
                { backgroundColor: theme === "dark" ? "#E9B308" : "#FFA500" },
              ]}
            >
              <Text
                style={[
                  styles.cardButtonText,
                  { color: theme === "dark" ? "#525252" : "#FFF" },
                ]}
              >
                Inscreva-se
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme === "dark" ? "#272727" : "#FFF",
      }}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text
          style={[
            styles.headerTitle,
            { color: theme === "dark" ? "#EBEBEB" : "#1F1F1F" },
          ]}
        >
          Eventos
        </Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity>
            <MaterialIcons
              name="search"
              size={28}
              color={theme === "dark" ? "#EBEBEB" : "#000"}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <MaterialIcons
              name="more-vert"
              size={28}
              color={theme === "dark" ? "#EBEBEB" : "#000"}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          onPress={() => setSelectedTab("events")}
          style={[
            styles.tabButton,
            {
              backgroundColor:
                selectedTab === "events" ? "#FFF" : "transparent",
              borderColor: theme === "dark" ? "#FFF" : "#444",
            },
          ]}
        >
          <Text
            style={{
              color:
                selectedTab === "events"
                  ? "#000"
                  : theme === "dark"
                    ? "#FFF"
                    : "#444",
            }}
          >
            Eventos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelectedTab("tournaments")}
          style={[
            styles.tabButton,
            {
              backgroundColor:
                selectedTab === "tournaments" ? "#FFF" : "transparent",
              borderColor: theme === "dark" ? "#FFF" : "#444",
            },
          ]}
        >
          <Text
            style={{
              color:
                selectedTab === "tournaments"
                  ? "#000"
                  : theme === "dark"
                    ? "#FFF"
                    : "#444",
            }}
          >
            Torneios
          </Text>
        </TouchableOpacity>
      </View>

      {/* Subtitle */}
      {selectedTab === "events" && (
        <Text
          style={[
            styles.subtitle,
            { color: theme === "dark" ? "#EBEBEB" : "#1F1F1F" },
          ]}
        >
          Próximos eventos
        </Text>
      )}

      {/* Lista */}
      <View style={styles.listContainer}>
        {selectedTab === "events" ? (
          events.length > 0 ? (
            <FlatList
              data={events}
              keyExtractor={(item) => item.id}
              renderItem={renderEventCard}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 120 }}
            />
          ) : (
            <View style={styles.empty}>
              <Text style={{ color: theme === "dark" ? "#BBBBBB" : "#777" }}>
                Nenhum evento cadastrado
              </Text>
            </View>
          )
        ) : (
          <View style={styles.empty}>
            <Text style={{ color: theme === "dark" ? "#BBBBBB" : "#777" }}>
              Nenhum torneio disponível
            </Text>
          </View>
        )}
      </View>

      {/* Botão de adicionar */}
      <TouchableOpacity
        style={[
          styles.addButton,
          { backgroundColor: theme === "dark" ? "#525252" : "#FFA500" },
        ]}
        onPress={() => setShowModal(true)}
      >
        <Ionicons
          name="add"
          size={28}
          color={theme === "dark" ? "#EBEBEB" : "#FFF"}
        />
      </TouchableOpacity>

      {/* Modal de criação */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowModal(false)}
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
                            borderBottomColor:
                              theme === "dark" ? "#444" : "#EEE",
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
                  color: newDate
                    ? theme === "dark"
                      ? "#FFF"
                      : "#000"
                    : "#888",
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
                onPress={() => {
                  setNewSport("");
                  setShowSportDropdown(false);
                  setNewDescription("");
                  setNewStartTime("");
                  setNewDate("");
                  setNewImageUri(undefined);
                  setShowModal(false);
                }}
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
                onPress={handleCreateEvent}
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

      <BottomNav />
    </SafeAreaView>
  );
}
