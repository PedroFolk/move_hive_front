import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert, Image
} from "react-native";
import * as SecureStore from "expo-secure-store";

import AddButton from "../../../components/addButton";

import {
  ListarTodosEventos,
  ListarTodosTorneios,
  ListarMeusEventos,
  ParticiparEvento,
  CancelarParticipacao,
  DeletarEvento,
} from "~/api/event";
import EventCard from "../../../components/eventCard";
import EventCreationModal from "~/components/modals/modalEvents";
import { Ionicons } from "@expo/vector-icons";
import ModalEventInfos from "~/components/modals/modalEventInfos";

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
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
const [modalCardVisible, setModalCardVisible] = useState(false);


  const TYPES = ["Eventos", "Torneios", "Meus Eventos"];

  const fetchUserId = async () => {
    const id = await SecureStore.getItemAsync("userId");
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

    />
  );

  const currentData = selectedCategory === "Torneios" ? tournaments : events;

  return (
    <View className="flex-1 bg-neutral-800 py-safe">
      {/* Destaque acima */}
      {currentData.length > 0 && (
        <View className="pt-4">
          <View className=" flex-row justify-between px-4 mb-2 items-center">

            <Text className="text-white text-2xl font-bold ">Eventos</Text>
            <TouchableOpacity
              onPress={() => setShowModal(true)}
              className="z-50 bg-neutral-900 p-2 rounded-full shadow-md"
            >
              <Ionicons name="add" size={28} color="#eab308" />
            </TouchableOpacity>
          </View>
          <FlatList
            className="mt-6 shadow-lg shadow-black "
            data={currentData}
            keyExtractor={(item) => item.id!}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => { }} className="mr-0 w-screen h-64">
                {item.imageUri ? (
                  <View className="flex-1">
                    <Image
                      source={{ uri: item.imageUri }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />

                  </View>
                ) : (
                  <View className="flex-1 justify-center items-center bg-gray-600">
                    <Text className="text-white text-xl font-bold">{item.title}</Text>
                  </View>
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      )}


      {/* Filtros horizontais */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4 mt-4 max-h-14">
        {TYPES.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setSelectedCategory(cat)}
            className={`mb-2 mr-2 px-6 h-10 justify-center items-center rounded-full border ${selectedCategory === cat ? "bg-white border-transparent" : "border-gray-500 border-2"
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

      {/* Lista de eventos abaixo */}
      <FlatList
        data={currentData} // omitindo o destaque
        keyExtractor={(item) => item.id!}
        renderItem={
          ({ item }) => <EventCard event={item} isPrivate={item.isPrivate} onPress={() => {
            setSelectedEvent(item);
            setModalCardVisible(true);
          }}
          />
        }
        horizontal

        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8 }}
      />

      {/* <AddButton onPress={() => setShowModal(true)} /> */}
      <ModalEventInfos
        visible={modalCardVisible}
        onClose={() => setModalCardVisible(false)}
        title={selectedEvent?.title || ""}
        description={selectedEvent?.description || ""}
        dateString={selectedEvent?.dateString || ""}
        hourString={selectedEvent?.hourString || ""}
        city={selectedEvent?.city || ""}
        state={selectedEvent?.state || ""}
         imageUri={selectedEvent?.imageUri || ""}
      />



      <EventCreationModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSave={fetchData}
        defaultSport=""

      />
    </View>
  );
}