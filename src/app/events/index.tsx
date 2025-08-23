import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import AddButton from "../components/addButton";
import EventCreationModal from "../components/modalEvents";

import {
  ListarTodosEventos,
  ListarTodosTorneios,
  ListarMeusEventos,
  ParticiparEvento,
  CancelarParticipacao,
  DeletarEvento,
} from "~/api/event";
import EventCard from "../components/eventCard";

interface Event {
  id?: any;
  title: string;
  sport: string;
  description: string;
  dateString: string;
  city: string;
  state: string;
  hourString: string;
  maxParticipants?: number;
  isTournament?: boolean;
  isPrivate?: boolean;
  imageUri?: string;
  participantes?: { id: string }[];
}

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [tournaments, setTournaments] = useState<Event[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("Eventos");
  const [userId, setUserId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const TYPES = ["Eventos", "Torneios", "Meus Eventos"];

  const fetchUserId = async () => {
    const id = await AsyncStorage.getItem("userId");
    setUserId(id);
  };

  const mapEventData = (data: any[]): Event[] =>
    data.map((ev) => {
      const [city = "", state = ""] = ev.localizacao?.split(",").map((s: string) => s.trim()) || [];
      const dateObj = new Date(ev.data_hora);
      return {
        id: ev.id,
        title: ev.titulo,
        sport: ev.esporte_nome,
        description: ev.descricao,
        dateString: dateObj.toLocaleDateString("pt-BR"),
        hourString: dateObj.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
        city,
        state,
        maxParticipants: ev.max_participantes,
        isTournament: !!ev.torneio,
        isPrivate: !!ev.privado,
        imageUri: ev.foto,
        participantes: ev.participantes?.map((id: string) => ({ id })) || [],
      };
    });

  const fetchData = useCallback(async () => {
    setRefreshing(true);
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
    setRefreshing(false);
  }, [selectedCategory]);

  useEffect(() => {
    fetchUserId();
    fetchData();
  }, [selectedCategory]);

  const handleParticipation = async (event: Event) => {
    if (!event.id || !userId) return;
    const isParticipated = event.participantes?.some((p) => p.id === userId);

    if (!isParticipated) {
      const result = await ParticiparEvento(event.id);
      if (result) {
        Alert.alert("Sucesso", "Inscrição realizada!");
        updateParticipants(event.id, true);
      } else Alert.alert("Erro", "Não foi possível se inscrever.");
    } else {
      Alert.alert(
        "Cancelar participação",
        "Deseja realmente cancelar sua participação?",
        [
          { text: "Não", style: "cancel" },
          {
            text: "Sim",
            style: "destructive",
            onPress: async () => {
              const result = await CancelarParticipacao(event.id!);
              if (result) {
                Alert.alert("Sucesso", "Participação cancelada!");
                updateParticipants(event.id, false);
              } else Alert.alert("Erro", "Não foi possível cancelar.");
            },
          },
        ]
      );
    }
  };

  const updateParticipants = (eventId: string, add: boolean) => {
    const update = (list: Event[]) =>
      list.map((ev) =>
        ev.id === eventId
          ? {
            ...ev,
            participantes: add
              ? [...(ev.participantes || []), { id: userId! }]
              : ev.participantes?.filter((p) => p.id !== userId) || [],
          }
          : ev
      );

    setEvents((prev) => update(prev));
    setTournaments((prev) => update(prev));
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
            setEvents((prev) => prev.filter((ev) => ev.id !== id));
            setTournaments((prev) => prev.filter((t) => t.id !== id));
            Alert.alert("Sucesso", "Evento deletado com sucesso!");
          } else {
            Alert.alert("Erro", "Não foi possível deletar o evento.");
          }
        },
      },
    ]);
  };
  const handleParticipate = async (item: Event) => {
    if (!item.id || !userId) return;

    const isParticipated = item.participantes?.some(p => p.id === userId);

    if (!isParticipated) {
      const result = await ParticiparEvento(item.id);
      if (result) {
        setEvents(prev => prev.map(ev =>
          ev.id === item.id ? { ...ev, participantes: [...(ev.participantes || []), { id: userId }] } : ev
        ));
      }
    } else {
      const result = await CancelarParticipacao(item.id);
      if (result) {
        setEvents(prev => prev.map(ev =>
          ev.id === item.id ? { ...ev, participantes: ev.participantes?.filter(p => p.id !== userId) || [] } : ev
        ));
      }
    }
  };


  const renderItem = ({ item }: { item: Event }) => (
    <EventCard
      key={item.id}
      event={item}
      userId={userId}
      onDelete={() => handleDelete(item.id!)}
      onParticipate={() => handleParticipate(item)}
    />

  );

  const currentData = selectedCategory === "Torneios" ? tournaments : events;

  return (
    <SafeAreaView className="flex-1 ">
      <View className="px-4 pt-4 flex-row justify-between items-center">
        <Text className="text-white text-2xl font-bold">
          {selectedCategory}
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

      <FlatList
        data={currentData}
        keyExtractor={(item) => item.id!}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchData} />}
        ListEmptyComponent={() => (
          <View className="flex-1 items-center mt-10">
            <Text className="text-white text-lg">
              Nenhum {selectedCategory === "Torneios" ? "torneio" : "evento"} disponível
            </Text>
          </View>
        )}
      />

      <AddButton onPress={() => setShowModal(true)} />
      <EventCreationModal visible={showModal} onClose={() => setShowModal(false)} onSave={fetchData} defaultSport="" />
    </SafeAreaView>
  );
}
