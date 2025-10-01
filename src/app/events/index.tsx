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
import * as SecureStore from "expo-secure-store";

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

// NOVO: Adicione as props de callback
interface EventsProps {
  onShowEventModal: () => void;
  onFetchDataAvailable: (fetcher: () => Promise<void>) => void;
}

export default function Events({ onShowEventModal, onFetchDataAvailable }: EventsProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [tournaments, setTournaments] = useState<Event[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("Eventos");
  const [userId, setUserId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const TYPES = ["Eventos", "Torneios", "Meus Eventos"];

  const fetchUserId = async () => {
    const id = await SecureStore.getItemAsync("userId");
    setUserId(id);
  };

  const mapEventData = (data: any[]): Event[] =>
    data.map((ev) => {
      const [city = "", state = ""] = ev.localizacao?.split(",").map((s: string) => s.trim()) || [];
      const dateString = ev.data_hora.split("T")[0];
      const hourString = ev.data_hora.split("T")[1]?.slice(0, 5);
      return {
        id: ev.id,
        title: ev.titulo,
        sport: ev.esporte_nome,
        description: ev.descricao,
        dateString,
        hourString,
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
  }, [selectedCategory]); // fetchData é recriado apenas quando selectedCategory muda

  // 💥 CORREÇÃO 2: Exporta fetchData APENAS NA MONTAGEM
  useEffect(() => {
    onFetchDataAvailable(fetchData);
  }, []); // Array de dependências vazio: executa somente na montagem

  // Recarga inicial e quando a categoria muda
  useEffect(() => {
    fetchUserId();
    fetchData();
  }, [selectedCategory, fetchData]);

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

  const handleDelete = (id: string) => {
    Alert.alert("Confirmar exclusão", "Deseja realmente excluir este evento?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          const result = await DeletarEvento(id);
          if (result) {
            setEvents(prev => prev.filter(ev => ev.id !== id));
            setTournaments(prev => prev.filter(t => t.id !== id));
            Alert.alert("Sucesso", "Evento deletado com sucesso!");
          } else {
            Alert.alert("Erro", "Não foi possível deletar o evento.");
          }
        },
      },
    ]);
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
    <SafeAreaView className="w-full h-full ">

      <View className="px-4 pt-4 flex-row ">
        <Text className="text-white text-2xl font-bold">{selectedCategory}</Text>
      </View>


      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4 mt-4 max-h-14">
        {TYPES.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setSelectedCategory(cat)}
            className={`mb-2 mr-2 px-6 h-10 justify-center items-center rounded-full border ${selectedCategory === cat
              ? "bg-white border-transparent"
              : "border-gray-500 border-2"
              }`}
          >
            <Text
              className={`text-sm font-medium ${selectedCategory === cat ? "text-black" : "text-gray-300"
                }`}
            >
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
        className="flex-1 mt-4"
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 0 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchData} />}
        ListEmptyComponent={() => (
          <View className="flex-1 items-center mt-10">
            <Text className="text-white text-lg">
              Nenhum {selectedCategory === "Torneios" ? "torneio" : "evento"} disponível
            </Text>
          </View>
        )}
      />

    </SafeAreaView>
  );
}