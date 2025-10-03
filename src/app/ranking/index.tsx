import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ListaRankingTodos, ListaRankingSeguindo } from "~/api/rank";

interface UserRanking {
  nome_completo: string;
  username: string;
  pontos: number;
  foto_perfil?: string;
}

export default function Ranking() {
  const [ranking, setRanking] = useState<UserRanking[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("Geral");
  const [refreshing, setRefreshing] = useState(false);

  const TYPES = ["Geral", "Seguindo"];

  const fetchData = useCallback(async () => {
    setRefreshing(true);
    let data: UserRanking[] | null = null;

    if (selectedCategory === "Geral") {
      data = await ListaRankingTodos();
    } else if (selectedCategory === "Seguindo") {
      data = await ListaRankingSeguindo();
    }

    if (data) setRanking(data);
    setRefreshing(false);
  }, [selectedCategory]);

  useEffect(() => {
    fetchData();
  }, [selectedCategory]);

  const renderItem = ({
    item,
    index,
  }: {
    item: UserRanking;
    index: number;
  }) => (
    <View className="flex-row items-center p-3 mb-2 bg-neutral-900 rounded-xl ">
      {index === 0 ? (
        <MaterialCommunityIcons name="medal" size={24} color="#FFD700" />
      ) : index === 1 ? (
        <MaterialCommunityIcons name="medal" size={24} color="#C0C0C0" />
      ) : index === 2 ? (
        <MaterialCommunityIcons name="medal" size={24} color="#CD7F32" />
      ) : (
        <Text className="text-white w-6">{index + 1}</Text>
      )}

      {item.foto_perfil ? (
        <Image
          source={{ uri: item.foto_perfil }}
          className="w-10 h-10 mx-2 rounded-full"
          resizeMode="cover"
        />
      ) : (
        <View className="w-10 h-10 mx-2 bg-neutral-600 justify-center items-center rounded-full">
          <Text className="text-white font-bold text-base">
            {item.username ? item.username[0].toUpperCase() : "U"}
          </Text>
        </View>
      )}

      <View className="flex-1">
        <Text className="text-white font-medium">{item.nome_completo}</Text>
        <Text className="text-gray-400">@{item.username}</Text>
      </View>

      <View className="flex-row items-center">
        <Text className="text-white font-bold">{item.pontos.toFixed(0)}</Text>
        <MaterialCommunityIcons
          name="star"
          size={16}
          color="#FFD700"
          className="ml-1"
        />
      </View>
    </View>
  );

  return (
    <View className="w-full h-full bg-neutral-800 py-safe">
      <View className="px-4 pt-4 flex-row justify-between items-center">
        <Text className="text-white text-2xl font-bold">Ranking</Text>
      </View>

      <FlatList
        horizontal
        data={TYPES}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setSelectedCategory(item)}
            className={`mr-2 px-6 h-10 justify-center items-center rounded-full border ${
              selectedCategory === item
                ? "bg-white border-transparent"
                : "border-gray-500 border-2"
            }`}
          >
            <Text
              className={`text-sm font-medium ${selectedCategory === item ? "text-black" : "text-gray-300"}`}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      <FlatList
        className="h-full mt-10"
        data={ranking}
        keyExtractor={(item) => item.username}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 4,
          paddingBottom: 120,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchData} />
        }
        ListEmptyComponent={() => (
          <View className="items-center mt-4">
            <Text className="text-white text-lg">
              Nenhum usuário encontrado
            </Text>
          </View>
        )}
      />
    </View>
  );
}
