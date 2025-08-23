import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ListarDadosPerfil } from "~/api/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TextField from "../components/fields";

export default function Configuracoes() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [originalUser, setOriginalUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(false);

  const sair = async () => {
    await AsyncStorage.removeItem("token");
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
    if (!permission.granted) return;

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
    setUser(originalUser);
    setEditando(false);
  };

  const salvarEdicao = () => {
    // Placeholder: aqui seria a API para salvar
    setOriginalUser(user);
    setEditando(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-800">
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <View className="flex-row justify-between items-center mb-8">
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-white text-2xl">←</Text>
          </TouchableOpacity>
          <Text className="text-3xl font-bold text-white">Configurações de Perfil</Text>
        </View>

        <View className="mb-6 items-center relative">
          {user.foto_perfil ? (
            <TouchableOpacity onPress={alterarFoto}>
              <Image
                source={{ uri: user.foto_perfil }}
                className="w-28 h-28 rounded-full mb-2"
              />
              {editando && (
                <View className="absolute bottom-0 right-0 bg-yellow-500 p-1 rounded-full border border-white">
                  <MaterialCommunityIcons name="pencil" size={20} color="black" />
                </View>
              )}
            </TouchableOpacity>
          ) : (
            <View className="w-28 h-28 rounded-full border-2 border-white mb-2 items-center justify-center">
              <Text className="text-white text-4xl font-bold">
                {user.username?.[0].toUpperCase() ?? "U"}
              </Text>
            </View>
          )}
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
            {editable && editando && (
              <MaterialCommunityIcons name="pencil" size={20} color="white" className="ml-2" />
            )}
          </View>
        ))}

        {/* Esportes praticados */}
        <View className="mb-10">
          <Text className="text-white font-semibold mb-2">Esportes Praticados</Text>
          {user.esportes_praticados &&
            Object.entries(user.esportes_praticados).map(([esporte, nivel]) => (
              <View key={esporte} className="flex-row justify-between items-center mb-1">
                <Text className="text-white">
                  {esporte.charAt(0).toUpperCase() + esporte.slice(1)}: {nivel}
                </Text>
                {editando && <MaterialCommunityIcons name="pencil" size={20} color="white" />}
              </View>
            ))}
        </View>

        {/* Botões Editar / Salvar / Cancelar */}
        {!editando ? (<View>
          <TouchableOpacity
            onPress={() => setEditando(true)}
            className="bg-yellow-500 w-full py-4 rounded-2xl items-center mb-4"
          >
            <Text className="text-black font-semibold text-lg">Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={sair}
            className="bg-red-600 w-full py-4 rounded-2xl items-center mt-4"
          >
            <Text className="text-white font-semibold text-lg">Sair da Conta</Text>
          </TouchableOpacity>
        </View>
        ) : (
          <View className="flex-row w-full justify-between">
            <TouchableOpacity
              onPress={salvarEdicao}
              className="bg-green-600 flex-1 py-4 rounded-2xl items-center mr-2"
            >
              <Text className="text-white font-semibold text-lg">Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={cancelarEdicao}
              className="bg-gray-600 flex-1 py-4 rounded-2xl items-center ml-2"
            >
              <Text className="text-white font-semibold text-lg">Cancelar</Text>
            </TouchableOpacity>
          </View>
        )}


      </ScrollView>
    </SafeAreaView>
  );
}
