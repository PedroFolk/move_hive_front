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
  ScrollView,
  Switch,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { AdicionarHive } from "~/api/hive";
import CustomDropdown from "../customDropdown";
import ufCidadeJson from "../../app/uf_cidade.json";

interface ImagemHive {
  uri: string;
  name: string;
  type: string;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: () => void; // chamada após sucesso
}

const HiveCreationModal: React.FC<Props> = ({ visible, onClose, onSave }) => {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [esporte, setEsporte] = useState("");
  const [date, setDate] = useState(new Date());
  const [estado, setEstado] = useState("");
  const [cidade, setCidade] = useState("");
  const [endereco, setEndereco] = useState("");
  const [maxParticipantes, setMaxParticipantes] = useState<number>(0);
  const [privado, setPrivado] = useState(false);
  const [observacoes, setObservacoes] = useState("");
  const [image, setImage] = useState<ImagemHive | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);
  const [estados, setEstados] = useState<{ label: string; value: string }[]>([]);
  const [cidades, setCidades] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    if (ufCidadeJson?.estados) {
      setEstados(
        ufCidadeJson.estados.map((uf: any) => ({
          label: `${uf.nome} (${uf.sigla})`,
          value: uf.sigla,
        }))
      );
    }
  }, []);

  const handleEstadoChange = (ufSigla: string) => {
    setEstado(ufSigla);
    setCidade("");
    const estadoEncontrado = ufCidadeJson.estados.find(
      (e: any) => e.sigla === ufSigla
    );
    setCidades(
      estadoEncontrado
        ? estadoEncontrado.cidades.map((c: string) => ({ label: c, value: c }))
        : []
    );
  };

  const openImagePickerAsync = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) return alert("Permissão negada!");
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) {
      const asset = result.assets[0];
      setImage({
        uri: asset.uri,
        name: asset.fileName || `imagem.${asset.uri.split(".").pop()}`,
        type: `image/${asset.uri.split(".").pop()}`,
      });
    }
  };

  const handleSave = async () => {
    if (isSaving) return;

    if (!titulo.trim() || !esporte || !estado || !cidade) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    setIsSaving(true);

    try {
      const localizacao = `${cidade} - ${estado}`;

      const hive = {
        titulo,
        descricao,
        esporte_nome: esporte,
        data_hora_str: date,
        localizacao,
        endereco: endereco || localizacao,
        max_participantes: maxParticipantes,
        privado,
        observacoes,
        arquivo_foto: image,
      };

      const result = await AdicionarHive(hive);

      if (!result) {
        alert("Erro ao criar Hive.");
        return;
      }

      alert("Hive criada com sucesso!");
      onSave();
      onClose();
    } catch (error) {
      console.log(error)
      alert("Falha ao criar Hive.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View className="bg-neutral-900 py-safe p-6 flex-1">
        <View className="flex-1">
          <Text className="text-2xl font-bold text-center mt-4 mb-6 text-white">
            Nova Hive
          </Text>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            className="flex-1"
          >
            <ScrollView
              contentContainerStyle={{ paddingBottom: 20 }}
              showsVerticalScrollIndicator={false}
            >
              <Text className="text-gray-300 mb-1 text-xl">Título</Text>
              <TextInput
                className="text-xl p-4 border border-neutral-600 rounded-xl text-white mb-4"
                value={titulo}
                onChangeText={setTitulo}
                placeholder="Digite o título"
                placeholderTextColor="#888"
              />

              <Text className="text-gray-300 mb-1 text-xl">Esporte</Text>
              <CustomDropdown
                data={[
                  { label: "Futebol", value: "Futebol" },
                  { label: "Basquete", value: "Basquete" },
                  { label: "Vôlei", value: "Vôlei" },
                ]}
                value={esporte}
                placeholder="Selecione um esporte"
                onChange={(val) => setEsporte(val)}
              />

              <Text className="text-gray-300 mb-1 text-xl">Descrição</Text>
              <TextInput
                className="text-xl p-4 border border-neutral-600 rounded-xl text-white mb-4"
                placeholder="Descrição da Hive"
                placeholderTextColor="#888"
                multiline
                value={descricao}
                onChangeText={setDescricao}
              />

              <Text className="text-gray-300 mb-1 text-xl">Estado</Text>
              <CustomDropdown
                data={estados}
                value={estado}
                placeholder="Selecione um estado"
                onChange={handleEstadoChange}
              />

              <Text className="text-gray-300 mb-1 text-xl">Cidade</Text>
              <CustomDropdown
                data={cidades}
                value={cidade}
                placeholder="Selecione uma cidade"
                onChange={setCidade}
                disabled={!estado}
              />

              <Text className="text-gray-300 mb-1 text-xl">Endereço</Text>
              <TextInput
                className="text-xl p-4 border border-neutral-600 rounded-xl text-white mb-4"
                placeholder="Rua, número..."
                placeholderTextColor="#888"
                value={endereco}
                onChangeText={setEndereco}
              />

              <Text className="text-gray-300 mb-1 text-xl">Data e Hora</Text>
              <View className="flex-row justify-around mb-4">
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="default"
                  onChange={(_, d) => d && setDate(d)}
                />
                <DateTimePicker
                  value={date}
                  mode="time"
                  display="default"
                  is24Hour
                  onChange={(_, d) => d && setDate(d)}
                />
              </View>

              <Text className="text-gray-300 mb-1 text-xl">Máx. Participantes</Text>
              <TextInput
                className="text-xl p-4 border border-neutral-600 rounded-xl text-white mb-4"
                value={maxParticipantes.toString()}
                onChangeText={(t) => setMaxParticipantes(Number(t))}
                keyboardType="numeric"
                placeholder="Ex: 10"
                placeholderTextColor="#888"
              />

              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-gray-300 text-xl">Privado?</Text>
                <Switch value={privado} onValueChange={setPrivado} />
              </View>

              <Text className="text-gray-300 mb-1 text-xl">Observações</Text>
              <TextInput
                className="text-xl p-4 border border-neutral-600 rounded-xl text-white mb-4"
                placeholder="Observações adicionais"
                placeholderTextColor="#888"
                multiline
                value={observacoes}
                onChangeText={setObservacoes}
              />

              <View className="items-center justify-center mb-6">
                {!image ? (
                  <TouchableOpacity
                    className="flex-row items-center justify-center"
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
                      source={{ uri: image.uri }}
                      style={{ width: 100, height: 100, borderRadius: 8 }}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                )}
              </View>

              <TouchableOpacity
                className={`rounded-xl p-4 ${isSaving ? "bg-gray-500" : "bg-yellow-500"}`}
                onPress={handleSave}
                disabled={isSaving}
              >
                <Text className="text-center text-xl font-semibold text-black">
                  {isSaving ? "Salvando..." : "Salvar Hive"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity className="rounded-xl p-4 mt-4" onPress={onClose}>
                <Text className="text-center text-xl font-semibold text-white">
                  Cancelar
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </View>
    </Modal>
  );
};

export default HiveCreationModal;
