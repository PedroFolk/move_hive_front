import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import ufCidadeJson from "../../../core/data/uf_cidade.json";
import { ListarEsportes } from "~/core/api/getSports";
import CustomDropdown from "../../../core/componentes/customDropdown";

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
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
      try {
        const data = await ListarEsportes();
        const sorted = data.sort((a: EsporteAPI, b: EsporteAPI) =>
          a.label.localeCompare(b.label, "pt", { sensitivity: "base" })
        );
        setEsportesAPI(sorted);
      } catch (error) {
        Alert.alert("Erro", "Não foi possível carregar os esportes. Tente novamente.");
      }
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
    setLoading(true);

    try {
      await onSubmit({
        biografia: descricao,
        cidade,
        estado,
        esportes_praticados: esportes,
        arquivo_foto: foto,
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
        setStep(1);
        setEsportes({});
        setDescricao("");
        setCidade("");
        setEstado("");
        setFoto(null);
      }, 1200);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível enviar os dados. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="bg-neutral-800 rounded-lg p-6 flex-1 justify-between h-full">
          <View className="flex-1 py-safe">
            
            {step === 1 && (
              <>
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
                  <Text className="text-white text-2xl text-center font-bold mt-10">Selecione os esportes</Text>
                  <ScrollView className="mb-4">
                    <View className="flex flex-row flex-wrap justify-between">
                      {esportesAPI.map(({ value, label, foto: esporteFoto }) => {
                        const selecionado = esportes[value];
                        return (
                          <TouchableOpacity
                            key={value}
                            className={`basis-[48%] mb-4 border rounded-2xl p-3 items-center ${
                              selecionado ? "border-blue-500 bg-blue-900" : "border-gray-700"
                            }`}
                            onPress={() => toggleEsporte(value)}
                            activeOpacity={0.8}
                          >
                            <View className="w-16 h-16 bg-gray-700 mb-2 justify-center items-center rounded-xl overflow-hidden">
                              {esporteFoto ? (
                                <Image source={{ uri: esporteFoto }} style={{ width: 64, height: 64 }} resizeMode="cover" />
                              ) : (
                                <Text className="text-white font-bold text-lg">{label[0]}</Text>
                              )}
                            </View>
                            <Text className="text-white text-lg font-semibold">{label}</Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </ScrollView>
                </KeyboardAvoidingView>

                <TouchableOpacity
                  className={`rounded-xl p-4 mb-4 ${
                    Object.keys(esportes).length === 0 ? "bg-transparent border-white border-2" : "bg-yellow-500 border-yellow-500"
                  } mt-auto`}
                  onPress={() => setStep(2)}
                  disabled={Object.keys(esportes).length === 0}
                >
                  <Text
                    className={`text-center text-xl font-semibold ${
                      Object.keys(esportes).length === 0 ? "text-white" : "text-black"
                    }`}
                  >
                    Continuar
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {step === 2 && (
              <>
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
                  <Text className="text-white text-2xl text-center mt-10 font-bold mb-10">Escolha o nível de cada esporte</Text>
                  <ScrollView className="mb-4">
                    <View className="flex flex-col space-y-4">
                      {Object.keys(esportes).map((key) => {
                        const esporte = esportesAPI.find((e) => e.value === key);
                        if (!esporte) return null;
                        const nivel = esportes[key];
                        return (
                          <TouchableOpacity
                            key={key}
                            className="flex-row justify-between items-center bg-neutral-700 mb-4 p-4 rounded-xl"
                            onPress={() => changeNivel(key)}
                            activeOpacity={0.7}
                          >
                            <Text className="text-white text-lg">{esporte.label}</Text>
                            <Text
                              className={`px-4 py-1 rounded-lg font-bold ${
                                nivel === "iniciante" ? "bg-green-600" : nivel === "amador" ? "bg-yellow-500" : "bg-red-600"
                              } text-white`}
                            >
                              {nivel}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </ScrollView>
                </KeyboardAvoidingView>

                <View className="absolute bottom-2 w-full items-center">
                  <TouchableOpacity onPress={() => setStep(1)} className="py-3 px-5 border border-gray-600 rounded-xl mb-4 w-[90%]">
                    <Text className="text-white text-center text-xl">Voltar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => setStep(3)} className="py-3 px-5 rounded-xl bg-yellow-500 mb-4 w-[90%]">
                    <Text className="text-black text-xl text-center">Continuar</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {step === 3 && (
              <>
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
                  <View className="flex-1">
                    <Text className="text-white text-2xl text-center mt-10 font-bold mb-10">Localidade</Text>

                    <Text className="text-gray-300 mb-1 text-xl">Estado</Text>
                    <CustomDropdown data={estados} value={estado} placeholder="Selecione um estado" onChange={handleEstadoChange} />

                    <Text className="text-gray-300 mb-1 text-xl">Cidade</Text>
                    <CustomDropdown data={cidades} value={cidade} placeholder="Selecione uma cidade" onChange={setCidade} disabled={!estado} />
                  </View>
                </KeyboardAvoidingView>

                <View className="absolute bottom-2 w-full items-center">
                  <TouchableOpacity onPress={() => setStep(2)} className="py-3 px-5 border border-gray-600 rounded-xl mb-4 w-[90%]">
                    <Text className="text-white text-center text-xl">Voltar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setStep(4)}
                    className={`py-3 px-5 rounded-xl border-2 mb-4 w-[90%] ${!cidade || !estado ? "bg-transparent border-white" : "bg-yellow-500"}`}
                    disabled={!cidade || !estado}
                  >
                    <Text className={`text-xl text-center ${!cidade || !estado ? "text-white" : "text-black"}`}>Continuar</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {step === 4 && (
              <>
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
                  <Text className="text-white text-2xl text-center mt-10 font-bold mb-6">
                    Gostaria de colocar uma foto e biografia agora?
                  </Text>

                  <TouchableOpacity onPress={escolherFoto} className="bg-gray-700 rounded-xl p-4 mb-4 items-center">
                    {foto ? <Image source={{ uri: foto.uri }} className="w-24 h-24 rounded-full" /> : <Text className="text-white">Selecionar Foto</Text>}
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

                <View className="absolute bottom-2 w-full items-center">
                  <TouchableOpacity onPress={() => setStep(3)} className="py-3 px-5 border border-gray-600 rounded-xl mb-4 w-[90%]">
                    <Text className="text-white text-center text-xl">Voltar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleFinalSubmit}
                    className={`py-3 px-5 rounded-xl mb-4 w-[90%] items-center justify-center ${loading ? "bg-gray-600" : "bg-yellow-500"}`}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color="#000" />
                    ) : submitted ? (
                      <Text className="text-black text-xl text-center">✔️ Enviado</Text>
                    ) : (
                      <Text className="text-black text-xl text-center">Enviar</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
