import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../events/styles";
import { useEffect, useState } from "react";
import { ListarPostProprios } from "~/api/feed";
import { router } from "expo-router";

export default function Perfil() {
  const [posts, setPosts] = useState<any[]>([]);
  useEffect(() => {
    const carregarPosts = async () => {
      const dados = await ListarPostProprios();
      if (dados) {
        setPosts(dados);
      }
    };

    carregarPosts();
  }, []);

  return (
    <SafeAreaView className="flex-1">
      <ScrollView contentContainerStyle={{ alignItems: "center" }}>
        <Image
          source={require("./Perfil.png")}
          resizeMode="cover"
          className="rounded-full w-24 h-24"
        />

        <Text className="text-white text-lg font-bold mt-3">@usuario</Text>

        <View className="flex-row w-full px-4 mt-6 justify-around ">
          <TouchableOpacity className=" rounded-md flex-1 py-2 items-center bg-yellow-500">
            <Text className="text-neutral-800 font-semibold">Compartilhar</Text>
          </TouchableOpacity>
          <Text></Text>
          <TouchableOpacity className=" border-white flex-1 border-2 rounded-md py-2 items-center ">
            <Text className="text-white">Configurações</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row flex-wrap mt-6 justify-center">
          {posts.map((post, i) => (
            <TouchableOpacity
              key={post.id}
              onPress={() =>
                router.push({
                  pathname: "../posts",
                  params: { postId: post.id },
                })
              }
              className="p-1"
            >
              <Image
                source={{ uri: post.imagem }}
                style={{ width: 110, height: 110 }}
                className="rounded-sm"
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
