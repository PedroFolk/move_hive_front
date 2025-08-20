import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
import "../../../global.css";
import TextField from "../components/fields"; // Ajuste o caminho conforme necessário
import { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Linking,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  Image,
} from "react-native";
import { colors } from "../../styles/styles";
import { LogarUsuario } from "~/api/auth";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const result = await LogarUsuario(email, password);

    if (result) {
      router.push({ pathname: "../main", params: { novoCadastro: "false" } });
    } else {
      Alert.alert("Erro ao fazer login", "Usuário e/ou senha incorretos");
    }
  };

  return (
    <SafeAreaView className={`flex-1 ${colors.background}  `}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1 justify-center px-6"
        >
          <View
            className={`w-full max-w-md rounded-2xl ${colors.background} self-center p-6`}
          >


            <Image
              source={require("../../images/logoMoveHive_sem_fundo_cor_branco.png")}
              resizeMode="center"
              className="rounded-full w-48 h-48 justify-center m-auto "
            />

            <TextField
              label="E-mail"
              value={email}
              onChangeText={setEmail}
              placeholder="E-mail"
              keyboardType="email-address"
              marginTop={"0"}
            />
            <TextField
              label="Senha"
              isPassword
              value={password}
              onChangeText={setPassword}
              placeholder="Digite sua senha"
              keyboardType="default"
              marginTop={"10"}
            />

            <TouchableOpacity
              onPress={() => Linking.openURL("https://www.google.com")}
            >
              <Text className="mt-2 text-white">Esqueceu sua senha?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleLogin}
              className={`mt-10 rounded-2xl ${colors.button} p-3`}
            >
              <Text
                className={`text-center text-xl font-bold ${colors.textSecondaryButton}`}
              >
                Entrar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("../register")}
              className={`mt-5 rounded-2xl border-2 ${colors.border} p-3`}
            >
              <Text
                className={`text-center text-xl font-bold ${colors.textPrimaryButton} `}
              >
                Cadastrar-se
              </Text>
            </TouchableOpacity>

            <View className="mt-10 flex flex-row items-center gap-5">
              <View
                className={`h-1 flex-1 rounded-full ${colors.separator} `}
              />
              <Text className="text-2xl text-white ">ou</Text>
              <View className={`h-1 flex-1 rounded-full ${colors.separator}`} />
            </View>

            <TouchableOpacity
              className={`mt-10 flex flex-row items-center gap-5 rounded-2xl bg-neutral-600 p-2 `}
            >
              <AntDesign name="google" size={48} color="white" />
              <Text className=" text-2xl font-bold text-white">
                Entrar com Google
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
