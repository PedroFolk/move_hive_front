import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import TextField from "../../components/fields";
import { colors } from "~/styles/styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { EsqueciSenha, ResetarSenha, VerificarCodigo } from "~/api/auth";

type Step = "email" | "token" | "newpass";

export default function ForgotPassword() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");

  const validatePasswordStrength = (password: string) => {
    if (password.length < 8) return "Muito curta";
    if (!/[A-Z]/.test(password)) return "Precisa de uma letra maiúscula";
    if (!/[a-z]/.test(password)) return "Precisa de uma letra minúscula";
    if (!/\d/.test(password)) return "Precisa de um número";
    if (!/[@$!%*?&]/.test(password)) return "Precisa de um caractere especial";
    return "Forte";
  };

  const handlePasswordChange = (text: string) => {
    setNewPass(text);
    setPasswordStrength(validatePasswordStrength(text));
  };

  const handleCancel = () => router.replace("../login");

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email.toLowerCase());
  };

  const handleSendCode = async () => {
    if (!email) {
      Alert.alert("Atenção", "Digite seu e-mail.");
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert("Atenção", "Digite um e-mail válido.");
      return;
    }

    try {
      setLoading(true);
      setSent(false);

      await EsqueciSenha(email);
      setStep("token");
      setSent(true);
    } catch (error) {
      Alert.alert(
        "Erro",
        "Não foi possível enviar o código. Verifique o e-mail."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyToken = async () => {
    if (!token) {
      Alert.alert("Atenção", "Digite o código recebido.");
      return;
    }
    if (token.length < 1) {
      Alert.alert("Atenção", "Código inválido.");
      return;
    }

    try {
      setLoading(true);
      setSent(false);

      await VerificarCodigo(email, token);
      setStep("newpass");
      setSent(true);
    } catch (error) {
      Alert.alert("Erro", "Código inválido ou expirado.");
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = (password: string) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleChangePassword = async () => {
    if (!newPass || !confirmPass) {
      Alert.alert("Atenção", "Digite e confirme sua nova senha.");
      return;
    }

    if (newPass !== confirmPass) {
      Alert.alert("Atenção", "As senhas não conferem.");
      return;
    }

    if (!validatePassword(newPass)) {
      Alert.alert(
        "Senha inválida",
        "A senha deve ter no mínimo 8 caracteres, incluindo letra maiúscula, minúscula, número e caractere especial."
      );
      return;
    }

    try {
      setLoading(true);
      setSent(false);

      await ResetarSenha(email, token, newPass);

      Alert.alert("Sucesso", "Sua senha foi alterada com sucesso!", [
        { text: "OK", onPress: () => router.replace("../login") },
      ]);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível alterar a senha.");
    } finally {
      setLoading(false);
      setSent(true);
    }
  };

  const renderButton = (onPress: () => void, text: string) => (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      className={`mt-10 rounded-2xl ${colors.button} p-3 ${
        loading ? "opacity-50" : ""
      }`}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text
          className={`text-center text-xl font-bold ${colors.textSecondaryButton}`}
        >
          {text}
        </Text>
      )}
    </TouchableOpacity>
  );

  const renderCancel = () => (
    <TouchableOpacity className="rounded-xl p-4 mt-4" onPress={handleCancel}>
      <Text className="text-center text-xl font-semibold text-white">
        Cancelar
      </Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 items-center justify-center bg-neutral-800 px-6">
      <SafeAreaView className="w-full h-full px-6">
        <View>
          <Text className="text-2xl font-bold mt-4 text-center text-white mb-12">
            Esqueceu a senha?
          </Text>

          {step === "email" && (
            <>
              <Text className="text-lg mt-4 text-center text-white mb-8">
                Enviaremos um código para o seu e-mail para resetar a senha
              </Text>
              <TextField
                label="Digite seu e-mail"
                value={email}
                onChangeText={setEmail}
                placeholder="Email@email.com"
                keyboardType="email-address"
                marginTop={"10"}
              />
              {renderButton(handleSendCode, "Enviar código")}
            </>
          )}

          {step === "token" && (
            <>
              {sent && !loading && (
                <Text className="text-green-400 text-center mt-6 font-medium">
                  Código enviado!
                </Text>
              )}
              <TextField
                label="Seu e-mail"
                value={email}
                onChangeText={setEmail}
                placeholder="Email@email.com"
                keyboardType="email-address"
                disabled
                marginTop={"10"}
              />
              <TextField
                label="Digite o código recebido"
                value={token}
                onChangeText={setToken}
                placeholder="xxxxx"
                keyboardType="default"
                marginTop={"10"}
              />
              {renderButton(handleVerifyToken, "Seguinte")}
            </>
          )}

          {step === "newpass" && (
            <>
              <TextField
                label="Digite sua nova senha"
                value={newPass}
                onChangeText={handlePasswordChange}
                placeholder="******"
                keyboardType="default"
                isPassword
                marginTop={"10"}
              />
              {passwordStrength ? (
                <Text
                  className={`mt-2 text-sm ml-2 ${
                    passwordStrength === "Forte"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {passwordStrength}
                </Text>
              ) : null}
              <TextField
                label="Cofirme sua nova senha"
                value={confirmPass}
                onChangeText={setConfirmPass}
                placeholder="******"
                keyboardType="default"
                marginTop={"10"}
                isPassword
              />
              {renderButton(handleChangePassword, "Alterar a senha")}
            </>
          )}

          {renderCancel()}
        </View>
      </SafeAreaView>
    </View>
  );
}
