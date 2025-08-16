import { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
  LayoutAnimation,
  Alert,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import EventCreationModal from "../components/modalEvents";
import AddButton from "../components/addButton";
import {
  CancelarParticipacao,
  DeletarEvento,
  ListarMeusEventos,
  ListarTodosEventos,
  ListarTodosTorneios,
  ParticiparEvento,
} from "~/api/event";

interface Event {
  id?: string;
  title: string;
  sport: string;
  description: string;
  dateString: string;
  city: string;
  state: string;
  hourString: string;
  maxParticipants: number;
  isTournament: boolean;
  isPrivate: boolean;
  imageUri?: string;
  participantes?: { id: string }[];
}

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [tournaments, setTournaments] = useState<Event[]>([]);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("Eventos");
  const [userId, setUserId] = useState<string | null>(null);

  const TYPES = ["Eventos", "Torneios", "Meus Eventos"];

  const mapEventData = (data: any[]): Event[] =>
    data.map((ev) => {
      let city = "";
      let state = "";
      if (ev.localizacao?.includes(",")) {
        const parts = ev.localizacao.split(",").map((p: string) => p.trim());
        city = parts[0] || "";
        state = parts[1] || "";
      }
      const dateObj = new Date(ev.data_hora);
      return {
        id: ev.id,
        title: ev.titulo,
        sport: ev.esporte_nome,
        description: ev.descricao,
        dateString: dateObj.toLocaleDateString("pt-BR"),
        city,
        state,
        hourString: dateObj.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
        maxParticipants: ev.max_participantes,
        isTournament: !!ev.torneio,
        isPrivate: !!ev.privado,
        imageUri: ev.foto,
        participantes: ev.participantes?.map((id: string) => ({ id })) || [],
      };
    });

  const fetchData = async () => {
    if (selectedCategory === "Eventos") {
      const data = await ListarTodosEventos();
      if (data) setEvents(mapEventData(data));
    } else if (selectedCategory === "Torneios") {
      const data = await ListarTodosTorneios();
      if (data) setTournaments(mapEventData(data));
    } else if (selectedCategory === "Meus Eventos") {
      const data = await ListarMeusEventos();
      if (data) setEvents(mapEventData(data));
    }
  };

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedCardId((prev) => (prev === id ? null : id));
  };

  const addParticipant = (eventId: string) => {
    setEvents((prev) =>
      prev.map((ev) =>
        ev.id === eventId
          ? { ...ev, participantes: [...(ev.participantes || []), { id: userId! }] }
          : ev
      )
    );
    setTournaments((prev) =>
      prev.map((t) =>
        t.id === eventId
          ? { ...t, participantes: [...(t.participantes || []), { id: userId! }] }
          : t
      )
    );
  };

  const handleDelete = (id: string) => {
    Alert.alert("Confirmar exclusão", "Deseja realmente excluir este evento?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          const result = await DeletarEvento(id);
          if (result) {
            if (selectedCategory === "Eventos" || selectedCategory === "Meus Eventos") {
              setEvents((prev) => prev.filter((ev) => ev.id !== id));
            } else {
              setTournaments((prev) => prev.filter((t) => t.id !== id));
            }
            Alert.alert("Sucesso", "Evento deletado com sucesso!");
          } else {
            Alert.alert("Erro", "Não foi possível deletar o evento.");
          }
        },
      },
    ]);
  };


  useEffect(() => {
    fetchData();
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem("userId");
      setUserId(id);
    };
    fetchUserId();
  }, [selectedCategory]);

  const renderEventCard = ({ item }: { item: Event }) => {
    const open = item.id === expandedCardId;
    const isParticipated = userId ? item.participantes?.some((p) => p.id === userId) ?? false : false;

    return (
      <View className="bg-neutral-900 rounded-2xl mb-4 overflow-hidden shadow-lg">
        <TouchableOpacity onPress={() => toggleExpand(item.id!)} activeOpacity={0.8}>
          {item.imageUri ? (
            <Image source={{ uri: item.imageUri }} className="w-full h-40" resizeMode="cover" />
          ) : (
            <View className="w-full h-40 bg-gray-700 justify-center items-center">
              <MaterialIcons name="image" size={48} color="#9ca3af" />
            </View>
          )}
        </TouchableOpacity>

        <View className="p-4">
          <View className="flex-row justify-between items-start">
            <Text className="text-white text-lg font-bold flex-1 pr-2">{item.title}</Text>
            <TouchableOpacity onPress={() => handleDelete(item.id!)}>
              <MaterialIcons name="delete" size={24} color="#ef4444" />
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center mt-2">
            <MaterialIcons name="access-time" size={16} color="#fbbf24" />
            <Text className="text-gray-300 text-sm ml-1">{item.hourString}</Text>
          </View>

          <View className="flex-row items-center mt-1">
            <MaterialIcons name="place" size={16} color="#3b82f6" />
            <Text className="text-gray-300 text-sm ml-1">{item.state},{item.city}</Text>
          </View>

          <Text className="text-gray-400 text-sm mt-1">{item.dateString}</Text>

          {open && (
            <View className="mt-3 border-t border-gray-700 pt-3">
              <Text className="text-gray-200 text-sm">{item.description}</Text>

              <TouchableOpacity
                className={`mt-3 py-2 rounded-full ${isParticipated ? "bg-white" : "bg-yellow-500"}`}
                onPress={async () => {
                  if (!item.id) return;

                  if (!isParticipated) {
                    const result = await ParticiparEvento(item.id);
                    if (result && userId) {
                      Alert.alert("Sucesso", "Inscrição realizada com sucesso!");
                      addParticipant(item.id);
                    } else {
                      Alert.alert("Erro", "Não foi possível se inscrever no evento.");
                    }
                  } else {
                    Alert.alert(
                      "Cancelar participação",
                      "Deseja realmente cancelar sua participação neste evento?",
                      [
                        { text: "Não", style: "cancel" },
                        {
                          text: "Sim",
                          style: "destructive",
                          onPress: async () => {
                            const result = await CancelarParticipacao(item.id!);
                            if (result && userId) {
                              Alert.alert("Sucesso", "Participação cancelada!");
                              setEvents((prev) =>
                                prev.map((ev) =>
                                  ev.id === item.id
                                    ? { ...ev, participantes: ev.participantes?.filter((p) => p.id !== userId) || [] }
                                    : ev
                                )
                              );
                              setTournaments((prev) =>
                                prev.map((t) =>
                                  t.id === item.id
                                    ? { ...t, participantes: t.participantes?.filter((p) => p.id !== userId) || [] }
                                    : t
                                )
                              );
                            } else {
                              Alert.alert("Erro", "Não foi possível cancelar a participação.");
                            }
                          },
                        },
                      ]
                    );
                  }
                }}
              >
                <Text className={`text-center font-semibold ${isParticipated ? "text-black" : "text-black"}`}>
                  {isParticipated ? "Já inscrito" : "Inscreva-se"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  const handleSave = (event: Event) => {
    if (selectedCategory === "Eventos" || selectedCategory === "Meus Eventos") {
      setEvents((prev) => [event, ...prev]);
    } else {
      setTournaments((prev) => [event, ...prev]);
    }
    setShowModal(false);
  };

  const handleCancel = () => setShowModal(false);

  return (
    <SafeAreaView className="h-full w-full">
      <View className="px-4 pt-4 flex-row justify-between items-center">
        <Text className="text-white text-2xl font-bold">
          {selectedCategory === "Eventos" ? "Eventos" : selectedCategory === "Torneios" ? "Torneios" : "Meus Eventos"}
        </Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4 mt-4 max-h-14">
        {TYPES.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setSelectedCategory(cat)}
            className={`mr-2 px-6 h-10 justify-center items-center rounded-full border ${selectedCategory === cat ? "bg-white border-transparent" : "border-gray-500 border-2"
              }`}
          >
            <Text className={`text-sm font-medium ${selectedCategory === cat ? "text-black" : "text-gray-300"}`}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text className="text-white text-xl font-bold p-4">
        {selectedCategory === "Eventos" ? "Proximos Eventos" : selectedCategory === "Torneios" ? "Proximos Torneios" : "Meus Eventos"}
      </Text>

      <View className="flex-1 px-4">
        <FlatList
          data={selectedCategory === "Eventos" || selectedCategory === "Meus Eventos" ? events : tournaments}
          keyExtractor={(item, index) => item.id ? item.id : `event-${index}`}
          renderItem={renderEventCard}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 120 }}
          ListEmptyComponent={() => (
            <View className="flex-1 justify-center items-center">
              <Text className="text-white text-lg">
                {selectedCategory === "Eventos" ? "Nenhum evento cadastrado" : "Nenhum torneio disponível"}
              </Text>
            </View>
          )}
        />
      </View>

      <AddButton onPress={() => setShowModal(true)} />

      <EventCreationModal visible={showModal} onClose={handleCancel} defaultSport={""} onSave={handleSave} />
    </SafeAreaView>
  );
}
