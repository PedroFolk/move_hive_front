import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SugerirPerfis, SeguirUsuario } from "~/features/profile/api/user";

const MEU_USER_ID = "";

export default function SugestoesPerfis() {
  const [perfis, setPerfis] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [colapsado, setColapsado] = useState(false);

  const irParaPerfil = (usuario_id: string) => {
    router.push({
      pathname: "/profile",
      params: { userId: usuario_id },
    });
  };

  useEffect(() => {
    const fetchPerfis = async () => {
      try {
        const data = await SugerirPerfis();
        if (data) setPerfis(data.filter((p: any) => p.id !== MEU_USER_ID));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchPerfis();
  }, []);

  const handleSeguir = async (id: string) => {
    try {
      await SeguirUsuario(id);
      setPerfis((prev) =>
        prev.map((p) => (p.id === id ? { ...p, seguido: true } : p))
      );
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível seguir este usuário.");
    }
  };

  if (loading) {
    return (
      <View className="p-4 items-center">
        <ActivityIndicator size="small" color="#FFD700" />
      </View>
    );
  }

  if (perfis.length === 0) {
    return (
      <View className="p-4 bg-neutral-700 mt-2 rounded-xl">
        <TouchableOpacity
          activeOpacity={100}
          onPress={() => setColapsado(!colapsado)}
          className="flex-row items-center justify-between"
        >
          <Text className="text-lg text-white font-bold">
            Sugestões para você
          </Text>
          <Ionicons
            name={colapsado ? "chevron-down" : "chevron-up"}
            size={20}
            color="white"
          />
        </TouchableOpacity>
        {!colapsado && (
          <Text className="text-gray-400 mt-2">
            Nenhuma sugestão disponível no momento.
          </Text>
        )}
      </View>
    );
  }

  return (
    <View className="p-4 bg-neutral-700 mt-2 rounded-xl mb-4">
      <TouchableOpacity
      activeOpacity={100}
        onPress={() => setColapsado(!colapsado)}
        className="flex-row items-center justify-between "
      >
        <Text className="text-lg text-white font-bold">
          Sugestões para você
        </Text>
        <Ionicons
          name={colapsado ? "chevron-down" : "chevron-up"}
          size={20}
          color="white"
        />
      </TouchableOpacity>

      {!colapsado && (
        <FlatList
        className="mt-4"
          horizontal
          showsHorizontalScrollIndicator={false}
          data={perfis}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="items-center mr-4 bg-neutral-900 p-3 rounded-xl w-40"
              onPress={() => {
                irParaPerfil(item.id);
              }}
            >
              <Image
                source={{ uri: item.foto_perfil }}
                className="w-16 h-16 rounded-full mb-2 bg-white"
              />
              <Text
                className="font-semibold text-white text-center"
                numberOfLines={1}
              >
                {item.nome_completo}
              </Text>
              <Text className="text-xs text-gray-400">@{item.username}</Text>

              <TouchableOpacity
                className={`mt-2 px-3 py-1 rounded-lg ${item.seguido ? "bg-gray-600" : "bg-yellow-500"
                  }`}
                disabled={item.seguido}
                onPress={() => handleSeguir(item.id)}
              >
                <Text
                  className={`font-bold text-sm ${item.seguido ? "text-white" : "text-black"
                    }`}
                >
                  {item.seguido ? "Seguindo" : "Seguir"}
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}
