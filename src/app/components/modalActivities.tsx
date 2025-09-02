import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { colors } from "../../styles/styles";
import { ListarEsportes } from "~/api/getSports";
import { MaterialIcons } from "@expo/vector-icons";
import { PostarTreino } from "~/api/activities";
import { Picker } from "@react-native-picker/picker";

export interface ModalActivity {
  pontos: number;
  descricao: string;
  id: string;
  sport: string;
  time: string;
  dateString: string;
  location: string;
  category: string;
  fotoUri?: string;
  tempoTreinado: number;
}

export interface Imagem {
  uri: string;
  name: string;
  type: string;
}

interface ActivityCreationModalProps {
  visible: boolean;
  defaultCategory: string;
  onClose: () => void;
  onSave: (activity: ModalActivity) => void;
}

const ActivityCreationModal: React.FC<ActivityCreationModalProps> = ({
  visible,
  defaultCategory,
  onClose,
  onSave,
}) => {
  const [sport, setSport] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState(new Date());
  const [esportes, setEsportes] = useState<any[]>([]);
  const [foto, setFoto] = useState<Imagem | undefined>(undefined);
  const [titulo, setTitulo] = useState("");
  const [tempoTreinadoMinutos, setTempoTreinadoMinutos] = useState(0);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [horaSelecionada, setHoraSelecionada] = useState(0);
  const [minutoSelecionado, setMinutoSelecionado] = useState(0);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const horas = Array.from({ length: 10 }, (_, i) => i);
  const minutos = Array.from({ length: 60 }, (_, i) => i);

  useEffect(() => {
    if (visible) {
      setSport("");
      setLocation("");
      setDate(new Date());
      setFoto(undefined);
      setTempoTreinadoMinutos(0);
      setTitulo("");
      setHoraSelecionada(0);
      setMinutoSelecionado(0);

      const fetchEsportes = async () => {
        const data = await ListarEsportes();
        setEsportes(data);
      };
      fetchEsportes();
    }
  }, [visible]);

  const abrirGaleria = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) return alert("Permissão negada!");
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) {
      const asset = result.assets[0];
      setFoto({
        uri: asset.uri,
        name: asset.fileName || `imagem.${asset.uri.split(".").pop()}`,
        type: `image/${asset.uri.split(".").pop()}`,
      });
    }
  };

  const confirmarTempo = () => {
    const totalMinutos = horaSelecionada * 60 + minutoSelecionado;
    setTempoTreinadoMinutos(totalMinutos);
    setPickerVisible(false);
  };

  const handleSave = async () => {
    if (!sport.trim() || !location.trim()) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }
    setIsSaving(true);

    const treino = {
      id: Date.now().toString(),
      titulo: titulo || `Treino de ${sport}`,
      descricao: `Treino realizado em ${location}`,
      nome_esporte: sport,
      data_hora_str: date,
      lugar: location,
      tempo_treinado: tempoTreinadoMinutos,
      imagem: foto
        ? {
            uri: foto.uri,
            name: foto.name,
            type: foto.type,
          }
        : undefined,
    };

    try {
      const resultado = await PostarTreino(treino);

      if (resultado) {
        onSave({
          id: treino.id,
          sport,
          time: `${date.getHours().toString().padStart(2, "0")}:${date
            .getMinutes()
            .toString()
            .padStart(2, "0")}`,
          dateString: date.toLocaleDateString("pt-BR"),
          location,
          category: defaultCategory,
          fotoUri: foto?.uri,
          tempoTreinado: tempoTreinadoMinutos,
          descricao: "",
          pontos: 0,
        });
        onClose();
      } else {
        alert("Erro ao salvar treino.");
      }
    } catch (error) {
      console.error(error);
      alert("Ocorreu um erro ao salvar o treino.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="bg-neutral-900 px-6 flex-1 py-safe justify-between">
        <SafeAreaView className="flex-1">
          <Text
            className={`text-2xl font-bold text-center mt-4 mb-10 ${colors.textPrimaryButton}`}
          >
            Nova Atividade
          </Text>

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 h-full w-full"
          >
            <ScrollView
              contentContainerStyle={{ paddingBottom: 20 }}
              showsVerticalScrollIndicator={false}
            >
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View className="flex-1">
                  <View className="flex-row mb-10 ">
                    <TouchableOpacity
                      className="justify-center border-2 border-neutral-600 rounded-2xl h-32 w-32 "
                      onPress={abrirGaleria}
                    >
                      {!foto ? (
                        <TouchableOpacity
                          className="flex-row items-center justify-center mx-10 my-4"
                          onPress={abrirGaleria}
                        >
                          <MaterialIcons name="image" size={32} color="white" />
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          className="items-center border-white border-2 rounded-xl"
                          onPress={abrirGaleria}
                        >
                          <Image
                            source={{ uri: foto.uri }}
                            style={{ width: 100, height: 100, borderRadius: 8 }}
                            resizeMode="cover"
                          />
                        </TouchableOpacity>
                      )}
                    </TouchableOpacity>

                    <TextInput
                      className="flex-1 text-start items-start border-2 rounded-2xl border-neutral-600 p-2 text-lg text-white ml-3"
                      onChangeText={setTitulo}
                      value={titulo}
                      placeholder="Digite algo..."
                      keyboardType="default"
                      multiline
                      placeholderTextColor={"gray"}
                      textAlignVertical="top"
                    />
                  </View>

                  <Text className="text-gray-300 mb-1 text-xl">Esporte</Text>
                  <Dropdown
                    data={esportes}
                    labelField="label"
                    valueField="value"
                    placeholder="Selecione uma atividade"
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

                  <Text className="text-gray-300 mb-1 text-xl">
                    Tempo da atividade
                  </Text>
                  <TouchableOpacity
                    className="border border-neutral-600 rounded-xl p-4 mb-4"
                    onPress={() => setPickerVisible(true)}
                  >
                    <Text className="text-white text-xl">
                      {`${Math.floor(tempoTreinadoMinutos / 60)}h ${tempoTreinadoMinutos % 60}m`}
                    </Text>
                  </TouchableOpacity>

                  <Modal
                    visible={pickerVisible}
                    transparent
                    animationType="slide"
                  >
                    <View className="flex-1 justify-center bg-black/60">
                      <View className="bg-neutral-900 mx-4 rounded-xl p-4">
                        <Text className="text-white text-xl mb-2">
                          Selecione o tempo
                        </Text>
                        <View className="flex-row justify-between">
                          <Picker
                            selectedValue={horaSelecionada}
                            onValueChange={setHoraSelecionada}
                            style={{ flex: 1, color: "white" }}
                          >
                            {horas.map((h) => (
                              <Picker.Item key={h} label={`${h}h`} value={h} />
                            ))}
                          </Picker>
                          <Picker
                            selectedValue={minutoSelecionado}
                            onValueChange={setMinutoSelecionado}
                            style={{ flex: 1, color: "white" }}
                          >
                            {minutos.map((m) => (
                              <Picker.Item key={m} label={`${m}m`} value={m} />
                            ))}
                          </Picker>
                        </View>

                        <TouchableOpacity
                          className="bg-yellow-500 p-3 rounded-xl mt-4"
                          onPress={confirmarTempo}
                        >
                          <Text className="text-center text-black font-semibold text-lg">
                            Confirmar
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          className="mt-2 p-3"
                          onPress={() => setPickerVisible(false)}
                        >
                          <Text className="text-center text-white text-lg">
                            Cancelar
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </Modal>

                  <Text className="text-gray-300 mb-1 text-xl">Local</Text>
                  <TextInput
                    className="text-xl p-4 border border-neutral-600 rounded-xl text-white"
                    onChangeText={setLocation}
                    value={location}
                    placeholder="Local"
                    placeholderTextColor={"gray"}
                  />

                  {Platform.OS === "android" ? (
                    <View className="flex-row justify-around mt-4 mb-4">
                      <View className="items-center mb-1">
                        <Text className="text-gray-300 mb-1 text-xl ">
                          Data
                        </Text>
                        <TouchableOpacity
                          className="border border-neutral-600 rounded-xl p-2"
                          onPress={() => setShowDatePicker(true)}
                        >
                          <Text className="text-white">
                            {date.toLocaleDateString("pt-BR")}
                          </Text>
                        </TouchableOpacity>
                        {showDatePicker && (
                          <DateTimePicker
                            value={date}
                            mode="date"
                            display="default"
                            onChange={(_, selected) => {
                              setShowDatePicker(false);
                              if (selected) setDate(selected);
                            }}
                          />
                        )}
                      </View>

                      <View className="items-center mb-1">
                        <Text className="text-gray-300 mb-1 text-xl">Hora</Text>
                        <TouchableOpacity
                          className="border border-neutral-600 rounded-xl p-2"
                          onPress={() => setShowTimePicker(true)}
                        >
                          <Text className="text-white">
                            {`${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`}
                          </Text>
                        </TouchableOpacity>
                        {showTimePicker && (
                          <DateTimePicker
                            value={date}
                            mode="time"
                            is24Hour
                            display="default"
                            onChange={(_, selected) => {
                              setShowTimePicker(false);
                              if (selected) setDate(selected);
                            }}
                          />
                        )}
                      </View>
                    </View>
                  ) : (
                    <View className="flex-row justify-around mt-4 mb-4">
                      <View className="items-center mb-1">
                        <Text className="text-gray-300 mb-1 text-xl ">
                          Data
                        </Text>
                        <DateTimePicker
                          timeZoneName="pt-br"
                          mode="date"
                          value={date}
                          onChange={(_, selected) =>
                            selected && setDate(selected)
                          }
                        />
                      </View>

                      <View className="items-center mb-1">
                        <Text className="text-gray-300 mb-1 text-xl">Hora</Text>
                        <DateTimePicker
                          timeZoneName="pt-br"
                          mode="time"
                          is24Hour
                          value={date}
                          onChange={(_, selected) =>
                            selected && setDate(selected)
                          }
                        />
                      </View>
                    </View>
                  )}
                </View>
              </TouchableWithoutFeedback>

              <TouchableOpacity
                className={`rounded-xl p-4 mb-4 mt-10 ${
                  isSaving ? "bg-gray-600" : "bg-yellow-500 border-yellow-500"
                }`}
                onPress={handleSave}
                disabled={isSaving}
              >
                <Text className="text-center text-xl font-semibold text-black">
                  {isSaving ? "Salvando..." : "Continuar"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="rounded-xl p-4 mb-4"
                onPress={onClose}
                disabled={isSaving}
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

export default ActivityCreationModal;
