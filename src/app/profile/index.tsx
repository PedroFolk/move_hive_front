import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Modal,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ListarDadosPerfil } from "~/api/user";
import { ListarPostProprios } from "~/api/feed";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import PostModal from "../components/modalPosts";


type PerfilProps = {
  userId?: string;
  meuUserId: string;
};

export default function Perfil({ userId, meuUserId }: PerfilProps) {
  const [perfil, setPerfil] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [postSelecionado, setPostSelecionado] = useState<any>(null);
  const [modalPostVisible, setModalPostVisible] = useState(false);
  const [descricaoSelecionado, setDescricaoSelecionad] = useState("");
  const isMeuPerfil = !userId || userId === meuUserId;

  const carregarPerfil = useCallback(async () => {
    setRefreshing(true);
    let dados;
    let postsApi;

    if (isMeuPerfil) {
      dados = await ListarDadosPerfil();
      postsApi = await ListarPostProprios();
    } else {
      // dados = await ListarDadosOutroPerfil(userId!);
      // postsApi = await ListarPostOutroUsuario(userId!);
    }

    if (dados) setPerfil(dados);
    if (postsApi) setPosts(postsApi);
    setRefreshing(false);
  }, [userId]);

  const formatarPostsParaGrid = (posts: any[]) => {
    const resto = posts.length % 3;
    if (resto === 0) return posts;
    const placeholders = Array.from({ length: 3 - resto }, (_, i) => ({
      id: `placeholder-${i}-${posts.length}`,
      placeholder: true,
    }));
    return [...posts, ...placeholders];
  };

  useEffect(() => {
    carregarPerfil();
  }, [userId]);

  if (!perfil) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-white">Carregando...</Text>
      </View>
    );
  }

  const Header = () => (
    <View className="w-full py-4 px-6">
      <View className="flex-row items-center justify-between">
        {perfil.foto_perfil ? (
          <Image
            source={{ uri: perfil.foto_perfil }}
            resizeMode="cover"
            className="rounded-full w-28 h-28 border-2 border-yellow-500"
          />
        ) : (
          <View className="rounded-full w-28 h-28 border-2 border-yellow-500 items-center justify-center">
            <Text className="text-yellow-500 font-bold text-4xl">
              {perfil.username?.[0]?.toUpperCase() || "U"}
            </Text>
          </View>
        )}

        <View className="flex-1 ml-4 justify-center">
          <View className="flex-row flex-1 justify-around">
            <TouchableOpacity
              className="items-center"
              onPress={() => router.push("../infoAdc?tipo=seguidores")}
            >
              <Text className="text-yellow-500 font-bold text-lg">
                {perfil.seguidores_count}
              </Text>
              <Text className="text-white text-sm">Seguidores</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="items-center"
              onPress={() => router.push("../infoAdc?tipo=seguindo")}
            >
              <Text className="text-yellow-500 font-bold text-lg">
                {perfil.seguindo_count}
              </Text>
              <Text className="text-white text-sm">Seguindo</Text>
            </TouchableOpacity>
          </View>

          {isMeuPerfil ? (
            <TouchableOpacity
              className="border-2 border-white rounded-2xl mt-4 py-2"
              onPress={() => router.push("../configs")}
            >
              <Text className="text-white text-center text-lg">Editar Perfil</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className="border-2 border-yellow-500 rounded-2xl mt-4 py-2 bg-yellow-500"
              onPress={() => console.log("Seguir usuário")}
            >
              <Text className="text-black text-center text-lg">Seguir</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <Text className="text-white text-lg font-bold mt-4">{perfil.nome_completo}</Text>
      <Text className="text-neutral-400 text-sm">@{perfil.username}</Text>

      <View className="flex-row mt-1 items-center">
        <MaterialCommunityIcons name="map-marker" size={16} color="gray" />
        <Text className="text-neutral-400 ml-1">
          {perfil.cidade}, {perfil.estado}
        </Text>
      </View>

      {perfil.biografia && (
        <Text className="text-neutral-300 mt-2">{perfil.biografia}</Text>
      )}

      {/* Pontuação */}
      <View className="w-full mt-4 items-center">
        <TouchableOpacity className="flex-row items-center w-2/3 justify-between rounded-2xl border-2 border-yellow-500 bg-yellow-500 py-2 px-4">
          <MaterialCommunityIcons name="trophy" size={24} color="black" />
          <Text className="text-black font-semibold text-lg mx-2">
            {perfil.pontos.toFixed(0)}
          </Text>
          <MaterialCommunityIcons name="trophy" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View className="mt-6 mb-2 h-1 w-full rounded-full bg-neutral-700" />
    </View>
  );

  const renderPostItem = ({ item }: { item: any }) =>
    item.placeholder ? (
      <View className="flex-1" />
    ) : (
      <TouchableOpacity
        className="flex-1 m-1"
        onPress={() => {
          setPostSelecionado(item);
          setDescricaoSelecionad(item.descricao);
          setModalPostVisible(true);
        }}
      >
        <Image
          source={{ uri: item.imagem }}
          style={{ width: "100%", aspectRatio: 1, borderRadius: 8 }}
          resizeMode="cover"
        />
      </TouchableOpacity>
    );


  return (
    <SafeAreaView className="w-full h-full">
      <FlatList
        data={formatarPostsParaGrid(posts)}
        keyExtractor={(item) => item.id}
        renderItem={renderPostItem}
        numColumns={3}
        ListHeaderComponent={Header}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={carregarPerfil} />
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
      {postSelecionado && (
        <PostModal
          visible={modalPostVisible}
          onClose={() => setModalPostVisible(false)}
          post={postSelecionado}
          onDelete={(postId) => {
            Alert.alert(
              "Apagar publicação",
              "Deseja realmente apagar sua publicação?",
              [
                { text: "Não", style: "cancel" },
                {
                  text: "Sim",
                  style: "destructive",
                  onPress: async () => {

                  },
                },
              ]
            );
            // setModalPostVisible(false);
          }}
          nome={perfil.username}
          foto_perfil={perfil.foto_perfil}
          comentario={descricaoSelecionado}
        />
      )}
    </SafeAreaView>

  );
}
