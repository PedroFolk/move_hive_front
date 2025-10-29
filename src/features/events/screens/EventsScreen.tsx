import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { Ionicons } from "@expo/vector-icons";

import EventCard from "~/features/events/components/EventCard";
import { ListarTodosEventos, ListarTodosTorneios, ListarMeusEventos } from "../api/event";
import ModalEventInfos from "../components/ModalEventInfos";
import EventCreationModal from "../components/ModalEvents";


interface Event {
  id?: any;
  usuario_id: string;
  title: string;
  sport: string;
  description: string;
  dateString: string;
  city: string;
  state: string;
  hourString: string;
  maxParticipants?: number;
  torneio: boolean;
  imageUri?: string;
  link_oficial: string;
  interesse: [];
  status: string;
}

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [tournaments, setTournaments] = useState<Event[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("Eventos");
  const [userId, setUserId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [modalCardVisible, setModalCardVisible] = useState(false);
  const [tipoUsuario, setTipoUsuario] = useState<string | null>(null);

  const TYPES = ["Eventos", "Torneios", "Meus Eventos"];

  useEffect(() => {

    const carregarTipoPerfil = async () => {

      const tipo_usuario = await SecureStore.getItemAsync("tipo_usuario");

      setTipoUsuario(tipo_usuario)
    };
    carregarTipoPerfil();
  }, []);


  const fetchUserId = async () => {
    const id = await SecureStore.getItemAsync("userId");
    setUserId(id);
  };

  const mapEventData = (data: any[]): Event[] =>
    data.map((ev) => {
      const [city = "", state = ""] =
        ev.localizacao?.split(",").map((s: string) => s.trim()) || [];

      const dateObj = new Date(ev.data_hora);

      return {
        id: ev.id,
        usuario_id: ev.usuario_id,
        title: ev.titulo,
        sport: ev.esporte_nome,
        description: ev.descricao,
        dateString: dateObj.toLocaleDateString("pt-BR"),
        hourString: dateObj.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        city,
        state,
        maxParticipants: ev.max_participantes,
        torneio: !!ev.torneio,
        imageUri: ev.foto,
        link_oficial: ev.link_oficial,
        interesse: ev.interesse || [],
        status: ev.status || "ativo",
      };
    });


  const fetchData = useCallback(async () => {
    if (selectedCategory === "Eventos") {
      const data = await ListarTodosEventos();
      setEvents(mapEventData(data || []));
    } else if (selectedCategory === "Torneios") {
      const data = await ListarTodosTorneios();
      setTournaments(mapEventData(data || []));
    } else if (selectedCategory === "Meus Eventos") {
      const data = await ListarMeusEventos();
      setEvents(mapEventData(data || []));
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchUserId();
    fetchData();
  }, [selectedCategory]);




  const currentData = selectedCategory === "Torneios" ? tournaments : events;

  return (
    <View className="flex-1 bg-neutral-800 py-safe">


      {currentData.length > 0 && (
        <View className="pt-4 shadow-lg shadow-black">
          <View className=" flex-row justify-between px-4 mb-2 items-center">

            <Text className="text-white text-2xl font-bold ">Eventos</Text>

            {
              (tipoUsuario == "empresa")
                ?
                <TouchableOpacity
                  onPress={() => setShowModal(true)}
                  className="z-50 bg-neutral-900 p-2 rounded-full "
                >
                  <Ionicons name="add" size={28} color="#eab308" />
                </TouchableOpacity>
                :
                <></>
            }



          </View>
          <FlatList
            className="mt-6 "
            data={currentData}
            keyExtractor={(item) => item.id!}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setSelectedEvent(item);
                  setModalCardVisible(true);
                }}
                className="mr-0 w-screen h-64"
              >
                <View className="flex-1 mx-4 h-full rounded-xl overflow-hidden">
                  {item.imageUri ? (
                    <Image
                      source={{ uri: item.imageUri }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="flex-1 justify-center items-center bg-gray-600">
                      <Text className="text-white text-xl font-bold">{item.title}</Text>
                    </View>
                  )}



                  <View className="absolute bottom-0 left-0 right-0 flex-row justify-between bg-black  opacity-[.80] px-4 py-2">
                    <Text className="text-white font-bold text-lg   ">{item.title}</Text>
                    <View className="bg-purple-300 opacity-[1] px-3 py-1 rounded-full">
                      <Text className="text-neutral-900 font-semibold text-md">#{item.sport}</Text>
                    </View>

                  </View>
                </View>
              </TouchableOpacity>
            )}
          />

        </View>
      )}

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4 mt-4 max-h-14">
        {TYPES.filter(cat => !(cat === "Meus Eventos" && tipoUsuario !== "empresa")).map((cat) => (
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


      {currentData.length === 0 ? (
        <View className="flex-1 justify-center items-center mt-10">
          <Text className="text-gray-400 text-lg">
            Nenhum {selectedCategory.toLowerCase()} cadastrado.
          </Text>
        </View>
      ) : (
        <FlatList
          data={currentData}
          keyExtractor={(item) => item.id!}
          renderItem={({ item }) => (
            <EventCard
              event={item}

              onPress={() => {
                setSelectedEvent(item);
                setModalCardVisible(true);
              }}
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8 }}
        />
      )}

      <ModalEventInfos
        visible={modalCardVisible}
        onClose={() => setModalCardVisible(false)}

        id={selectedEvent?.id || ""}
        title={selectedEvent?.title || ""}
        sport={selectedEvent?.sport || ""}
        description={selectedEvent?.description || ""}
        dateString={selectedEvent?.dateString || ""}
        hourString={selectedEvent?.hourString || ""}
        city={selectedEvent?.city || ""}
        state={selectedEvent?.state || ""}
        maxParticipants={selectedEvent?.maxParticipants || 0}
        torneio={selectedEvent?.torneio || false}
        imageUri={selectedEvent?.imageUri || ""}
        link_oficial={selectedEvent?.link_oficial || ""}
        interesse={selectedEvent?.interesse || []}
        status={selectedEvent?.status || "ativo"}
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
