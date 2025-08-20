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
} from "react-native";
import TextField from "../components/fields";
import { colors } from "../../styles/styles";
import "../../../global.css";
import { router } from "expo-router";
import { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { RegistrarUsuario } from "~/api/auth";

export default function PosRegister() {
  const params = useLocalSearchParams();
  const { nome, apelido, dataNascimento } = params;

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const handleCadastro = async () => {
    if (senha !== confirmarSenha) {
      alert("Senhas não coincidem");
      return;
    }

    const result = await RegistrarUsuario(
      nome as string,
      apelido as string,
      dataNascimento as string,
      email,
      senha,
    );

    if (result) {
      //alert("Usuário registrado com sucesso!");
      router.push({ pathname: "../main", params: { novoCadastro: "true" } });
    } else {
      alert("Erro ao registrar usuário");
    }
  };

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
            <Image
              source={require("../../images/logoMoveHive_sem_fundo_cor_branco.png")}
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
              keyboardType="visible-password"
            />
            <TextField
              marginTop="5"
              label="Confirmar senha"
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              isPassword={true}
              placeholder="Cofirme sua senha"
              keyboardType="visible-password"
            />

            <TouchableOpacity
              onPress={handleCadastro}
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
