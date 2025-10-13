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
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";

import {
  cancelarParticipacaoHive,
  decidirParticipanteHive,
  DeletarHive,
  ListarTodosHives,
  ParticiparHive,
} from "~/api/hive";
import { UsuarioAlheio } from "~/api/user";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import HiveCreationModal from "~/components/modals/modalHive";

type HiveType = {
  id: string;
  titulo: string;
  esporte_nome: string;
  foto: string;
  participantes: {
    [x: string]: any;
    uri: string;
    id: string;
  }[];
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

  const TYPES = ["Pendentes", "Todos", "Participando", "Solicitado", "Meus"];

  useEffect(() => {
    (async () => {
      const userId = await SecureStore.getItemAsync("userId");
      if (userId) {
        setMeuUsuarioId(userId);
        await loadHives(userId);
      }
    })();
  }, []);

  const loadHives = async (userId: string) => {
    const result = await ListarTodosHives();

    const mapped = await Promise.all(
      result.map(async (h: any) => {
        const participantesComFoto = await Promise.all(
          h.participantes.map(async (p: string) => {
            try {
              const usuario = await UsuarioAlheio(p);

              return {
                uri: usuario?.foto_perfil || "https://via.placeholder.com/150",
                username: usuario?.username || "Placeholder",
                id: p,
              };
            } catch {
              return {
                uri: "https://via.placeholder.com/150",
                id: p,
                username: "Usuário",
              };
            }
          })
        );

        const pendentesComFoto = await Promise.all(
          (h.pendentes || []).map(async (p: string) => {
            try {
              const usuario = await UsuarioAlheio(p);
              return {
                uri: usuario?.foto_perfil || "https://via.placeholder.com/150",
                username: usuario?.username || "Placeholder",
                id: p,
              };
            } catch {
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
      (h) => h.usuario_id === userId && h.pendentes?.length > 0
    ).length;
    setPendingCount(count);
  };

  const onRefresh = async () => {
    if (!meuUsuarioId) return;
    setRefreshing(true);
    await loadHives(meuUsuarioId);
    setRefreshing(false);
  };

  const currentData = hives.filter((hive) => {
    if (!meuUsuarioId) return true;

    if (selectedCategory === "Meus") {
      return hive.usuario_id === meuUsuarioId;
    }

    if (selectedCategory === "Participando") {
      return (
        hive.usuario_id !== meuUsuarioId &&
        hive.participantes.some((p) => p.id === meuUsuarioId)
      );
    }

    if (selectedCategory === "Solicitado") {
      return (
        hive.usuario_id !== meuUsuarioId &&
        hive.pendentes?.some((p) => p.id === meuUsuarioId)
      );
    }

    if (selectedCategory === "Todos") {
      return (
        hive.usuario_id !== meuUsuarioId &&
        !hive.participantes.some((p) => p.id === meuUsuarioId) &&
        !hive.pendentes?.some((p) => p.id === meuUsuarioId)
      );
    }

    if (selectedCategory === "Pendentes") {
      return hive.usuario_id === meuUsuarioId && hive.pendentes?.length > 0;
    }

    return true;
  });

  const handleParticipate = async (hive: HiveType) => {
    if (hive.participantes.some((p) => p.id === meuUsuarioId)) return;

    try {
      await ParticiparHive(hive.id);
      setHives((prev) =>
        prev.map((h) =>
          h.id === hive.id
            ? {
                ...h,
                pendentes: [
                  ...h.pendentes,
                  {
                    id: meuUsuarioId,
                    uri: "https://via.placeholder.com/150",
                    username: "Você",
                  },
                ],
              }
            : h
        )
      );
    } catch (error) {
      console.error("Erro ao participar do hive:", error);
    }
  };

  const handleCancelParticipation = async (hive: HiveType) => {
    Alert.alert(
      "Cancelar participação",
      "Tem certeza que deseja sair deste Hive?",
      [
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
                        participantes: h.participantes.filter(
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
      ]
    );
  };

  const handleCancelRequest = async (hive: HiveType) => {
    Alert.alert(
      "Cancelar solicitação",
      "Deseja realmente cancelar seu pedido de participação?",
      [
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
                        pendentes: h.pendentes.filter(
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
      ]
    );
  };

  const handleAccept = (hiveId: string, participanteId: string) => {
    Alert.alert(
      "Aprovar participante",
      "Deseja realmente aprovar esta solicitação?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Aprovar",
          onPress: async () => {
            try {
              await decidirParticipanteHive(hiveId, participanteId, "aceitar");
              await loadHives(meuUsuarioId);
              Alert.alert("Sucesso", "Solicitação aprovada.");
            } catch (error) {
              console.error("Erro ao aprovar solicitação:", error);
              Alert.alert("Erro", "Não foi possível aprovar a solicitação.");
            }
          },
        },
      ]
    );
  };

  const handleReject = (hiveId: string, participanteId: string) => {
    Alert.alert(
      "Recusar participante",
      "Deseja realmente recusar esta solicitação?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Recusar",
          onPress: async () => {
            try {
              await decidirParticipanteHive(hiveId, participanteId, "recusar");
              await loadHives(meuUsuarioId);
              Alert.alert("Sucesso", "Solicitação recusada.");
            } catch (error) {
              console.error("Erro ao recusar solicitação:", error);
              Alert.alert("Erro", "Não foi possível recusar a solicitação.");
            }
          },
        },
      ]
    );
  };

  const handleDelete = (hiveId: string) => {
    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja deletar este Hive?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Deletar",
          style: "destructive",
          onPress: async () => {
            try {
              await DeletarHive(hiveId);
              setHives((prev) => prev.filter((h) => h.id !== hiveId));
            } catch (error) {
              console.error("Erro ao deletar o hive:", error);
            }
          },
        },
      ]
    );
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
    router.push({
      pathname: "/profile",
      params: { userId: usuario_id },
    });
  };

  const renderItem = ({ item }: { item: HiveType }) => {
    const isDono = item.usuario_id === meuUsuarioId;
    const isParticipando = item.participantes.some(
      (p) => p.id === meuUsuarioId
    );
    const isPendente = item.pendentes?.some((p) => p.id === meuUsuarioId);

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
              <Text className="text-white font-bold text-lg">
                {item.titulo}
              </Text>
              <Text className="text-gray-400">{item.esporte_nome}</Text>
            </View>
          </View>

          <View className="border-t border-neutral-700 pt-3">
            <Text className="text-gray-300 font-bold mb-2">
              Solicitações ({item.pendentes.length})
            </Text>
            {item.pendentes.map((p) => (
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
        router.push({
          pathname: "/chat",
          params: { userId: item.id },
        });
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
            {item.participantes.slice(0, 5).map((p) =>
              p.uri && !p.uri.includes("placeholder") ? (
                <TouchableOpacity key={p.id} onPress={() => irParaPerfil(p.id)}>
                  <Image
                    source={{ uri: p.uri }}
                    className="w-8 h-8 rounded-full border-2 border-neutral-800 -ml-2"
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity key={p.id} onPress={() => irParaPerfil(p.id)}>
                  <View className="w-8 h-8 rounded-full bg-neutral-600 justify-center items-center border-2 border-neutral-800 -ml-2">
                    <Text className="text-white font-bold text-xs">
                      {p.username ? p.username[0].toUpperCase() : "U"}
                    </Text>
                  </View>
                </TouchableOpacity>
              )
            )}

            <Text className="text-gray-400 ml-2">
              {item.participantes.length}/{item.max_participantes}
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
              className={`p-2 rounded-full ${
                item.privado ? "bg-blue-500" : "bg-yellow-500 animate-pulse"
              }`}
              onPress={() => {
                if (item.privado) {
                  Alert.alert("Hive privado", "Deseja pedir para participar?", [
                    { text: "Cancelar", style: "cancel" },
                    {
                      text: "Pedir",
                      onPress: async () => {
                        try {
                          await ParticiparHive(item.id);
                          Alert.alert("Solicitação enviada com sucesso!");
                        } catch (error) {
                          console.error(
                            "Erro ao solicitar participação:",
                            error
                          );
                          Alert.alert("Erro ao solicitar participação.");
                        }
                      },
                    },
                  ]);
                } else {
                  handleParticipate(item);
                }
              }}
            >
              {item.privado ? (
                <MaterialCommunityIcons
                  name="lock-outline"
                  size={22}
                  color="white"
                />
              ) : (
                <MaterialCommunityIcons
                  name="account-plus"
                  size={22}
                  color="black"
                />
              )}
            </TouchableOpacity>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

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
            onPress={
()=>router.push("/chat")
            }
            className="z-50 p-2 rounded-full ml-4"
          >
            <Ionicons name="chatbubble-ellipses-outline" size={28} color="#eab308" />
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
              className={`mb-2 mr-2 px-6 h-10 justify-center items-center rounded-full border ${
                selectedCategory === cat
                  ? "bg-white border-transparent"
                  : "bg-neutral-800 border-gray-500 border-2"
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  selectedCategory === cat ? "text-black" : "text-gray-300"
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
