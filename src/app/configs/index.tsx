import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
// Assumindo que essas APIs estão corretamente importadas
import { AtualizarUsuario, ListarDadosPerfil } from "~/api/user";
import TextField from "../../components/fields";
import * as SecureStore from "expo-secure-store";

// --- Função Auxiliar AtualizarPerfil (Mantida para Completude) ---
async function AtualizarPerfil(user: any, originalUser: any) {
  const camposParaComparar = [
    "username",
    "email",
    "data_nascimento",
    "nome_completo",
    "biografia",
    "estado",
    "cidade",
    "esportes_praticados",
  ];

  const payload: any = {};

  camposParaComparar.forEach(key => {
    if (typeof user[key] === 'object' && user[key] !== null && originalUser[key] !== null) {
      if (JSON.stringify(user[key]) !== JSON.stringify(originalUser[key])) {
        payload[key] = user[key];
      }
    } else if (user[key] !== originalUser[key]) {
      payload[key] = user[key];
    }
  });

  if (user.foto_perfil !== originalUser.foto_perfil) {
    if (user.foto_perfil) {
      if (typeof user.foto_perfil === "string" && user.foto_perfil.startsWith("file:")) {
        payload.foto_perfil = {
          uri: user.foto_perfil,
          name: "profile_photo.jpg",
          type: "image/jpeg",
        };
      } else {
        payload.foto_perfil = user.foto_perfil;
      }
    } else {
      payload.foto_perfil = null;
    }
  }

  if (Object.keys(payload).length === 0) {
    console.log("Nenhuma alteração detectada.");
    return true;
  }

  // Assumindo que AtualizarUsuario é uma função de API que retorna um booleano
  return await AtualizarUsuario(payload);
}
// -----------------------------------------------------------------

export default function Configuracoes() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [originalUser, setOriginalUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(false);

  const sair = async () => {
    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("userId");
    router.replace("/login");
  };

  const carregarPerfil = async () => {
    setLoading(true);
    const dados = await ListarDadosPerfil();
    if (dados) {
      setUser(dados);
      setOriginalUser(dados);
    }
    setLoading(false);
  };

  const alterarFoto = async () => {

    if (!editando) return;

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permissão Necessária", "É necessário permissão para acessar a galeria de fotos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled && result.assets[0].uri) {
      setUser({ ...user, foto_perfil: result.assets[0].uri });
    }
  };

  useEffect(() => {
    carregarPerfil();
  }, []);

  if (loading || !user) {
    return (
      <View className="flex-1 items-center justify-center bg-neutral-800">
        <Text className="text-white">Carregando...</Text>
      </View>
    );
  }

  const campos = [
    { label: "Nome Completo", key: "nome_completo", editable: true },
    { label: "Username", key: "username", editable: true },
    { label: "Data de Nascimento", key: "data_nascimento", editable: false },
    { label: "Email", key: "email", editable: true },
    { label: "Biografia", key: "biografia", editable: true },
    { label: "Cidade", key: "cidade", editable: true },
    { label: "Estado", key: "estado", editable: true },
  ];

  const cancelarEdicao = () => {
    // Reverte para os dados originais
    setUser(originalUser);
    setEditando(false);
  };

  const salvarEdicao = async () => {

    const resultado = await AtualizarPerfil(user, originalUser);

    if (resultado) {

      setOriginalUser(user);
      setEditando(false);
      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
    } else {
      Alert.alert("Erro", "Não foi possível atualizar o perfil. Verifique seus dados.");
    }
  };


  return (
    // SOLUÇÃO PARA O PROBLEMA DO TECLADO
    // Adiciona o import de Platform e usa o behavior adequado
    <KeyboardAvoidingView
      className="flex-1 bg-neutral-800"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      // Adiciona um offset para ajustar a posição, se necessário, especialmente no iOS
      keyboardVerticalOffset={0}
    >
      {/* Mantive a classe py-safe na SafeAreaView se você estiver usando-a no seu layout */}
      <SafeAreaView className="flex-1">
        <ScrollView contentContainerStyle={{ padding: 24 }} className="flex-1">

          <View className="flex-row justify-between items-center mb-8">
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-white text-2xl">←</Text>
            </TouchableOpacity>

            <View className="flex-row space-x-4">
              {editando ? (
                <>
                  <TouchableOpacity onPress={salvarEdicao} className="p-1">
                    <MaterialCommunityIcons name="check" size={28} color="#4CAF50" />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={cancelarEdicao} className="p-1">
                    <MaterialCommunityIcons name="close" size={28} color="#F44336" />
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity onPress={() => setEditando(true)} className="p-1">
                  <MaterialCommunityIcons name="pencil" size={28} color="white" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <Text className="text-3xl font-bold text-white w-full text-center mb-10">Configurações de Perfil</Text>


          <View className="mb-6 items-center relative">

            <TouchableOpacity
              onPress={alterarFoto}
              disabled={!editando}
              className="w-28 h-28 rounded-full mb-2 items-center justify-center"
            >
              {user.foto_perfil ? (
                <>
                  <Image
                    source={{ uri: user.foto_perfil }}
                    className="w-28 h-28 rounded-full"
                  />
                  {editando && (
                    <View className="absolute bottom-0 right-0 bg-yellow-500 p-1 rounded-full border-2 border-white">
                      <MaterialCommunityIcons name="pencil" size={20} color="black" />
                    </View>
                  )}
                </>
              ) : (
                <View className={`w-28 h-28 rounded-full items-center justify-center ${editando ? "border-2 border-yellow-500" : "border-2 border-white"}`}>
                  <Text className="text-white text-4xl font-bold">
                    {user.username?.[0].toUpperCase() ?? "U"}
                  </Text>
                  {editando && (
                    <View className="absolute bottom-0 right-0 bg-yellow-500 p-1 rounded-full border-2 border-white">
                      <MaterialCommunityIcons name="camera-plus" size={20} color="black" />
                    </View>
                  )}
                </View>
              )}
            </TouchableOpacity>
          </View>


          {campos.map(({ label, key, editable }) => (
            <View key={key} className="mb-6 flex-row justify-between items-center">
              <View className="flex-1">
                <TextField
                  marginTop="0"
                  value={user[key]}
                  onChangeText={(text: any) => setUser({ ...user, [key]: text })}
                  label={label}

                  disabled={!editable || !editando}
                />
              </View>
            </View>
          ))}

          {!editando ? (
            <View>

              <TouchableOpacity
                onPress={sair}
                className="bg-red-600 w-full py-4 rounded-2xl items-center mt-4"
              >
                <Text className="text-white font-semibold text-lg">Sair da Conta</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="flex-row w-full justify-between">
              {/* Conteúdo opcional para o modo de edição, como botões salvar/cancelar */}
            </View>
          )}


        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}