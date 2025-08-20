import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  FlatList,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { CriarPost, ListaTodosPost } from "~/api/feed";
import { Ionicons } from "@expo/vector-icons";
import AddButton from "../components/addButton";
import ModalNewPost from "../components/modalNewPost";

export default function Feed() {
  const [posts, setPosts] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [descricao, setDescricao] = useState("");
  const [imagem, setImagem] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const aoAtualizar = async () => {
    setRefreshing(true);
    await buscarPosts();
    setRefreshing(false);
  };

  const buscarPosts = async () => {
    const data = await ListaTodosPost();
    if (data) setPosts(data);
  };

  useEffect(() => {
    buscarPosts();
  }, []);

  const abrirGaleria = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permissão para acessar galeria é necessária!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      const novaImagem = {
        uri: asset.uri,
        name: asset.fileName || "foto.jpg",
        type: asset.type || "image/jpeg",
      };
      setImagem(novaImagem);
      setModalVisible(true);
    }
  };

  const adicionarPost = async () => {
    if (loading) return;

    if (!descricao.trim() || !imagem) {
      alert("Preencha a descrição e selecione uma imagem.");
      return;
    }

    setLoading(true);

    try {
      const resultado = await CriarPost(descricao, imagem);
      if (resultado) {
        setPosts((postsAntigos) => [resultado, ...postsAntigos]);
        setDescricao("");
        setImagem(null);
        setModalVisible(false);
      } else {
        alert("Erro ao criar post.");
      }
    } catch (error) {
      alert("Erro ao criar post.");
    } finally {
      setLoading(false);
    }
  };

  const renderPost = ({ item }: { item: any }) => (
    <View className="mb-4 w-full bg-neutral-800 rounded-xl overflow-hidden">
      <View className="flex-row items-center px-3 py-2">
        {item.usuario?.foto_perfil ? (
          <Image
            source={{ uri: item.usuario.foto_perfil }}
            className="w-10 h-10 mr-3 rounded-full"
            resizeMode="cover"
          />
        ) : (
          <View className="w-10 h-10 mr-3 bg-neutral-600 justify-center items-center rounded-full">
            <Text className="text-white font-bold text-base">
              {item.usuario?.username ? item.usuario.username[0].toUpperCase() : "U"}
            </Text>
          </View>
        )}
        <Text className="font-bold text-sm text-white">
          @{item.usuario?.username || "usuario"}
        </Text>
      </View>

      {item.postagem?.imagem && (
        <Image
          source={{ uri: item.postagem.imagem }}
          style={{ width: "100%", aspectRatio: 1 }}
          resizeMode="cover"
        />
      )}

      <View className="flex-row items-center px-3 py-2 justify-between">
        <View className="flex-row">
          <TouchableOpacity className="flex-row items-center mr-4">
            <Ionicons name="heart-outline" size={24} color="white" />
            <Text className="text-white ml-1 text-sm">{item.likes || 0}</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center mr-4">
            <Ionicons name="chatbubble-outline" size={24} color="white" />
            <Text className="text-white ml-1 text-sm">{item.comentarios || 0}</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center">
            <Ionicons name="share-social-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <View className="px-3 pb-3 flex-row flex">
        <Text className="font-bold text-sm text-white">
          {item.usuario?.username}:
        </Text>
        <Text className="text-sm text-white ml-1">
          {item.postagem?.descricao}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 w-full">
      <View className="px-4 pt-4 flex-row justify-between items-center">
        <Text className="text-white text-2xl font-bold">Publicações</Text>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderPost}
        contentContainerStyle={{ paddingBottom: 120, marginTop: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={aoAtualizar}
            colors={["#facc15"]}
          />
        }
      />

      <ModalNewPost
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={adicionarPost}
        loading={loading}
        imagem={imagem}
        setImagem={setImagem}
        descricao={descricao}
        setDescricao={setDescricao}
        abrirGaleria={abrirGaleria}
      />

      <AddButton
        onPress={async () => {
          await abrirGaleria();
          if (!imagem) return;
          setModalVisible(true);
        }}
      />
    </SafeAreaView>
  );
}
