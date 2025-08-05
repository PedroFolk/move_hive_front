import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState, useCallback } from "react";
import { ListarPostProprios } from "~/api/feed";
import { router } from "expo-router";

export default function Perfil() {
  const [posts, setPosts] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const carregarPosts = useCallback(async () => {
    setRefreshing(true);
    const dados = await ListarPostProprios();
    if (dados) setPosts(dados);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    // carregarPosts();
  }, [carregarPosts]);

  const diasSemana = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
  const praticaEsporte = [3, 1, 2, 0, 4, 2, 1];

  return (
    <View className="h-full w-full p-4 mt-4">
      <ScrollView
        contentContainerStyle={{ alignItems: "center" }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={carregarPosts} />
        }
      >
        <Image
          source={require("./Perfil.png")}
          resizeMode="cover"
          className="rounded-full w-24 h-24 "
        />

        <Text className="text-white text-lg font-bold mt-3">@usuario</Text>
        <View className="flex-row w-full px-4 mt-6 justify-around ">
          <TouchableOpacity className="rounded-md flex-1 py-2 items-center bg-yellow-500">
            <Text className="text-neutral-800 font-semibold">Compartilhar</Text>
          </TouchableOpacity>
          <Text></Text>
          <TouchableOpacity
            className="border-white flex-1 border-2 rounded-md py-2 items-center"
            onPress={() => {
              router.push({
                pathname: "../configs",
              });
            }}
          >
            <Text className="text-white">Configurações</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row flex-wrap items-start mt-6 justify-start px-2 mb-2">
          {posts.map((post) => (
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

        <View className="flex justify-center mb-4 items-center text-center">
          <Text className="text-white font-bold mt-10 mb-4 text-lg">
            Atividade na Semana
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-end",
              justifyContent: "space-around",
              width: "90%",
              height: 100,
            }}
          >
            {praticaEsporte.map((horas, i) => (
              <View key={i} style={{ alignItems: "center" }}>
                <View
                  style={{
                    width: 20,
                    height: horas * 20,
                    backgroundColor: "#facc15", // amarelo
                    borderRadius: 4,
                  }}
                />
                <Text className="text-white" style={{ marginTop: 4 }}>
                  {diasSemana[i]}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View className="w-full px-8 mt-8">
          <TouchableOpacity className="border border-white rounded-md mb-2 py-3 px-4">
            <Text className="text-white text-center font-medium">
              Histórico de Eventos Criados
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="border border-white rounded-md py-3 px-4">
            <Text className="text-white text-center font-medium">
              Eventos Participados
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="border border-white rounded-md py-3 mt-2 px-4">
            <Text className="text-white text-center font-medium">
              Esportes Praticados
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
