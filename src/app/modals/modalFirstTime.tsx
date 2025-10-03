import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Image,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Dropdown } from "react-native-element-dropdown";
import ufCidadeJson from "../uf_cidade.json";
import * as ImagePicker from "expo-image-picker";
import { ListarEsportes } from "~/api/getSports";

type ModalFirstTimeProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: SubmitData) => Promise<void>;
};

type SubmitData = {
  biografia: string;
  cidade: string;
  estado: string;
  esportes_praticados: Record<string, "iniciante" | "amador" | "profissional">;
  arquivo_foto?: any | null;
};

const niveis = ["iniciante", "amador", "profissional"] as const;

function getIconComponent(type: string) {
  const map: Record<string, any> = {
    Entypo,
    FontAwesome5,
    FontAwesome,
    FontAwesome6,
    Ionicons,
    MaterialCommunityIcons,
  };
  return map[type] || AntDesign;
}

type EsporteAPI = {
  label: string;
  value: string;
  foto?: string | null;
};

export default function ModalFirstTime({ visible, onClose, onSubmit }: ModalFirstTimeProps) {
  const [step, setStep] = useState(1);
  const [estado, setEstado] = useState("");
  const [cidade, setCidade] = useState("");
  const [estados, setEstados] = useState<{ label: string; value: string }[]>([]);
  const [cidades, setCidades] = useState<{ label: string; value: string }[]>([]);
  const [descricao, setDescricao] = useState("");
  const [esportes, setEsportes] = useState<Record<string, "iniciante" | "amador" | "profissional">>({});
  const [foto, setFoto] = useState<any | null>(null);
  const [esportesAPI, setEsportesAPI] = useState<EsporteAPI[]>([]);

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

  useEffect(() => {
    const carregarEsportes = async () => {
      const data = await ListarEsportes();
      const sorted = data.sort((a: EsporteAPI, b: EsporteAPI) =>
        a.label.localeCompare(b.label, "pt", { sensitivity: "base" })
      );
      setEsportesAPI(sorted);
      console.log("Esportes da API:", sorted); // debug
    };
    if (visible) carregarEsportes();
  }, [visible]);

  const escolherFoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setFoto({
        uri: asset.uri,
        type: asset.type === "image" ? "image/jpeg" : asset.type,
        name: asset.fileName || "foto.jpg",
      });
    }
  };

  const handleEstadoChange = (ufSigla: string) => {
    setEstado(ufSigla);
    setCidade("");
    const estadoEncontrado = ufCidadeJson.estados.find((e: any) => e.sigla === ufSigla);
    setCidades(
      estadoEncontrado ? estadoEncontrado.cidades.map((c: string) => ({ label: c, value: c })) : []
    );
  };

  const toggleEsporte = (key: string) => {
    setEsportes((prev) =>
      prev[key]
        ? Object.fromEntries(Object.entries(prev).filter(([k]) => k !== key))
        : { ...prev, [key]: "iniciante" }
    );
  };

  const changeNivel = (key: string) => {
    if (!esportes[key]) return;
    const nextIndex = (niveis.indexOf(esportes[key]) + 1) % niveis.length;
    setEsportes({ ...esportes, [key]: niveis[nextIndex] });
  };

  const handleFinalSubmit = async () => {
    Keyboard.dismiss();
    await onSubmit({
      biografia: descricao,
      cidade,
      estado,
      esportes_praticados: esportes,
      arquivo_foto: foto,
    });
    onClose();
    setStep(1);
    setEsportes({});
    setDescricao("");
    setCidade("");
    setEstado("");
    setFoto(null);
  };
  return (
    <Modal visible={visible} transparent animationType="slide" >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="bg-neutral-800 rounded-lg p-6 flex-1 justify-between h-full">
          <SafeAreaView className="flex-1">

            {step === 1 ? (
              <>
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
                  <Text className="text-white text-2xl text-center font-bold mt-10">
                    Selecione 
                  </Text>
                   <Text className="text-white text-2xl text-center font-bold mb-20 mt-4">
                    esportes e níveis
                  </Text>
                  <ScrollView className="mb-4" >
                    <View className="flex flex-row flex-wrap justify-between">
                      {esportesAPI.map(({ value, label, foto: esporteFoto }) => {
                        const nivel = esportes[value];
                        return (
                          <TouchableOpacity
                            key={value}
                            className={`basis-[48%] mb-4 border rounded-2xl p-3 items-center ${nivel ? "border-blue-500 bg-blue-900" : "border-gray-700"
                              }`}
                            onPress={() => toggleEsporte(value)}
                            activeOpacity={0.8}
                          >
                            <View className="w-16 h-16 bg-gray-700 mb-2 justify-center items-center rounded-xl overflow-hidden">
                              {esporteFoto ? (
                                <Image
                                  source={{ uri: esporteFoto }}
                                  style={{ width: 64, height: 64 }}
                                  resizeMode="cover"
                                />
                              ) : (
                                <Text className="text-white font-bold text-lg">{label[0]}</Text>
                              )}
                            </View>

                            <Text className="text-white text-lg font-semibold">{label}</Text>

                            {nivel && (
                              <TouchableOpacity
                                onPress={() => changeNivel(value)}
                                className={`mt-2 px-6 py-2 rounded-lg ${nivel === "iniciante"
                                  ? "bg-green-600"
                                  : nivel === "amador"
                                    ? "bg-yellow-500"
                                    : "bg-red-600"
                                  }`}
                                activeOpacity={0.7}
                              >
                                <Text className="text-white font-bold capitalize">{nivel}</Text>
                              </TouchableOpacity>
                            )}
                          </TouchableOpacity>
                        );
                      })}
                    </View>

                  </ScrollView>
                </KeyboardAvoidingView>

                <TouchableOpacity
                  className={`rounded-xl p-4 mb-4 ${Object.keys(esportes).length === 0
                    ? "bg-transparent border-white border-2"
                    : "bg-yellow-500 border-yellow-500"
                    } mt-auto`}
                  onPress={() => setStep(2)}
                  disabled={Object.keys(esportes).length === 0}
                >
                  <Text
                    className={`text-center text-xl font-semibold ${Object.keys(esportes).length === 0 ? "text-white" : "text-black"
                      }`}
                  >
                    Continuar
                  </Text>
                </TouchableOpacity>
              </>
            ) : step === 2 ? (

              <>
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
                  <View className="flex-1">
                    <Text className="text-white text-2xl text-center mt-10 font-bold mb-10">
                      Localidade
                    </Text>

                    <Text className="text-gray-300 mb-1 text-xl">Estado</Text>
                    <Dropdown
                      data={estados}
                      labelField="label"
                      valueField="value"
                      placeholder="Selecione um estado"
                      value={estado}
                      search
                      searchPlaceholder="Buscar cidade..."
                      inputSearchStyle={{ borderRadius: 12, color: "white" }}
                      onChange={(item) => handleEstadoChange(item.value)}
                      style={{
                        backgroundColor: "transparent",
                        borderRadius: 12,
                        paddingHorizontal: 12,
                        height: 50,
                        marginBottom: 20,
                        borderColor: "#4b5563",
                        borderWidth: 1,
                      }}
                      containerStyle={{ backgroundColor: "#404040", borderRadius: 12 }}
                      itemTextStyle={{ textAlign: "center", color: "white" }}
                      placeholderStyle={{ color: "#888", fontSize: 16 }}
                      selectedTextStyle={{ color: "white", fontSize: 16 }}
                    />

                    <Text className="text-gray-300 mb-1 text-xl">Cidade</Text>
                    <Dropdown
                      data={cidades}
                      labelField="label"
                      valueField="value"
                      placeholder="Selecione uma cidade"
                      value={cidade}
                      onChange={(item) => setCidade(item.value)}
                      disable={!estado}
                      search
                      searchPlaceholder="Buscar cidade..."
                      inputSearchStyle={{ borderRadius: 12, color: "white" }}
                      style={{
                        backgroundColor: "transparent",
                        borderRadius: 12,
                        paddingHorizontal: 12,
                        height: 50,
                        marginBottom: 20,
                        borderColor: "#4b5563",
                        borderWidth: 1,
                      }}
                      containerStyle={{ backgroundColor: "#404040", borderRadius: 12 }}
                      itemTextStyle={{ textAlign: "center", color: "white" }}
                      placeholderStyle={{ color: "#888", fontSize: 16 }}
                      selectedTextStyle={{ color: "white", fontSize: 16 }}
                    />
                  </View>
                </KeyboardAvoidingView>

                <View className="absolute bottom-2 w-full">
                  <TouchableOpacity
                    onPress={() => setStep(1)}
                    className="py-3 px-5 border border-gray-600 rounded-xl mb-4"
                  >
                    <Text className="text-white text-center text-xl">Voltar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setStep(3)}
                    className={`py-3 px-5 rounded-xl border-2 mb-4 ${!cidade || !estado ? "bg-transparent border-white" : "bg-yellow-500"
                      }`}
                    disabled={!cidade || !estado}
                  >
                    <Text
                      className={`text-xl text-center ${!cidade || !estado ? "text-white" : "text-black"
                        }`}
                    >
                      Continuar
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (

              <>
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
                  <Text className="text-white text-2xl text-center mt-10 font-bold mb-6">
                    Gostaria de colocar uma foto e biografia agora?
                  </Text>

                  <TouchableOpacity
                    onPress={escolherFoto}
                    className="bg-gray-700 rounded-xl p-4 mb-4 items-center"
                  >
                    {foto ? (
                      <Image source={{ uri: foto.uri }} className="w-24 h-24 rounded-full" />
                    ) : (
                      <Text className="text-white">Selecionar Foto</Text>
                    )}
                  </TouchableOpacity>

                  <Text className="text-gray-300 mb-2 text-xl">Biografia</Text>
                  <TextInput
                    value={descricao}
                    onChangeText={setDescricao}
                    placeholder="Escreva algo sobre você..."
                    placeholderTextColor="#888"
                    multiline
                    className="border border-gray-600 rounded-xl p-3 text-white h-28"
                  />
                </KeyboardAvoidingView>

                <View className="absolute bottom-2 w-full">
                  <TouchableOpacity
                    onPress={() => setStep(2)}
                    className="py-3 px-5 border border-gray-600 rounded-xl mb-4"
                  >
                    <Text className="text-white text-center text-xl">Voltar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleFinalSubmit}
                    className="py-3 px-5 rounded-xl bg-yellow-500 mb-4"
                  >
                    <Text className="text-black text-xl text-center">Enviar</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </SafeAreaView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
