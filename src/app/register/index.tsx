import { router } from "expo-router";
import "../../../global.css";
import { colors } from "../styles/styles.js";

import { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import TextField from "../components/fields";

const formatDate = (text: string) => {
  const cleaned = text.replace(/\D/g, "");

  let formatted = "";
  if (cleaned.length <= 2) {
    formatted = cleaned;
  } else if (cleaned.length <= 4) {
    formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
  } else {
    formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
  }

  return formatted;
};

const isValidDate = (dateStr: string) => {
  const [day, month, year] = dateStr.split("/").map(Number);

  if (!day || !month || !year || dateStr.length !== 10) return false;

  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
};

export default function RegisterPage() {
  const [apelido, setApelido] = useState("");
  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [valid, setValid] = useState(true);

  const handleRegister = () => {
    router.push({
      pathname: "../posRegister",
      params: {
        nome,
        apelido,
        dataNascimento,
      },
    });
  };

  const handleChange = (text: string) => {
    const formatted = formatDate(text);
    setDataNascimento(formatted);

    if (formatted.length === 10) {
      setValid(isValidDate(formatted));
    } else {
      setValid(true); // ainda está digitando
    }
  };

  return (
    <SafeAreaView className={`flex-1  ${colors.background} `}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1 justify-center px-6"
        >
          <View
            className={`w-full max-w-md rounded-2xl ${colors.background} self-center p-6`}
          >
            <Text className={`text-center text-5xl font-bold text-white`}>
              MOVE
            </Text>
            <Text
              className={`text-center text-5xl font-bold ${colors.primary}`}
            >
              HIVE
            </Text>
            <TextField
              marginTop="10"
              label="Nome"
              value={nome}
              onChangeText={setNome}
              placeholder="Digite seu nome completo"
              keyboardType="default"
            />
            <TextField
              marginTop="10"
              label="Usuario (@)"
              value={apelido}
              onChangeText={setApelido}
              placeholder="Digite seu apelido "
              keyboardType="default"
            />
            <TextField
              marginTop="10"
              label="Data de Nascimento"
              value={dataNascimento}
              onChangeText={handleChange}
              placeholder="dd/mm/yyyy"
              keyboardType="numeric"
            />

            <TouchableOpacity
              onPress={handleRegister}
              className={`mt-10 rounded-2xl ${colors.button} p-3`}
            >
              <Text
                className={`text-center text-xl font-bold ${colors.textSecondaryButton}`}
              >
                Proxima
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("../login")}
              className={`mt-5 rounded-2xl border-2 ${colors.border} p-3`}
            >
              <Text
                className={`text-center text-xl font-bold ${colors.textPrimaryButton} `}
              >
                Voltar
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
