import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import {
  ListarDadosPerfil,
  PararDeSeguirUsuario,
  SeguirUsuario,
  UsuarioAlheio,
  UsuariosSeguidos,
} from "~/api/user";
import { ExcluirPost, ListarPostProprios, PostUsuarioAlheio } from "~/api/feed";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import PostModal from "../modals/modalPosts";
import UsuariosModal from "../modals/modalUsuarios";
// IMPORTAÇÃO DO NOVO MODAL DE USUÁRIOS

type PerfilProps = {
  userId?: string;
  meuUserId: string;
};

export default function Perfil({ userId, meuUserId }: PerfilProps) {
  const params = useLocalSearchParams();
  const userIdString = userId || (params.userId as string | undefined);
  const isMeuPerfil = !userIdString || userIdString === meuUserId;

  const [perfil, setPerfil] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [postSelecionado, setPostSelecionado] = useState<any>(null);
  const [modalPostVisible, setModalPostVisible] = useState(false);
  const [descricaoSelecionado, setDescricaoSelecionad] = useState("");
  const [jaSegue, setJaSegue] = useState<boolean>(false);
  const [segLoading, setSegLoading] = useState<boolean>(false);

  // NOVOS ESTADOS PARA O MODAL DE USUÁRIOS
  const [modalUsuariosVisible, setModalUsuariosVisible] = useState(false);
  const [modalUsuariosTipo, setModalUsuariosTipo] = useState<"seguindo" | "seguidores">(
    "seguindo"
  );


  const carregarPerfil = useCallback(async () => {
    setRefreshing(true);
    try {
      let dados: any = null;
      let postsApi: any[] = [];

      if (isMeuPerfil) {
        dados = await ListarDadosPerfil();
        const postsRaw = await ListarPostProprios();
        postsApi = postsRaw.map(
          (p: {
            id: any;
            imagem: any;
            imagem_url: any;
            conteudo: any;
            descricao: any;
          }, i: any) => ({
            id: p.id || `post-${i}`,
            imagem: p.imagem || p.imagem_url,
            descricao: p.conteudo || p.descricao,
          })
        );
      } else if (userIdString) {
        const raw = await UsuarioAlheio(userIdString);
        const postsRaw = await PostUsuarioAlheio(userIdString);
        postsApi = postsRaw.map(
          (p: {
            id: any;
            imagem: any;
            imagem_url: any;
            conteudo: any;
            descricao: any;
          }, i: any) => ({
            id: p.id || `post-${i}`,
            imagem: p.imagem || p.imagem_url || "",
            descricao: p.conteudo || p.descricao || "",
          })
        );
        dados = {
          nome_completo: raw?.nome_completo || raw?.nome || "",
          username:
            raw?.username ||
            raw?.nome?.split(" ")[0]?.toLowerCase() ||
            "usuario",
          foto_perfil: raw?.foto_perfil || null,
          seguidores_count: raw?.seguidores_count || 0,
          seguindo_count: raw?.seguindo_count || 0,
          biografia: raw?.bio || raw?.biografia || "",
          pontos: raw?.pontos || 0,
          cidade: raw?.cidade || "",
          estado: raw?.estado || "",
        };

        try {
          const seguidos = await UsuariosSeguidos();

          const usuarioJaSegue = Array.isArray(seguidos)
            ? seguidos.some((u: any) => String(u.id) === String(userIdString))
            : false;

          setJaSegue(usuarioJaSegue);

          setJaSegue(usuarioJaSegue);
        } catch (e) {
          console.error("Erro ao verificar usuarios seguidos:", e);
        }
      }

      setPerfil(dados);
      setPosts(postsApi);
    } catch (err) {
      console.error("Erro ao carregar perfil:", err);
    } finally {
      setRefreshing(false);
    }
  }, [isMeuPerfil, userIdString]);

  useEffect(() => {
    carregarPerfil();
  }, [carregarPerfil]);

  const handleDelete = async () => {
    if (!postSelecionado?.id) return;
    await ExcluirPost(postSelecionado.id);
    carregarPerfil();
  };

  const handleToggleSeguir = async () => {
    if (!userIdString) return;
    if (segLoading) return;

    setSegLoading(true);
    try {
      if (jaSegue) {
        await PararDeSeguirUsuario(userIdString);
      } else {
        await SeguirUsuario(userIdString);
      }

      const seguidos = await UsuariosSeguidos();
      const usuarioJaSegue = Array.isArray(seguidos)
        ? seguidos.some((u: any) => String(u.id) === String(userIdString))
        : false;

      setJaSegue(usuarioJaSegue);
      setPerfil((prev: any) => {
        if (!prev) return prev;
        const prevCount = Number(prev.seguidores_count) || 0;
        return {
          ...prev,
          seguidores_count: usuarioJaSegue
            ? prevCount + (jaSegue ? 0 : 1)
            : prevCount - (jaSegue ? 1 : 0),
        };
      });
    } catch (err) {
      console.error("Erro ao seguir/desseguir:", err);
    } finally {
      setSegLoading(false);
    }
  };



  const formatarPostsParaGrid = (posts: any[]) => {
    const resto = posts.length % 3;
    if (resto === 0) return posts;
    const placeholders = Array.from({ length: 3 - resto }, (_, i) => ({
      id: `placeholder-${i}-${posts.length}`,
      placeholder: true,
    }));
    return [...posts, ...placeholders];
  };

  if (!perfil) {
    return (
      <View className="flex-1 items-center justify-center bg-neutral-800">
        <Text className="text-white">Carregando...</Text>
      </View>
    );
  }

  const Header = () => (
    <View className="w-full py-4 px-6 bg-neutral-800">



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
            {/* NOVO ONPRESS: ABRE O MODAL PARA SEGUIDORES */}
            <TouchableOpacity
              className="items-center"
              onPress={() => {
                setModalUsuariosTipo("seguidores");
                setModalUsuariosVisible(true);
              }}
            >
              <Text className="text-yellow-500 font-bold text-lg">
                {perfil.seguidores_count}
              </Text>
              <Text className="text-white text-sm">Seguidores</Text>
            </TouchableOpacity>

            {/* NOVO ONPRESS: ABRE O MODAL PARA SEGUINDO */}
            <TouchableOpacity
              className="items-center"
              onPress={() => {
                setModalUsuariosTipo("seguindo");
                setModalUsuariosVisible(true);
              }}
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
              onPress={() => {
                router.push("/configs")
                console.log("TOquei")

              }} // Usando rota absoluta, mais seguro
            >
              <Text className="text-white text-center text-lg">Editar Perfil</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className={`border-2 rounded-2xl mt-4 py-2 ${jaSegue ? "border-red-500 bg-red-500" : "border-yellow-500 bg-yellow-500"
                }`}
              onPress={handleToggleSeguir}
              disabled={segLoading}
            >
              {segLoading ? (
                <View className="flex-row items-center justify-center py-1 px-6">
                  <ActivityIndicator />
                  <Text className={`ml-2 ${jaSegue ? "text-white" : "text-black"}`}>
                    {jaSegue ? "Deixar de seguir" : "Seguir"}
                  </Text>
                </View>
              ) : (
                <Text
                  className={`text-center text-lg ${jaSegue ? "text-white" : "text-black"
                    }`}
                >
                  {jaSegue ? "Deixar de seguir" : "Seguir"}
                </Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>

      <Text className="text-white text-lg font-bold mt-4">{perfil.nome_completo}</Text>
      <Text className="text-neutral-400 text-sm">@{perfil.username}</Text>

      {perfil.cidade && perfil.estado && (
        <View className="flex-row mt-1 items-center">
          <MaterialCommunityIcons name="map-marker" size={16} color="gray" />
          <Text className="text-neutral-400 ml-1">
            {perfil.cidade}, {perfil.estado}
          </Text>
        </View>
      )}

      {perfil.biografia && (
        <Text className="text-neutral-300 mt-2">{perfil.biografia}</Text>
      )}

      {perfil.pontos !== undefined && (
        <View className="w-full mt-4 items-center">
          <TouchableOpacity className="flex-row items-center w-2/3 justify-between rounded-2xl border-2 border-yellow-500 bg-yellow-500 py-2 px-4">
            <MaterialCommunityIcons name="trophy" size={24} color="black" />
            <Text className="text-black font-semibold text-lg mx-2">
              {perfil.pontos.toFixed(0)}
            </Text>
            <MaterialCommunityIcons name="trophy" size={24} color="black" />
          </TouchableOpacity>
        </View>
      )}

      <View className="mt-6 mb-2 h-1 w-full rounded-full bg-neutral-700" />
    </View>
  );

  const renderPostItem = ({ item }: { item: any }) =>
    item.placeholder ? (
      <View className="flex-1" />
    ) : (
      <TouchableOpacity
        className="flex-1 mx-1"
        onPress={() => {
          setPostSelecionado(item);
          setDescricaoSelecionad(item.descricao);
          setModalPostVisible(true);
        }}
      >
        <Image
          source={{ uri: item.imagem }}
          className="rounded"
          style={{ width: "100%", aspectRatio: 1 }}
          resizeMode="cover"
        />
      </TouchableOpacity>
    );

  return (
    <View className="w-full h-full bg-neutral-800 py-safe">

      {isMeuPerfil ?
        <View className="px-4 pt-4 flex-row justify-between items-center">
          <Text className="text-white text-2xl font-bold">
            Meu Perfil
          </Text>
        </View>
        :
        <></>
      }


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
          onDelete={() => {
            Alert.alert("Apagar publicação", "Deseja realmente apagar sua publicação?", [
              { text: "Não", style: "cancel" },
              {
                text: "Sim",
                style: "destructive",
                onPress: async () => {
                  await handleDelete();
                  setModalPostVisible(false);
                },
              },
            ]);
          }}
          nome={perfil.username}
          foto_perfil={perfil.foto_perfil}
          comentario={descricaoSelecionado}
        />
      )}

      {/* NOVO COMPONENTE MODAL DE USUÁRIOS */}
      <UsuariosModal
        isVisible={modalUsuariosVisible}
        onClose={() => setModalUsuariosVisible(false)}
        tipo={modalUsuariosTipo}
        userId={userIdString} // Passa o ID do perfil sendo exibido
        onUpdate={carregarPerfil} // Recarrega o perfil se uma ação de seguir/deixar de seguir ocorrer no modal
      />

    </View>
  );

}