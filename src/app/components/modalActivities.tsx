import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Button,
  Pressable,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { colors } from "../styles/styles";
import { Dropdown } from "react-native-element-dropdown";
import DateTimePicker from "@react-native-community/datetimepicker";

export interface ModalActivity {
  id: string;
  sport: string;
  time: string;
  dateString: string;
  location: string;
  category: string;
}

interface ActivityCreationModalProps {
  visible: boolean;
  defaultCategory: string;
  onClose: () => void;
  onSave: (activity: ModalActivity) => void;
}

export const ESPORTES = [
  { label: "Corrida", value: "Corrida" },
  { label: "Tênis", value: "Tênis" },
  { label: "Vôlei", value: "Vôlei" },
  { label: "Beach Tennis", value: "Beach Tennis" },
  { label: "Yoga", value: "Yoga" },
];

const ActivityCreationModal: React.FC<ActivityCreationModalProps> = ({
  visible,
  defaultCategory,
  onClose,
  onSave,
}) => {
  const [sport, setSport] = useState("");
  const [location, setLocation] = useState("");

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    if (visible) {
      setSport("");
      setLocation("");
      setDate(new Date());
    }
  }, [visible]);

  const handleSave = () => {
    const formattedDate = date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    });

    const dayOfWeek = date
      .toLocaleDateString("pt-BR", { weekday: "short" })
      .replace(".", "")
      .charAt(0)
      .toUpperCase() +
      date.toLocaleDateString("pt-BR", { weekday: "short" }).slice(1, 3);

    const dateString = `${formattedDate} - ${dayOfWeek}`;
    const time = `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
    if (!sport || !location.trim()) return;
    onSave({
      id: Date.now().toString(),
      sport,
      time,
      dateString,
      location,
      category: defaultCategory,
    });
    onClose();
  };

  const cancel = () => {
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View
        className={`${colors.background_modal} rounded-lg p-6  flex-1 justify-between`}
      >
        <SafeAreaView className="flex-1">
          <Text
            className={`text-2xl font-bold text-center mt-4 mb-10 ${colors.textPrimaryButton}`}
          >
            Novo Esporte
          </Text>


          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1"
          >
            <View className="flex-1">
              <Text className="text-gray-300 mb-1 text-xl">Esporte</Text>
              <Dropdown
                data={ESPORTES}
                labelField="label"
                valueField="value"
                placeholder="Selecione um esporte"
                value={sport}
                onChange={(item) => setSport(item.value)}
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

              <Text className="text-gray-300 mb-1 text-xl">Local</Text>
              <TextInput
                className="text-xl p-4 border border-neutral-600 rounded-xl text-white"
                onChangeText={setLocation}
                value={location}
                placeholder="Onde será o encontro?"

              />

              <Text className="text-gray-300 mb-1 text-xl mt-4">Data</Text>
              <DateTimePicker

                timeZoneName="pt-br"
                mode="date"
                value={date}
                onChange={(e, selected) => {
                  setShowDatePicker(false);
                  if (selected) setDate(selected);
                }}
              />



              <Text className="text-gray-300 mb-1 text-xl mt-4">Hora</Text>
              <DateTimePicker
                timeZoneName="pt-br"
                mode="time"
                value={date}
                onChange={(e, selected) => {
                  setShowTimePicker(false);
                  if (selected) setDate(selected);
                }}
                is24Hour
              />


            </View>
          </KeyboardAvoidingView>

          <TouchableOpacity
            className={`rounded-xl  p-4 mb-4 bg-yellow-500 border-yellow-500 mt-auto`}
            onPress={() => { handleSave() }}

          >
            <Text
              className={`text-center text-xl font-semibold text-black`}
            >
              Continuar
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`rounded-xl  p-4 mb-4  mt-auto`}
            onPress={() => { cancel() }}

          >
            <Text
              className={`text-center text-xl font-semibold text-white`}
            >
              Cancelar
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

export default ActivityCreationModal;
