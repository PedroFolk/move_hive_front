import {
  SafeAreaView,
  View,
  Text,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import TextField from "~/core/componentes/TextFields";

import { colors } from "../../../core/styles/styles";
  import "../../../../global.css";
import { router } from "expo-router";
import { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { RegistrarUsuario } from "~/features/auth/api/auth";

export default function PosRegister() {
  const params = useLocalSearchParams();
  const { nome, apelido, dataNascimento } = params;

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCadastro = async () => {
    if (senha !== confirmarSenha) {
      alert("Senhas não coincidem");
      return;
    }

    try {
      setLoading(true);
      const result = await RegistrarUsuario(
        nome as string,
        apelido as string,
        dataNascimento as string,
        email,
        senha,
      );

      if (result) {
        router.push({ pathname: "../main", params: { novoCadastro: "true" } });
      } else {
        alert("Erro ao registrar usuário");
      }
    } catch (error) {
      alert("Erro inesperado");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className={`flex-1 ${colors.background}`}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              paddingHorizontal: 24,
            }}
            keyboardShouldPersistTaps="handled"
          >
            <View
              className={`w-full max-w-md rounded-2xl ${colors.background} self-center p-6`}
            >
              <Image
                source={require("~/core/assets/images/logoMoveHive_sem_fundo_cor_branco.png")}
                resizeMode="center"
                className="rounded-full w-48 h-48 justify-center m-auto "
              />

              <TextField
                marginTop="0"
                label="E-mail"
                value={email}
                onChangeText={setEmail}
                placeholder="Digite seu E-mail"
                keyboardType="email-address"
              />

              <TextField
                marginTop="10"
                label="Senha"
                value={senha}
                onChangeText={setSenha}
                placeholder="Digite sua senha"
                isPassword={true}
                keyboardType="default"
              />

              <TextField
                marginTop="5"
                label="Confirmar senha"
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
                isPassword={true}
                placeholder="Confirme sua senha"
                keyboardType="default"
              />

              <TouchableOpacity
                onPress={handleCadastro}
                disabled={loading}
                className={`mt-10 rounded-2xl p-3 ${
                  loading ? "bg-gray-500" : colors.button
                }`}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text
                    className={`text-center text-xl font-bold ${colors.textSecondaryButton}`}
                  >
                    Cadastrar-se
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push("../login")}
                disabled={loading}
                className={`mt-5 rounded-2xl border-2 ${colors.border} p-3`}
              >
                <Text className="text-center text-xl font-bold text-white">
                  Voltar
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
