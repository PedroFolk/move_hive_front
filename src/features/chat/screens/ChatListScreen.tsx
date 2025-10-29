import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { ListarMeusChats } from "~/features/chat/api/chat";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import ChatModal from "~/features/chat/components/ChatModal";

export default function HiveChats() {
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [chatSelecionado, setChatSelecionado] = useState<string | null>(null);

  const carregarChats = async () => {
    setRefreshing(true);
    const lista = await ListarMeusChats();
    if (lista) setChats(lista);
    setRefreshing(false);
    setLoading(false);
  };

  useEffect(() => {
    carregarChats();
  }, []);

  if (loading)
    return (
      <View className="bg-neutral-900 flex-1 items-center justify-center">
        <ActivityIndicator color="#eab308" size="large" />
      </View>
    );

  return (
    <View className="bg-neutral-900 flex-1 pt-safe px-4">

      <View className=" flex-row my-4">
        <TouchableOpacity onPress={router.back}>
          <Ionicons name="arrow-back" size={26} color="#eab308" />
        </TouchableOpacity>
        <Text className="text-white ml-4 text-2xl font-bold mb-4">Meus Chats</Text>
      </View>

      <FlatList
        data={chats}
        keyExtractor={(item) => item.id_chat}
        refreshing={refreshing}
        onRefresh={carregarChats}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <Text className="text-neutral-400 text-center mt-10">
            Nenhum chat encontrado.
          </Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setChatSelecionado(item.id_chat)}
            className="flex-row items-center bg-neutral-800 p-3 rounded-2xl mb-3"
          >
            <Image
              source={{
                uri: item.foto_chat || "https://i.imgur.com/4ZQZ4Z0.png",
              }}
              className="w-12 h-12 rounded-full mr-3"
            />
            <View className="flex-1">
              <Text className="text-white text-base font-semibold">
                {item.nome_chat}
              </Text>
              <Text className="text-neutral-400 text-sm" numberOfLines={1}>
                {item.ultima_mensagem || "Sem mensagens ainda"}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#eab308" />
          </TouchableOpacity>
        )}
      />
      <ChatModal
        visible={!!chatSelecionado}
        onClose={() => setChatSelecionado(null)}
        chatId={chatSelecionado!}
      />
    </View>
  );
}
