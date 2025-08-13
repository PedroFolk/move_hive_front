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
};

const esportesList = [
  {
    key: "futebol",
    label: "Futebol",
    iconType: "FontAwesome5",
    iconName: "football-ball",
  },
  {
    key: "basquete",
    label: "Basquete",
    iconType: "FontAwesome5",
    iconName: "basketball-ball",
  },
  {
    key: "volei",
    label: "Vôlei",
    iconType: "MaterialCommunityIcons",
    iconName: "volleyball",
  },
  {
    key: "tenis",
    label: "Tênis",
    iconType: "FontAwesome5",
    iconName: "table-tennis",
  },
  {
    key: "natacao",
    label: "Natação",
    iconType: "FontAwesome5",
    iconName: "swimmer",
  },
  {
    key: "corrida",
    label: "Corrida",
    iconType: "FontAwesome5",
    iconName: "running",
  },
];

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

export default function ModalFirstTime({
  visible,
  onClose,
  onSubmit,
}: ModalFirstTimeProps) {
  const [step, setStep] = useState(1);
  const [estado, setEstado] = useState("");
  const [cidade, setCidade] = useState("");
  const [estados, setEstados] = useState<{ label: string; value: string }[]>(
    []
  );
  const [cidades, setCidades] = useState<{ label: string; value: string }[]>(
    []
  );
  const [descricao, setDescricao] = useState("");
  const [esportes, setEsportes] = useState<
    Record<string, "iniciante" | "amador" | "profissional">
  >({});

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
    await onSubmit({
      biografia: descricao,
      cidade,
      estado,
      esportes_praticados: esportes,
    });
    onClose();
    setStep(1);
    setEsportes({});
    setDescricao("");
    setCidade("");
    setEstado("");
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="bg-neutral-800 rounded-lg p-6 flex-1 justify-between">
        <SafeAreaView className="flex-1">
          {step === 1 ? (
            <>
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
              >
                <Text className="text-white text-2xl text-center font-bold mb-20 mt-10">
                  Selecione seus esportes
                </Text>
                <ScrollView style={{ maxHeight: 300 }}>
                  <View className="flex flex-row flex-wrap justify-between">
                    {esportesList.map(({ key, label, iconType, iconName }) => {
                      const IconComponent = getIconComponent(iconType);
                      return (
                        <TouchableOpacity
                          key={key}
                          className={`w-[30%] mb-4 border rounded p-2 items-center ${
                            esportes[key]
                              ? "border-blue-500 bg-blue-900"
                              : "border-gray-700"
                          }`}
                          onPress={() => toggleEsporte(key)}
                        >
                          <View className="w-16 h-16 bg-gray-700 mb-2 justify-center items-center rounded">
                            <IconComponent
                              name={iconName as any}
                              size={28}
                              color="white"
                            />
                          </View>
                          <Text className="text-white">{label}</Text>
                          {esportes[key] && (
                            <TouchableOpacity
                              onPress={() => changeNivel(key)}
                              className="mt-1 bg-blue-600 px-2 rounded"
                            >
                              <Text className="text-white text-xs">
                                {esportes[key]}
                              </Text>
                            </TouchableOpacity>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </ScrollView>
              </KeyboardAvoidingView>

              <TouchableOpacity
                className={`rounded-xl p-4 mb-4 ${
                  Object.keys(esportes).length === 0
                    ? "bg-transparent border-white border-2"
                    : "bg-yellow-500 border-yellow-500"
                } mt-auto`}
                onPress={() => setStep(2)}
                disabled={Object.keys(esportes).length === 0}
              >
                <Text
                  className={`text-center text-xl font-semibold ${
                    Object.keys(esportes).length === 0
                      ? "text-white"
                      : "text-black"
                  }`}
                >
                  Continuar
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
              >
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
                    containerStyle={{
                      backgroundColor: "#404040",
                      borderRadius: 12,
                    }}
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
                    containerStyle={{
                      backgroundColor: "#404040",
                      borderRadius: 12,
                    }}
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
                  onPress={handleFinalSubmit}
                  className={`py-3 px-5 rounded-xl border-2 mb-4 ${
                    !cidade || !estado
                      ? "bg-transparent border-white"
                      : "bg-yellow-500"
                  }`}
                  disabled={!cidade || !estado}
                >
                  <Text
                    className={`text-xl text-center ${
                      !cidade || !estado ? "text-white" : "text-black"
                    }`}
                  >
                    Enviar
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </SafeAreaView>
      </View>
    </Modal>
  );
}
