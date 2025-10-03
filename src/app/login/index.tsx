import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
import "../../../global.css";
import TextField from "../../components/fields";
import { useEffect, useState } from "react";
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
  ActivityIndicator,
} from "react-native";
import { colors } from "../../styles/styles";
import { LogarUsuario } from "~/api/auth";
import * as SecureStore from "expo-secure-store";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // estado de bloqueio

  const handleLogin = async () => {
    if (loading) return; // previne múltiplos cliques

    setLoading(true); // bloqueia o botão
    try {
      const result = await LogarUsuario(email, password);

      if (result) {
        router.push({ pathname: "../main", params: { novoCadastro: "false" } });
      } else {
        Alert.alert("Erro ao fazer login", "Usuário e/ou senha incorretos");
      }
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro ao tentar logar.");
    } finally {
      setLoading(false); // libera o botão após a resposta
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      await SecureStore.deleteItemAsync("token");
      await SecureStore.deleteItemAsync("userId");
    };
    checkAuth();
  }, []);

  return (
    <SafeAreaView className={`flex-1 ${colors.background}`}>
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
              className="rounded-full w-48 h-48 justify-center m-auto"
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
              onPress={() => router.replace("../forgetPassword")}
            >
              <Text className="mt-2 text-white">Esqueceu sua senha?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleLogin}
              disabled={loading} // bloqueia o botão enquanto loading = true
              className={`mt-10 rounded-2xl ${colors.button} p-3 ${
                loading ? "opacity-50" : ""
              }`}
            >
              {loading ? (
                <View className="flex-row justify-center items-center">
                  <ActivityIndicator size="small" color="#fff" className="mr-2" />
                  <Text
                    className={`text-center text-xl font-bold ${colors.textSecondaryButton}`}
                  >
                    Entrando...
                  </Text>
                </View>
              ) : (
                <Text
                  className={`text-center text-xl font-bold ${colors.textSecondaryButton}`}
                >
                  Entrar
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("../register")}
              className={`mt-5 rounded-2xl border-2 ${colors.border} p-3`}
            >
              <Text
                className={`text-center text-xl font-bold ${colors.textPrimaryButton}`}
              >
                Cadastrar-se
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
