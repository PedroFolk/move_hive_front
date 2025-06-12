import { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  ScrollView,
  Modal,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { CriarPost, ListaTodosPost } from "~/api/feed";
import { Ionicons } from "@expo/vector-icons";

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
    if (data) {
      setPosts(data);
    }
  };

  useEffect(() => {
    //buscarPosts();
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

  return (
    <View className="w-full h-full p-5 justify-center items-center">
      <Text className="text-white font-bold items-center justify-center text-2xl mb-4">
        Publicações
      </Text>
      <TouchableOpacity
        className="absolute bottom-[88px] right-4 p-4 rounded-full justify-center items-center shadow-md bg-neutral-900 z-50 "
        onPress={async () => {
          await abrirGaleria();
          if (!imagem) return;
          setModalVisible(true);
        }}
      >
        <Ionicons name="add" color={"white"} size={28} />
      </TouchableOpacity>

      <ScrollView
        className="mt-5"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={aoAtualizar}
            colors={["#facc15"]}
          />
        }
      >
        {posts.map((post, index) => (
          <View
            key={index}
            className="mb-4 w-full bg-neutral-700 rounded-lg p-2"
          >
            <View className="flex-row items-center pr-2 mb-2">
              {post.usuario?.foto_perfil ? (
                <Image
                  source={{ uri: post.usuario.foto_perfil }}
                  className="w-9 h-9 mr-2"
                  style={{ borderRadius: 18 }}
                  resizeMode="cover"
                />
              ) : (
                <View
                  className="w-9 h-9 mr-2 bg-neutral-600 justify-center items-center"
                  style={{ borderRadius: 18 }}
                >
                  <Text className="text-white font-bold text-base">
                    {post.usuario?.username
                      ? post.usuario.username[0].toUpperCase()
                      : "U"}
                  </Text>
                </View>
              )}

              <Text className="font-bold text-sm text-white">
                @{post.usuario?.username || "usuario"}
              </Text>
            </View>

            {post.postagem?.imagem && (
              <Image
                source={{ uri: post.postagem.imagem }}
                className="w-full"
                style={{ aspectRatio: 1, borderRadius: 12 }}
                resizeMode="cover"
              />
            )}
            <View className="flex flex-row">
              <Text className="font-bold text-sm py-3 pl-2 text-white">
                {post.usuario?.username}:
              </Text>

              <Text className="text-sm py-3 text-white">
                {` ${post.postagem?.descricao}`}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View className="flex-1 bg-black bg-opacity-50 justify-center items-center">
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={60}
            className="w-full items-center"
          >
            <ScrollView
              contentContainerStyle={{
                alignItems: "center",
                justifyContent: "center",
              }}
              keyboardShouldPersistTaps="handled"
            >
              <View className="bg-neutral-800 w-11/12 rounded-2xl p-5 shadow-2xl">
                <View className="flex-row w-full justify-between items-center mb-4">
                  <TouchableOpacity
                    onPress={() => {
                      setModalVisible(false);
                      setDescricao("");
                    }}
                  >
                    <Ionicons
                      name="close"
                      size={27}
                      color="white"
                      className="bg-transparent p-2 rounded-lg"
                    />
                  </TouchableOpacity>

                  <Text className="text-white text-lg font-bold text-center flex-1">
                    Nova postagem
                  </Text>

                  <TouchableOpacity onPress={adicionarPost} disabled={loading}>
                    <Ionicons
                      name={loading ? "time-outline" : "checkmark"}
                      size={27}
                      className="bg-yellow-500 p-2 rounded-lg"
                      color="white"
                    />
                  </TouchableOpacity>
                </View>

                {imagem ? (
                  <Image
                    source={{ uri: imagem.uri }}
                    style={{ width: "100%", height: 200, borderRadius: 12 }}
                    resizeMode="cover"
                  />
                ) : (
                  <TouchableOpacity
                    className="bg-neutral-600 w-full h-48 rounded-xl justify-center items-center mb-4"
                    onPress={abrirGaleria}
                  >
                    <Ionicons name="image" size={48} color="#ccc" />
                    <Text className="text-gray-300 mt-2">
                      Selecionar imagem
                    </Text>
                  </TouchableOpacity>
                )}

                <TextInput
                  placeholder="Escreva uma legenda..."
                  placeholderTextColor="#aaa"
                  value={descricao}
                  onChangeText={setDescricao}
                  multiline
                  className="text-white border border-neutral-600 rounded-md px-3 py-2 mt-4"
                  style={{ minHeight: 60, textAlignVertical: "top" }}
                />
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}
