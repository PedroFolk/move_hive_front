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
  SafeAreaView,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Calendar, DateData } from "react-native-calendars";
import { colors } from "../styles/styles";
import { Dropdown } from "react-native-element-dropdown";
import { ESPORTES } from "./modalActivities";

interface Event {
  id: string;
  title: string;
  description: string;
  startTime: string;
  location: string;
  date: string;
  imageUri?: string;
}

export const ITEM_HEIGHT = 36;
export const PICKER_HEIGHT = 370;
export const IMAGE_SIZE = 100;
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
    i.toString().padStart(2, "0")
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
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
      <View
        className={`${colors.background_modal} rounded-lg p-6  flex-1 justify-between`}
      >
        <SafeAreaView className="flex-1">
          <Text
            className={`text-2xl font-bold text-center mt-4 mb-10 ${colors.textPrimaryButton}`}
          >
            Esporte
          </Text>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            className="flex-1"
          >
            <Text className="text-gray-300 mb-1 text-xl">Esporte</Text>
            <Dropdown
              data={ESPORTES}
              labelField="label"
              valueField="value"
              placeholder="Selecione um esporte"
              value={newSport}
              onChange={(item) => setNewSport(item.value)}
              style={{
                backgroundColor: "transparent",
                borderRadius: 12,
                paddingHorizontal: 12,
                height: 50,
                marginBottom: 20,
                borderColor: "#4b5563",
                borderWidth: 1,
              }}
              containerStyle={{
                backgroundColor: "#404040",
                borderCurve: "circular",
                borderRadius: 12,
              }}
              itemTextStyle={{
                textAlign: "center",
                color: "white",
              }}
              placeholderStyle={{ color: "#888", fontSize: 16 }}
              selectedTextStyle={{ color: "white", fontSize: 16 }}
            />


            <TextInput
              placeholder="Descrição"
              multiline
              textAlignVertical="top"
              value={newDescription}
              onChangeText={setNewDescription}
            />

            <TouchableOpacity onPress={() => setShowTimePickerModal(true)}>
              <Text>{newStartTime || "HH:MM"}</Text>
            </TouchableOpacity>

            <Modal
              visible={showTimePickerModal}
              transparent
              animationType="fade"
              onRequestClose={commitTimePicker}
            >
              <View>
                <TouchableWithoutFeedback onPress={commitTimePicker}>
                  <View />
                </TouchableWithoutFeedback>
                <View>
                  <View>
                    <FlatList
                      data={hours}
                      keyExtractor={(h) => h}
                      showsVerticalScrollIndicator={false}
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
                        <View>
                          <Text>{item}</Text>
                        </View>
                      )}
                    />
                    <FlatList
                      data={minutes}
                      keyExtractor={(m) => m}
                      showsVerticalScrollIndicator={false}
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
                        <View>
                          <Text>{item}</Text>
                        </View>
                      )}
                    />
                    <View />
                  </View>
                  <Button title="OK" onPress={commitTimePicker} />
                </View>
              </View>
            </Modal>

            <TextInput
              placeholder="Localização"
              value={newLocation}
              onChangeText={setNewLocation}
            />

            <TouchableOpacity onPress={() => setShowCalendarModal(true)}>
              <Text>{newDate || "dd/mm/aaaa"}</Text>
            </TouchableOpacity>

            <Modal
              visible={showCalendarModal}
              transparent
              animationType="fade"
              onRequestClose={commitCalendarPicker}
            >
              <View>
                <TouchableWithoutFeedback onPress={commitCalendarPicker}>
                  <View />
                </TouchableWithoutFeedback>
                <View>
                  <Calendar
                    firstDay={1}
                    monthFormat={"MMMM yyyy"}
                    minDate={today}
                    onDayPress={(day: DateData) => {
                      setNewDate(day.dateString.split("-").reverse().join("/"));
                      commitCalendarPicker();
                    }}
                  />
                </View>
              </View>
            </Modal>

            <TouchableOpacity onPress={openImagePickerAsync}>
              <MaterialIcons name="image" size={20} />
              <Text>Escolher imagem</Text>
            </TouchableOpacity>

            {newImageUri && (
              <View>
                <Image source={{ uri: newImageUri }} resizeMode="cover" />
              </View>
            )}

            <View>
              <TouchableOpacity onPress={onClose}>
                <Text>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSave}>
                <Text>Salvar</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

export default EventCreationModal;
