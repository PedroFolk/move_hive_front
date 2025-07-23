import {
  View,
  Image,
  Alert,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useState, useCallback } from "react";
import { ExcluirPost, ListarPostProprios } from "~/api/feed";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PostDetails() {
  const router = useRouter();
  const { postId } = useLocalSearchParams();
  const [post, setPost] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPost = useCallback(async () => {
    const dados = await ListarPostProprios();
    if (dados) {
      const p = dados.find((item: any) => item.id === postId);
      setPost(p);
    }
  }, [postId]);

  useEffect(() => {
    fetchPost();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPost();
    setRefreshing(false);
  };

  const handleDelete = () => {
    Alert.alert("Deletar Post", "Tem certeza que deseja deletar este post?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Deletar",
        style: "destructive",
        onPress: async () => {
          await ExcluirPost(postId);
          router.back();
        },
      },
    ]);
  };

  if (!post)
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <Text className="text-white text-lg">Carregando...</Text>
      </View>
    );

  return (
    <SafeAreaView className="h-full w-full bg-neutral-800 p-4">
      {/* Botão de Voltar */}
      <TouchableOpacity onPress={() => router.back()} className="mb-4">
        <Text className="text-white text-2xl">←</Text>
      </TouchableOpacity>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ alignItems: "center" }}
      >
        <Image
          source={{ uri: post.imagem }}
          style={{
            width: "100%",
            height: 300,
            borderRadius: 16,
            marginBottom: 24,
          }}
          resizeMode="cover"
        />

        <Text className="text-white text-2xl font-semibold mb-4 text-center">
          {post.descricao ?? "Sem descrição disponível."}
        </Text>

        <TouchableOpacity
          onPress={handleDelete}
          style={{
            backgroundColor: "#ff4d4d",
            paddingVertical: 12,
            paddingHorizontal: 24,
            borderRadius: 8,
          }}
        >
          <Text className="text-white font-semibold text-base">
            Deletar Post
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
