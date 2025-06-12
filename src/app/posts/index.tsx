import {
  View,
  Image,
  Button,
  Alert,
  Text,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useState, useCallback } from "react";
import { ExcluirPost, ListarPostProprios } from "~/api/feed";

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

  if (!post)
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <Text className="text-white">Carregando...</Text>
      </View>
    );

  const handleDelete = () => {
    console.log("postId paraDeletar:", postId);
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

  return (
    <ScrollView
      className="flex-1 bg-black"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      contentContainerStyle={{ padding: 16, alignItems: "center", flexGrow: 1 }}
    >
      <Image
        source={{ uri: post.imagem }}
        style={{
          width: "100%",
          height: 300,
          borderRadius: 12,
        }}
        resizeMode="contain"
      />
      <View style={{ marginTop: 16, width: "100%" }}>
        <Button title="Deletar Post" color="red" onPress={handleDelete} />
      </View>
    </ScrollView>
  );
}
