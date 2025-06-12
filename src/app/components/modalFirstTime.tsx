import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome from "@expo/vector-icons/FontAwesome";

type ModalFirstTimeProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: SubmitData) => Promise<void>;
};

type SubmitData = {
  biografia: string;
  cidade: string;
  estado: string;
  esportes_praticados: {
    [key: string]: "iniciante" | "amador" | "profissional";
  };
};

const esportesList: {
  key: string;
  label: string;
  iconType: string;
  iconName: string;
}[] = [
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

function getIconComponent(type: string) {
  switch (type) {
    case "Entypo":
      return Entypo;
    case "FontAwesome5":
      return FontAwesome5;
    case "FontAwesome":
      return FontAwesome;
    case "FontAwesome6":
      return FontAwesome6;
    case "Ionicons":
      return Ionicons;
    case "MaterialCommunityIcons":
      return MaterialCommunityIcons;
    default:
      return AntDesign;
  }
}

const niveis: ("iniciante" | "amador" | "profissional")[] = [
  "iniciante",
  "amador",
  "profissional",
];

export default function ModalFirstTime({
  visible,
  onClose,
  onSubmit,
}: ModalFirstTimeProps) {
  const [step, setStep] = useState<number>(1);

  const [estado, setEstado] = useState<string>("");
  const [cidade, setCidade] = useState<string>("");
  const [descricao, setDescricao] = useState<string>("");

  const [esportes, setEsportes] = useState<{
    [key: string]: "iniciante" | "amador" | "profissional";
  }>({});

  function toggleEsporte(key: string) {
    if (esportes[key]) {
      const copy = { ...esportes };
      delete copy[key];
      setEsportes(copy);
    } else {
      setEsportes({ ...esportes, [key]: "iniciante" });
    }
  }

  function changeNivel(key: string) {
    if (!esportes[key]) return;
    const currentIndex = niveis.indexOf(esportes[key]);
    const nextIndex = (currentIndex + 1) % niveis.length;
    setEsportes({ ...esportes, [key]: niveis[nextIndex] });
  }

  async function handleFinalSubmit() {
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
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-center items-center bg-neutral-900 bg-opacity-95 px-4"
      >
        <View className="bg-neutral-800 rounded-lg p-6 w-full max-w-md">
          {step === 1 && (
            <>
              <Text className="text-white text-xl font-bold mb-4">
                Primeiro Passo
              </Text>

              <Text className="text-gray-300 mb-1">Estado</Text>
              <TextInput
                className="border border-gray-600 rounded mb-4 px-2 py-2 text-white"
                placeholder="Digite seu estado"
                placeholderTextColor="#888"
                value={estado}
                onChangeText={setEstado}
                autoCapitalize="characters"
                maxLength={2}
              />

              <Text className="text-gray-300 mb-1">Cidade</Text>
              <TextInput
                className="border border-gray-600 rounded mb-4 px-2 py-2 text-white"
                placeholder="Digite sua cidade"
                placeholderTextColor="#888"
                value={cidade}
                onChangeText={setCidade}
              />

              <Text className="text-gray-300 mb-1">Descrição</Text>
              <TextInput
                multiline
                className="border border-gray-600 rounded h-20 p-2 mb-4 text-white"
                placeholder="Digite uma breve descrição"
                placeholderTextColor="#888"
                value={descricao}
                onChangeText={setDescricao}
              />

              <TouchableOpacity
                className={`rounded py-3 ${
                  !cidade || !estado
                    ? "bg-transparent border-white border-2"
                    : "bg-yellow-500 border-none"
                }`}
                onPress={() => setStep(2)}
                disabled={!cidade || !estado}
              >
                <Text
                  className={` text-center font-semibold ${
                    !cidade || !estado ? "text-white" : "text-black"
                  }`}
                >
                  Continuar
                </Text>
              </TouchableOpacity>
            </>
          )}

          {step === 2 && (
            <>
              <Text className="text-white text-xl font-bold mb-4">
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

              <View className="flex-row justify-between mt-4">
                <TouchableOpacity
                  onPress={() => setStep(1)}
                  className="py-3 px-5 border border-gray-600 rounded"
                >
                  <Text className="text-white">Voltar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleFinalSubmit}
                  className={`py-3 px-5 rounded border-2  ${
                    Object.keys(esportes).length === 0
                      ? "bg-transparent border-white"
                      : "bg-yellow-500 border-none"
                  }`}
                  disabled={Object.keys(esportes).length === 0}
                >
                  <Text
                    className={`${
                      Object.keys(esportes).length === 0
                        ? "text-white"
                        : "text-blacl"
                    }`}
                  >
                    Enviar
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
