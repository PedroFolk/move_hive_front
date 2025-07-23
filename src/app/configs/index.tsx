import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Configuracoes() {
  const router = useRouter();

  const sair = async () => {
    await AsyncStorage.removeItem("token");
    router.replace("/login");
  };

  const user = {
    NomeCompleto: "João da Silva",
    username: "joaosilva",
    data_nascimento: "2000-05-15",
    email: "joao@example.com",
    biografia: "Amo tecnologia e futebol.",
    cidade: "São Paulo",
    estado: "SP",
    esportes_praticados: {
      futebol: "iniciante",
      basquete: "amador",
    },
  };

  return (
    <SafeAreaView className="bg-neutral-800 items-center justify-center w-full h-full">
      <ScrollView className="w-full h-full px-6 py-8">
        <View className="flex-row justify-between items-center mb-8">
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-white text-2xl">←</Text>
          </TouchableOpacity>
          <Text className="text-3xl font-bold text-white">
            Configurações de Perfil
          </Text>
        </View>

        <View className="mb-6">
          <Text className="text-white font-semibold mb-1">Nome Completo</Text>
          <Text className="text-white">{user.NomeCompleto}</Text>
        </View>

        <View className="mb-6">
          <Text className="text-white font-semibold mb-1">Username</Text>
          <Text className="text-white">{user.username}</Text>
        </View>

        <View className="mb-6">
          <Text className="text-white font-semibold mb-1">
            Data de Nascimento
          </Text>
          <Text className="text-white">{user.data_nascimento}</Text>
        </View>

        <View className="mb-6">
          <Text className="text-white font-semibold mb-1">Email</Text>
          <Text className="text-white">{user.email}</Text>
        </View>

        <View className="mb-6">
          <Text className="text-white font-semibold mb-1">Biografia</Text>
          <Text className="text-white">{user.biografia}</Text>
        </View>

        <View className="mb-6">
          <Text className="text-white font-semibold mb-1">Cidade</Text>
          <Text className="text-white">{user.cidade}</Text>
        </View>

        <View className="mb-6">
          <Text className="text-white font-semibold mb-1">Estado</Text>
          <Text className="text-white">{user.estado}</Text>
        </View>

        <View className="mb-10">
          <Text className="text-white font-semibold mb-2">
            Esportes Praticados
          </Text>
          {Object.entries(user.esportes_praticados).map(([esporte, nivel]) => (
            <Text key={esporte} className="text-white mb-1">
              {esporte.charAt(0).toUpperCase() + esporte.slice(1)}: {nivel}
            </Text>
          ))}
        </View>
        <TouchableOpacity
          // onPress={sair}
          className="border-white border-2 w-full py-4 mb-4 rounded items-center"
        >
          <Text className="text-white font-semibold text-lg">
            Editar informações
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={sair}
          className="bg-red-600 w-full py-4 rounded items-center"
        >
          <Text className="text-white font-semibold text-lg">
            Sair da Conta
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
