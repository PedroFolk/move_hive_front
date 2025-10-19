import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  RefreshControl,
  FlatList,
  Alert,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import * as ImagePicker from "expo-image-picker";
import {
  CriarPost,
  CurtirPost,
  ListarNofificacao,
  ListaPostSeguindo,
  ListaPostDescobrir,
} from "~/api/feed";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AddButton from "../../components/addButton";
import SugestoesPerfis from "../../components/sugestoesPerfil";
import { router } from "expo-router";
import ModalSearchUser from "~/components/modals/modalSearchUser";
import ModalNewPost from "~/components/modals/modalNewPost";
import ModalComentarios from "~/components/modals/modalComentarios";

export default function Feed() {
  const [posts, setPosts] = useState<any[]>([]);
  const [abaAtiva, setAbaAtiva] = useState<"descobrir" | "seguindo">("descobrir");
  const [modalVisible, setModalVisible] = useState(false);
  const [descricao, setDescricao] = useState("");
  const [imagem, setImagem] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [temNotificacoes, setTemNotificacoes] = useState(false);
  const [modalSearchVisible, setModalSearchVisible] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [modalComentariosVisible, setModalComentariosVisible] = useState(false);
  const [postSelecionado, setPostSelecionado] = useState<any | null>(null);

  useEffect(() => {
    const carregarToken = async () => {
      const t = await SecureStore.getItemAsync("userId");
      setToken(t);
    };
    carregarToken();
  }, []);

  const buscarPosts = async () => {
    try {
      const response =
        abaAtiva === "descobrir" ? await ListaPostDescobrir() : await ListaPostSeguindo();

      if (!response || response.status === 200 || response.status === 500) {
        console.log("Erro");
        setTimeout(() => router.replace("/login"), 0);
        return;
      }

      setPosts(response.data || response);
    } catch (error) {
      console.log("Erro de rede ou exceção:", error);
      setTimeout(() => router.replace("/login"), 0);
    }
  };

  const aoAtualizar = async () => {
    setRefreshing(true);
    await buscarPosts();
    setRefreshing(false);
  };

  const curtirPost = async (post_id: string) => {
    const userId = token;
    if (!userId) return;

    setPosts((prevPosts) =>
      prevPosts.map((p) => {
        if (p.postagem.id === post_id) {
          const usuarioJaCurtiu = p.postagem.curtidas?.some(
            (c: any) => c.usuario_id === userId
          );

          let novasCurtidas;
          let novoContador = p.postagem.contador_curtidas || 0;

          if (usuarioJaCurtiu) {
            novasCurtidas = p.postagem.curtidas.filter(
              (c: any) => c.usuario_id !== userId
            );
            novoContador = Math.max(0, novoContador - 1);
          } else {
            novasCurtidas = [
              ...(p.postagem.curtidas || []),
              { usuario_id: userId },
            ];
            novoContador += 1;
          }

          return {
            ...p,
            postagem: {
              ...p.postagem,
              curtidas: novasCurtidas,
              contador_curtidas: novoContador,
            },
          };
        }
        return p;
      })
    );

    try {
      await CurtirPost(post_id);
    } catch (e) {
      console.log("Erro ao curtir post na API:", e);
    }
  };

  const verificarNotificacoes = useCallback(async () => {
    const data = await ListarNofificacao();
    if (data) {
      const naoLidas = data.some((n: any) => n.lida === false);
      setTemNotificacoes(naoLidas);
    }
  }, []);

  useEffect(() => {
    buscarPosts();
  }, [abaAtiva]);

  useEffect(() => {
    verificarNotificacoes();
    const interval = setInterval(verificarNotificacoes, 15000);
    return () => clearInterval(interval);
  }, [verificarNotificacoes]);

  const abrirGaleria = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão", "Permissão para acessar galeria é necessária!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
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
      Alert.alert("Atenção", "Preencha a descrição e selecione uma imagem.");
      return;
    }
    setLoading(true);
    try {
      const resultado = await CriarPost(descricao, imagem);
      if (resultado) {
        const postComDefaults = {
          usuario: resultado.usuario || { id: token, username: "usuario", foto_perfil: null },
          postagem: {
            id: resultado.id || String(Date.now()),
            descricao: resultado.descricao || descricao,
            imagem: resultado.imagem || imagem.uri,
            curtidas: resultado.curtidas || [],
            contador_curtidas: resultado.contador_curtidas || 0,
          },
          comentarios: resultado.comentarios || 0,
        };
        setPosts((postsAntigos) => [postComDefaults, ...postsAntigos]);
        setDescricao("");
        setImagem(null);
        setModalVisible(false);
      } else {
        Alert.alert("Erro", "Erro ao criar post.");
      }
    } catch (e) {
      console.log("Erro ao criar post:", e);
      Alert.alert("Erro", "Erro ao criar post.");
    } finally {
      setLoading(false);
    }
  };

  const irParaPerfil = (usuario_id: string) => {
    router.push({
      pathname: "/profile",
      params: { userId: usuario_id },
    });
  };

  const renderPost = ({ item }: { item: any }) => {
    const usuarioCurtiu = item.postagem?.curtidas?.some(
      (curtida: any) => curtida.usuario_id === token
    );
    return (
      <View className="mb-4 w-full bg-neutral-800 rounded-xl overflow-hidden">
        <TouchableOpacity
          activeOpacity={100}
          className="flex-row items-center px-3 py-2"
          onPress={() => item.usuario?.id && irParaPerfil(item.usuario.id)}
        >
          {item.usuario?.foto_perfil ? (
            <Image
              source={{ uri: item.usuario.foto_perfil }}
              className="w-10 h-10 mr-3 rounded-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-10 h-10 mr-3 bg-neutral-600 justify-center items-center rounded-full">
              <Text className="text-white font-bold text-base">
                {item.usuario?.username?.[0]?.toUpperCase() || "U"}
              </Text>
            </View>
          )}
          <Text className="font-bold text-sm text-white">
            @{item.usuario?.username || "usuario"}
          </Text>
        </TouchableOpacity>

        {item.postagem?.imagem && (
          <Image
            source={{ uri: item.postagem.imagem }}
            style={{ width: "100%", aspectRatio: 1 }}
            resizeMode="cover"
          />
        )}

        <View className="flex-row items-center px-3 py-2 justify-between">
          <View className="flex-row">
            <TouchableOpacity
              activeOpacity={100}

              className="flex-row items-center mr-4"
              onPress={() => curtirPost(item.postagem.id)}
            >
              <Ionicons
                name={usuarioCurtiu ? "heart" : "heart-outline"}
                size={24}
                color={usuarioCurtiu ? "red" : "white"}
              />
              <Text className="text-white ml-1 text-sm">
                {item.postagem.contador_curtidas || 0}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={100}

              className="flex-row items-center mr-4"
              onPress={() => {
                setPostSelecionado(item);
                setModalComentariosVisible(true);
              }}

            >
              <Ionicons name="chatbubble-outline" size={24} color="white" />
              {/* <Text className="text-white ml-1 text-sm">
                {item.comentarios?.length || 0}
              </Text> */}
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center"
              activeOpacity={100}
            >

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
  };

  return (
    <View className="flex-1 w-full py-safe">
      <ModalSearchUser
        visible={modalSearchVisible}
        onClose={() => setModalSearchVisible(false)}
      />

      <View className="px-4 pt-4 flex-row justify-between items-center">
        <Text className="text-white text-2xl font-bold">Publicações</Text>
        <View className="flex-row">
          <TouchableOpacity onPress={() => setModalSearchVisible(true)}
            activeOpacity={100}
          >
            <Ionicons name="search" size={28} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("../notifications")} activeOpacity={100}
          >
            <View className="relative ml-4">
              <MaterialCommunityIcons name="bell-outline" size={28} color="white" />
              {temNotificacoes && (
                <View className="absolute top-0 left-0 w-2 h-2 rounded-full bg-red-500" />
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-row justify-around mt-4 mb-2 border-b border-neutral-700">
        {["descobrir", "seguindo"].map((aba) => (
          <TouchableOpacity

            key={aba}
            activeOpacity={100}
            className="p-4"
            onPress={() => setAbaAtiva(aba as "descobrir" | "seguindo")}
          >
            <Text
              className={`text-base font-bold ${abaAtiva === aba ? "text-yellow-400" : "text-neutral-400"
                }`}
            >
              {aba === "descobrir" ? "Descobrir" : "Seguindo"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderPost}
        contentContainerStyle={{ paddingBottom: 120, marginTop: 5 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={aoAtualizar}
            colors={["#facc15"]}
          />
        }
        ListHeaderComponent={abaAtiva === "descobrir" ? <SugestoesPerfis /> : null}
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
      <ModalComentarios
        visible={modalComentariosVisible}
        onClose={() => setModalComentariosVisible(false)}
        post={postSelecionado}
      />


      <AddButton
        onPress={async () => {
          await abrirGaleria();
          if (!imagem) return;
          setModalVisible(true);
        }}
      />
    </View>
  );
}