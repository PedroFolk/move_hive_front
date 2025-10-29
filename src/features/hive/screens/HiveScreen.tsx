import { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";

import {
  cancelarParticipacaoHive,
  decidirParticipanteHive,
  DeletarHive,
  ListarTodosHives,
  ParticiparHive,
} from "~/features/hive/api/hive";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { UsuarioAlheio } from "~/features/profile/api/user";
import HiveCreationModal from "../components/HiveCreationModal";

type HiveType = {
  id: string;
  titulo: string;
  esporte_nome: string;
  foto: string;
  participantes: { uri: string; id: string; username: string }[];
  pendentes: { uri: string; id: string; username: string }[];
  max_participantes: number;
  usuario_id: string;
  localizacao: string;
  data_hora: string;
  descricao: string;
  endereco: string;
  privado: boolean;
  observacoes: string;
};

export default function Hive() {
  const [hives, setHives] = useState<HiveType[]>([]);
  const [meuUsuarioId, setMeuUsuarioId] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [modalVisible, setModalVisible] = useState(false);
  const [hiveToEdit, setHiveToEdit] = useState<HiveType | undefined>(undefined);
  const [refreshing, setRefreshing] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [loadingHiveId, setLoadingHiveId] = useState<string | null>(null);
  
  // Novo estado para controlar o carregamento inicial do ID do usuário
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const TYPES = ["Pendentes", "Todos", "Participando", "Solicitado", "Meus"];

  // EFEITO 1: Apenas para buscar e definir o ID do usuário
  useEffect(() => {
    function decodeToken(token: string) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return String(payload.user_id);
      } catch (e) {
        console.error("Erro ao decodificar o token:", e);
        return null;
      }
    }
    
    (async () => {
      setIsLoadingUser(true);
      const token = await SecureStore.getItemAsync("token");
      const userId = decodeToken(token!);
      if (userId) {
        setMeuUsuarioId(userId);
      }
      setIsLoadingUser(false);
    })();
  }, []); // Roda apenas uma vez

  // EFEITO 2: Roda QUANDO 'meuUsuarioId' é definido
  useEffect(() => {
    if (meuUsuarioId) {
      loadHives(meuUsuarioId);
    }
  }, [meuUsuarioId]); // Depende de 'meuUsuarioId'

  const loadHives = async (userId: string) => {
    setRefreshing(true); // Ativa o spinner
    try {
      const result = await ListarTodosHives();

      if (!Array.isArray(result)) {
        console.warn("⚠️ ListarTodosHives não retornou um array:", result);
        setHives([]);
        return;
      }

      const mapped = await Promise.all(
        result.map(async (h: any) => {
          const participantes = Array.isArray(h.participantes)
            ? h.participantes
            : [];
          const pendentes = Array.isArray(h.pendentes) ? h.pendentes : [];

          const participantesComFoto = await Promise.all(
            participantes.map(async (p: string) => {
              if (!p) {
                console.warn("ID de participante inválido (null/undefined) encontrado.");
                return {
                  uri: "https://via.placeholder.com/150",
                  id: "invalid_id_" + Math.random(),
                  username: "Erro",
                };
              }
              try {
                const usuario = await UsuarioAlheio(p);
                return {
                  uri: usuario?.foto_perfil || "https://via.placeholder.com/150",
                  username: usuario?.username || "Placeholder",
                  id: p,
                };
              } catch (err) {
                console.error(`Falha ao buscar perfil para ID: ${p}`, err);
                return {
                  uri: "https://via.placeholder.com/150",
                  id: p,
                  username: "Usuário",
                };
              }
            })
          );

          const pendentesComFoto = await Promise.all(
            pendentes.map(async (p: string) => {
              if (!p) {
                console.warn("ID de pendente inválido (null/undefined) encontrado.");
                return {
                  uri: "https://via.placeholder.com/150",
                  id: "invalid_id_" + Math.random(),
                  username: "Erro",
                };
              }
              try {
                const usuario = await UsuarioAlheio(p);
                return {
                  uri: usuario?.foto_perfil || "https://via.placeholder.com/150",
                  username: usuario?.username || "Placeholder",
                  id: p,
                };
              } catch (err) {
                console.error(`Falha ao buscar perfil para ID pendente: ${p}`, err);
                return {
                  uri: "https://via.placeholder.com/150",
                  id: p,
                  username: "Usuário",
                };
              }
            })
          );

          return {
            ...h,
            participantes: participantesComFoto,
            pendentes: pendentesComFoto,
          };
        })
      );

      setHives(mapped);
      const count = mapped.filter(
        (h) => h.usuario_id === userId && (h.pendentes?.length ?? 0) > 0
      ).length;
      setPendingCount(count);
    } catch (err) {
      console.error("Erro ao carregar hives:", err);
    }
    setRefreshing(false); // Desativa o spinner
  };

  const onRefresh = async () => {
    if (!meuUsuarioId) return;
    await loadHives(meuUsuarioId);
  };

  const currentData = hives.filter((hive) => {
    // Esta guarda agora funciona, pois o filtro só roda
    // depois que 'meuUsuarioId' está preenchido
    if (!meuUsuarioId) return false; 

    const participantes = hive.participantes || [];
    const pendentes = hive.pendentes || [];

    const isDono = hive.usuario_id === meuUsuarioId;
    const isParticipando = participantes.some((p) => p.id === meuUsuarioId);
    const isPendente = pendentes.some((p) => p.id === meuUsuarioId);

    switch (selectedCategory) {
      case "Meus":
        return isDono;
      case "Participando":
        return isParticipando;
      case "Solicitado":
        return isPendente;
      case "Pendentes":
        return hive.usuario_id === meuUsuarioId && pendentes.length > 0;
      case "Todos":
      default:
        return !isDono && !isParticipando && !isPendente;
    }
  });

  const handleParticipate = async (hive: HiveType) => {
    if (hive.participantes?.some((p) => p.id === meuUsuarioId)) return;
    try {
      setLoadingHiveId(hive.id);
      await ParticiparHive(hive.id);
      await loadHives(meuUsuarioId);
      setSelectedCategory("Participando");
    } catch (error) {
      console.error("Erro ao participar do hive:", error);
    } finally {
      setLoadingHiveId(null);
    }
  };

  const handleCancelParticipation = async (hive: HiveType) => {
    Alert.alert("Cancelar participação", "Deseja sair deste Hive?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          try {
            await cancelarParticipacaoHive(hive.id);
            setHives((prev) =>
              prev.map((h) =>
                h.id === hive.id
                  ? {
                    ...h,
                    participantes: (h.participantes || []).filter(
                      (p) => p.id !== meuUsuarioId
                    ),
                  }
                  : h
              )
            );
          } catch (error) {
            console.error("Erro ao cancelar participação:", error);
          }
        },
      },
    ]);
  };

  const handleCancelRequest = async (hive: HiveType) => {
    Alert.alert("Cancelar solicitação", "Deseja cancelar o pedido?", [
      { text: "Não", style: "cancel" },
      {
        text: "Sim",
        style: "destructive",
        onPress: async () => {
          try {
            await cancelarParticipacaoHive(hive.id);
            setHives((prev) =>
              prev.map((h) =>
                h.id === hive.id
                  ? {
                    ...h,
                    pendentes: (h.pendentes || []).filter(
                      (p) => p.id !== meuUsuarioId
                    ),
                  }
                  : h
              )
            );
          } catch (error) {
            console.error("Erro ao cancelar solicitação:", error);
          }
        },
      },
    ]);
  };

  const handleAccept = async (hiveId: string, participanteId: string) => {
    try {
      await decidirParticipanteHive(hiveId, participanteId, "aceitar");
      await loadHives(meuUsuarioId);
      Alert.alert("Sucesso", "Solicitação aprovada.");
    } catch (error) {
      console.error("Erro ao aprovar solicitação:", error);
    }
  };

  const handleReject = async (hiveId: string, participanteId: string) => {
    try {
      await decidirParticipanteHive(hiveId, participanteId, "recusar");
      await loadHives(meuUsuarioId);
      Alert.alert("Sucesso", "Solicitação recusada.");
    } catch (error) {
      console.error("Erro ao recusar solicitação:", error);
    }
  };

  const handleDelete = (hiveId: string) => {
    Alert.alert("Excluir Hive", "Deseja realmente deletar este Hive?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Deletar",
        style: "destructive",
        onPress: async () => {
          try {
            await DeletarHive(hiveId);
            setHives((prev) => prev.filter((h) => h.id !== hiveId));
          } catch (error) {
            console.error("Erro ao deletar hive:", error);
            Alert.alert("Erro", "Não foi possível deletar o Hive. Tente novamente.");
          }
        },
      },
    ]);
  };

  const handleEdit = (hive: HiveType) => {
    setHiveToEdit(hive);
    setModalVisible(true);
  };

  const handleSaveHive = async () => {
    await loadHives(meuUsuarioId);
    setModalVisible(false);
    setHiveToEdit(undefined);
  };

  const handleCreate = () => {
    setHiveToEdit(undefined);
    setModalVisible(true);
  };

  const irParaPerfil = (usuario_id: string) => {
    router.push({ pathname: "/profile", params: { userId: usuario_id } });
  };

  const renderItem = ({ item }: { item: HiveType }) => {
    const participantes = item.participantes || [];
    const pendentes = item.pendentes || [];

    const isDono = item.usuario_id === meuUsuarioId;
    const isParticipando = participantes.some((p) => p.id === meuUsuarioId);
    const isPendente = pendentes.some((p) => p.id === meuUsuarioId);

    if (selectedCategory === "Pendentes") {
      return (
        <View className="bg-neutral-900 rounded-xl p-3 mx-2 mt-2">
          <View className="flex-row items-center space-x-3 mb-4">
            <Image
              source={{ uri: item.foto }}
              className="w-16 h-16 rounded-lg"
              resizeMode="cover"
            />
            <View className="flex-1 ml-4">
              <Text className="text-white font-bold text-lg">{item.titulo}</Text>
              <Text className="text-gray-400">{item.esporte_nome}</Text>
            </View>
          </View>

          <View className="border-t border-neutral-700 pt-3">
            <Text className="text-gray-300 font-bold mb-2">
              Solicitações ({pendentes.length})
            </Text>
            {pendentes.map((p) => (
              <TouchableOpacity
                activeOpacity={100}
                key={p.id}
                className="flex-row items-center justify-between my-2 bg-neutral-800 p-3 rounded-lg"
                onPress={() => irParaPerfil(p.id)}
              >
                <View className="flex-row items-center">
                  {p.uri && !p.uri.includes("placeholder") ? (
                    <Image
                      source={{ uri: p.uri }}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <View className="w-10 h-10 rounded-full bg-neutral-600 justify-center items-center">
                      <Text className="text-white font-bold text-lg">
                        {p.username ? p.username[0].toUpperCase() : "U"}
                      </Text>
                    </View>
                  )}
                  <Text className="text-white ml-3 font-medium">
                    {p.username}
                  </Text>
                </View>
                <View className="flex-row items-center ">
                  <TouchableOpacity
                    onPress={() => handleReject(item.id, p.id)}
                    className="p-2 rounded-full bg-red-500"
                  >
                    <MaterialIcons name="close" size={22} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleAccept(item.id, p.id)}
                    className="p-2 bg-yellow-500 rounded-full ml-4"
                  >
                    <MaterialIcons name="check" size={22} color="#000" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      );
    }

    const handlePressCard = () => {
      if (isDono || isParticipando) {
        router.push({ pathname: "/chat", params: { userId: item.id } });
      }
    };

    return (
      <TouchableOpacity
        className="flex-row bg-neutral-900 rounded-xl p-3 mx-2 items-center mt-2 "
        activeOpacity={0.9}
        onPress={handlePressCard}
        disabled={!(isDono || isParticipando)}
      >
        <Image
          source={{ uri: item.foto }}
          className="w-24 h-24 rounded-lg"
          resizeMode="cover"
        />

        <View className="flex-1 ml-3 space-y-1">
          <Text className="text-white font-bold mb-1">{item.titulo}</Text>
          <Text className="text-gray-300">{item.esporte_nome}</Text>
          <Text className="text-gray-300">{item.localizacao}</Text>

          <View className="flex-row mt-2 items-center">
            {participantes.slice(0, 5).map((p) => (
              <TouchableOpacity key={p.id} onPress={() => irParaPerfil(p.id)}>
                {p.uri && !p.uri.includes("placeholder") ? (
                  <Image
                    source={{ uri: p.uri }}
                    className="w-8 h-8 rounded-full border-2 border-neutral-800 -ml-2"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="w-8 h-8 rounded-full bg-neutral-600 justify-center items-center border-2 border-neutral-800 -ml-2">
                    <Text className="text-white font-bold text-xs">
                      {p.username ? p.username[0].toUpperCase() : "U"}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}

            <Text className="text-gray-400 ml-2">
              {participantes.length}/{item.max_participantes}
            </Text>
          </View>
        </View>

        <View className="ml-2">
          {isDono && selectedCategory === "Meus" ? (
            <View className="flex justify-between flex-1">
              <TouchableOpacity
                className="p-2 bg-red-600 rounded-full"
                onPress={() => handleDelete(item.id)}
              >
                <MaterialIcons name="delete" size={22} color="white" />
              </TouchableOpacity>

              <TouchableOpacity
                className="p-2 bg-yellow-500 rounded-full"
                onPress={() => handleEdit(item)}
              >
                <MaterialIcons name="edit" size={22} color="black" />
              </TouchableOpacity>
            </View>
          ) : isParticipando ? (
            <TouchableOpacity
              className="p-2 bg-red-500 rounded-full"
              onPress={() => handleCancelParticipation(item)}
            >
              <MaterialIcons name="close" size={22} color="white" />
            </TouchableOpacity>
          ) : isPendente ? (
            <TouchableOpacity
              className="p-2 bg-gray-600 rounded-full"
              onPress={() => handleCancelRequest(item)}
            >
              <MaterialCommunityIcons
                name="clock-outline"
                size={22}
                color="white"
              />
            </TouchableOpacity>
          ) : !isDono ? (
            <TouchableOpacity
              disabled={loadingHiveId === item.id}
              className={`p-2 rounded-full ${item.privado ? "bg-blue-500" : "bg-yellow-500 "
                } ${loadingHiveId === item.id ? "opacity-50" : ""}`}
              onPress={() => {
                if (item.privado) {
                  Alert.alert("Hive privado", "Deseja pedir para participar?", [
                    { text: "Cancelar", style: "cancel" },
                    {
                      text: "Pedir",
                      onPress: async () => {
                        try {
                          setLoadingHiveId(item.id);
                          await ParticiparHive(item.id);
                          await loadHives(meuUsuarioId);
                          setSelectedCategory("Solicitado");
                          Alert.alert("Solicitação enviada com sucesso!");
                        } catch (error) {
                          console.error("Erro ao solicitar participação:", error);
                          Alert.alert("Erro ao solicitar participação.");
                        } finally {
                          setLoadingHiveId(null);
                        }
                      },
                    },
                  ]);
                } else {
                  handleParticipate(item);
                }
              }}
            >
              {loadingHiveId === item.id ? (
                <ActivityIndicator color="white" size="small" />
              ) : item.privado ? (
                <MaterialCommunityIcons name="lock-outline" size={22} color="white" />
              ) : (
                <MaterialCommunityIcons name="account-plus" size={22} color="black" />
              )}
            </TouchableOpacity>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  // Se estiver carregando o ID do usuário, mostre um loading central
  if (isLoadingUser) {
    return (
        <View className="flex-1 bg-neutral-800 py-safe items-center justify-center">
             <ActivityIndicator size="large" color="#eab308" />
        </View>
    );
  }

  return (
    <View className="flex-1 bg-neutral-800 py-safe">
      <View className="px-4 pt-4 flex-row justify-between items-center">
        <Text className="text-white text-2xl font-bold">HIVE</Text>
        <View className="flex-row">
          <TouchableOpacity
            onPress={handleCreate}
            className="z-50 bg-neutral-900 p-2 rounded-full "
          >
            <Ionicons name="add" size={28} color="#eab308" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/chat")}
            className="z-50 p-2 rounded-full ml-4"
          >
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={28}
              color="#eab308"
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-4 mt-4 max-h-12"
      >
        {TYPES.map((cat) => {
          const categoryName =
            cat === "Pendentes" && pendingCount > 0
              ? `Pendentes (${pendingCount})`
              : cat;
          return (
            <TouchableOpacity
              activeOpacity={100}
              key={cat}
              onPress={() => setSelectedCategory(cat)}
              className={`mb-2 mr-2 px-6 h-10 justify-center items-center rounded-full border ${selectedCategory === cat
                  ? "bg-white border-transparent"
                  : "bg-neutral-800 border-gray-500 border-2"
                }`}
            >
              <Text
                className={`text-sm font-medium ${selectedCategory === cat ? "text-black" : "text-gray-300"
                  }`}
              >
                {categoryName}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <FlatList
        data={currentData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        initialNumToRender={5}
        windowSize={10}
        className="mb-10 "
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#fff"
            colors={["#FFD700"]}
          />
        }
      />

      <HiveCreationModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setHiveToEdit(undefined);
        }}
        onSave={handleSaveHive}
        hiveToEdit={hiveToEdit}
      />
    </View>
  );
}