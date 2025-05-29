import {
  SafeAreaView,
  View,
  Text,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import TextField from "../components/fields";
import { colors } from "../styles/styles";
import "../../../global.css";
import { router } from "expo-router";

export default function PosRegister() {
  return (
    <SafeAreaView className={`flex-1  ${colors.background}`}>
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
              value={""}
              onChangeText={() => {}}
              placeholder="Digite seu Nome"
              keyboardType="default"
            />

            <TextField
              marginTop="10"
              label="Apelido"
              value={""}
              onChangeText={() => {}}
              placeholder="@Apelido"
              keyboardType="default"
            />
            <TextField
              marginTop="10"
              label="Esporte Favorito"
              value={""}
              onChangeText={() => {}}
              placeholder="Esporte Favorito"
              keyboardType="default"
            />

            <TouchableOpacity
              className={`mt-10 rounded-2xl ${colors.button} p-3`}
            >
              <Text
                className={`text-center text-xl font-bold ${colors.textSecondaryButton}`}
              >
                Cadastrar-se
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("../login")}
              className={`mt-5 rounded-2xl border-2 ${colors.border} p-3`}
            >
              <Text className="text-center text-xl font-bold text-white">
                Voltar
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
