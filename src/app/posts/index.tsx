import { View, Image, Button, Alert, Text } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ExcluirPost, ListarPostProprios } from "~/api/feed";

export default function PostDetails() {
  const router = useRouter();
  const { postId } = useLocalSearchParams();

  const [post, setPost] = useState<any>(null);

  useEffect(() => {
    console.log("postId recebido:", postId);
    async function fetchPost() {
      const dados = await ListarPostProprios();
      if (dados) {
        const p = dados.find((item: any) => item.id === postId);
        setPost(p);
      }
    }
    fetchPost();
  }, [postId]);

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
    <View className="flex-1 justify-center items-center bg-black p-4">
      <Image
        source={{ uri: post.imagem }}
        style={{
          width: "100%",
          height: "50%",
          borderRadius: 12,
        }}
        resizeMode="contain"
      />
      <Button title="Deletar Post" color="red" onPress={handleDelete} />
    </View>
  );
}
