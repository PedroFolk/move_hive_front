import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  Switch,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Dropdown } from "react-native-element-dropdown";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ESPORTES } from "./modalActivities";

export interface ModalEvent {
  id: string;
  title: string;
  sport: string;
  description: string;
  dateString: string;
  city: string;
  state: string;
  hourString: string;
  maxParticipants: number;
  isTournament: boolean;
  isPrivate: boolean;
  imageUri?: string;
}

interface Props {
  visible: boolean;
  defaultSport: string;
  onClose: () => void;
  onSave: (event: ModalEvent) => void;
}
const InfoTooltip = ({ message }: { message: string }) => {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <TouchableOpacity onPress={() => setVisible(true)} style={{ marginLeft: 6 }}>
        <MaterialIcons name="help-outline" size={20} color="gray" />
      </TouchableOpacity>
      <Modal transparent visible={visible} animationType="fade" onRequestClose={() => setVisible(false)}>
        <TouchableOpacity
          className="flex-1  bg-opacity-30 justify-center items-center p-5"
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <View className="bg-neutral-800 p-4 rounded-lg max-w-[80%]">
            <Text className="text-white text-xl">{message}</Text>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};
const EventCreationModal: React.FC<Props> = ({
  visible,
  defaultSport,
  onClose,
  onSave,
}) => {
  const [sport, setSport] = useState(""),
    [title, setTitle] = useState(""),
    [city, setCity] = useState(""),
    [state, setState] = useState(""),
    [maxParticipants, setMaxParticipants] = useState(""),
    [isTournament, setIsTournament] = useState(false),
    [isPrivate, setIsPrivate] = useState(false),
    [date, setDate] = useState(new Date()),
    [description, setDescription] = useState(""),
    [imageUri, setImageUri] = useState<string>();

  useEffect(() => {
    if (visible) {
      setSport("");
      setTitle("");
      setCity("");
      setState("");
      setDescription("");
      setMaxParticipants("");
      setIsTournament(false);
      setIsPrivate(false);
      setDate(new Date());
      setImageUri(undefined);
    }
  }, [visible]);

  const openImagePickerAsync = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) return alert("Permissão negada!");
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) setImageUri(result.assets[0]?.uri);
  };



  const handleSave = () => {
    if (!title.trim() || !sport || !city.trim() || !state.trim()) return;
    const dateString = `${date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    })} - ${date
      .toLocaleDateString("pt-BR", { weekday: "short" })
      .replace(".", "")
      .slice(0, 3)}`;
    const hourString = `${String(date.getHours()).padStart(
      2,
      "0"
    )}:${String(date.getMinutes()).padStart(2, "0")}`;
    onSave({
      id: Date.now().toString(),
      title,
      sport: defaultSport,
      description,
      dateString,
      city,
      state,
      hourString,
      maxParticipants: Number(maxParticipants) || 0,
      isTournament,
      isPrivate,
      imageUri,
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View className="bg-neutral-900 rounded-lg p-6 flex-1">
        <SafeAreaView className="flex-1">
          <Text className="text-2xl font-bold text-center mt-4 mb-6 text-white">
            Novo Evento
          </Text>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{ flex: 1 }}
          >
            <ScrollView
              contentContainerStyle={{ paddingBottom: 20 }}
              showsVerticalScrollIndicator={false}
            >
              <Text className="text-gray-300 mb-1 text-xl">Título</Text>
              <TextInput
                className="text-xl p-4 border border-neutral-600 rounded-xl text-white mb-4"
                value={title}
                onChangeText={setTitle}
                placeholder="Digite o título"
                placeholderTextColor="#888"
              />

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
                  borderRadius: 12,
                }}
                itemTextStyle={{ textAlign: "center", color: "white" }}
                placeholderStyle={{ color: "#888", fontSize: 16 }}
                selectedTextStyle={{ color: "white", fontSize: 16 }}
              />

              <Text className="text-gray-300 mb-1 text-xl">Descrição</Text>
              <TextInput
                className="text-xl p-4 border border-neutral-600 rounded-xl text-white mb-4"
                placeholder="Descrição do evento"
                placeholderTextColor="#888"
                multiline
                value={description}
                onChangeText={setDescription}
              />

              <Text className="text-gray-300 mb-1 text-xl">Cidade</Text>
              <TextInput
                className="text-xl p-4 border border-neutral-600 rounded-xl text-white mb-4"
                value={city}
                onChangeText={setCity}
                placeholder="Cidade"
                placeholderTextColor="#888"
              />
              <Text className="text-gray-300 mb-1 text-xl">Estado</Text>
              <TextInput
                className="text-xl p-4 border border-neutral-600 rounded-xl text-white mb-4"
                value={state}
                onChangeText={setState}
                placeholder="Estado"
                placeholderTextColor="#888"
              />

              <View className="flex flex-row justify-between">
                <View>
                  <Text className="text-gray-300 mb-1 text-xl">Máx. Part.</Text>
                  <TextInput
                    className="text-xl p-4 border border-neutral-600 rounded-xl text-white mb-4"
                    value={maxParticipants}
                    onChangeText={setMaxParticipants}
                    keyboardType="numeric"
                    placeholder="Ex: 20"
                    placeholderTextColor="#888"
                  />
                </View>
                <View className="items-center mb-1">
                  <Text className="text-gray-300 text-xl mb-1">Data</Text>
                  <DateTimePicker
                    value={date}
                    mode="date"
                    onChange={(_, d) => d && setDate(d)}
                  />
                </View>
                <View className="items-center mb-1">
                  <Text className="text-gray-300 text-xl mb-1">Hora</Text>
                  <DateTimePicker
                    value={date}
                    mode="time"
                    onChange={(_, d) => d && setDate(d)}
                    is24Hour
                  />
                </View>
              </View>

              <View className=" justify-center">
                {!imageUri ? (
                  <TouchableOpacity
                    className="flex-row items-center mt-6 justify-center"
                    onPress={openImagePickerAsync}
                  >
                    <MaterialIcons name="image" size={24} color="white" />
                    <Text className="text-white ml-2">Escolher imagem</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    className="mt-4 items-center border-white border-2 rounded-xl"
                    onPress={openImagePickerAsync}
                  >
                    <Image
                      source={{ uri: imageUri }}
                      style={{ width: 100, height: 100, borderRadius: 8 }}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                )}
              </View>

              <View className="flex-row items-center justify-between mt-10">
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text className="text-gray-300 text-xl">É Torneio?</Text>
                  <InfoTooltip message="Torneios são eventos competitivos com chaves e um campeão. Eventos normais são para jogos casuais." />
                </View>
                <Switch value={isTournament} onValueChange={setIsTournament} />
              </View>
              <View className="flex-row items-center justify-between mt-4">
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text className="text-gray-300 text-xl">Evento Privado?</Text>
                  <InfoTooltip message="Evento privado só permite convidados específicos participarem." />
                </View>
                <Switch value={isPrivate} onValueChange={setIsPrivate} />
              </View>



              <TouchableOpacity
                className="rounded-xl p-4 mt-6 bg-yellow-500"
                onPress={handleSave}
              >
                <Text className="text-center text-xl font-semibold text-black">
                  Salvar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="rounded-xl p-4 mt-4"
                onPress={onClose}
              >
                <Text className="text-center text-xl font-semibold text-white">
                  Cancelar
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

export default EventCreationModal;
