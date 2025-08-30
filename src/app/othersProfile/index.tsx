import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import EventCard from "../components/eventCard";
import { ListarTodosEventos } from "~/api/event";

interface PerfilProps {
  perfil: any; 
  meuPerfil?: boolean; 
  onSeguir?: () => void;
}

export default function Perfil({ perfil, meuPerfil = false, onSeguir }: PerfilProps) {
  const [participandoExpandido, setParticipandoExpandido] = useState(false);
  const [eventosParticipando, setEventosParticipando] = useState<any[]>([]);
  const [loadingEventos, setLoadingEventos] = useState(false);
  const [mostrarEventosButton, setMostrarEventosButton] = useState(false);

  const carregarEventosParticipando = useCallback(async () => {
    if (!perfil?.eventos_participando?.length) return;
    setLoadingEventos(true);
    const todosEventos = await ListarTodosEventos();
    if (todosEventos) {
      const participando = todosEventos
        .filter((ev: any) => perfil.eventos_participando.includes(ev.id))
        .map((ev: any) => {
          const dateObj = new Date(ev.data_hora || ev.data || new Date());
          const [city = "", state = ""] =
            ev.localizacao?.split(",").map((s: string) => s.trim()) || [];
          return {
            id: ev.id,
            title: ev.nome ?? ev.titulo ?? "Sem título",
            sport: ev.esporte ?? ev.esporte_nome ?? "Não informado",
            description: ev.descricao ?? "",
            dateString: dateObj.toLocaleDateString("pt-BR"),
            hourString: dateObj.toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            city,
            state,
            imageUri: ev.foto ?? ev.imagem ?? "",
            participantes: ev.participantes?.map((id: string) => ({ id })) || [],
          };
        });
      setEventosParticipando(participando);
    }
    setLoadingEventos(false);
  }, [perfil]);

  const toggleExpandir = () => {
    if (!participandoExpandido) carregarEventosParticipando();
    setParticipandoExpandido(!participandoExpandido);
  };

  const toggleMostrarEventos = () => setMostrarEventosButton(!mostrarEventosButton);

  const Header = () => (
    <View className="w-full px-6 py-4">
      <View className="flex-row items-center justify-between">
        {perfil?.foto_perfil ? (
          <Image
            source={{ uri: perfil.foto_perfil }}
            resizeMode="cover"
            className="rounded-full w-28 h-28 border-2 border-yellow-500"
          />
        ) : (
          <View className="rounded-full w-28 h-28 border-2 border-yellow-500 items-center justify-center">
            <Text className="text-yellow-500 font-bold text-4xl">
              {perfil?.username ? perfil.username[0].toUpperCase() : "U"}
            </Text>
          </View>
        )}

        <View className="flex-1 ml-4 justify-center">
          <View className="flex-row flex-1 justify-around">
            {meuPerfil && (
              <>
                <View className="items-center">
                  <Text className="text-yellow-500 font-bold text-lg">{perfil.seguidores_count}</Text>
                  <Text className="text-white text-sm">Seguidores</Text>
                </View>

                <View className="items-center">
                  <Text className="text-yellow-500 font-bold text-lg">{perfil.seguindo_count}</Text>
                  <Text className="text-white text-sm">Seguindo</Text>
                </View>
              </>
            )}
            <View className="items-center">
              <Text className="text-yellow-500 font-bold text-lg">{perfil.eventos_participando.length}</Text>
              <Text className="text-white text-sm">Eventos</Text>
            </View>
          </View>

          {meuPerfil ? (
            <TouchableOpacity
              className="border-2 border-white rounded-2xl mt-4 py-2"
            >
              <Text className="text-white text-center text-lg">Editar Perfil</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className="border-2 border-yellow-500 rounded-2xl mt-4 py-2"
              onPress={onSeguir}
            >
              <Text className="text-yellow-500 text-center text-lg">Seguir</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <Text className="text-white text-lg font-bold mt-4">{perfil.nome_completo}</Text>
      <Text className="text-neutral-400 text-sm">@{perfil.username}</Text>

      {perfil.cidade && perfil.estado && (
        <View className="flex-row mt-1 items-center">
          <MaterialCommunityIcons name="map-marker" size={16} color="gray" />
          <Text className="text-neutral-400 ml-1">{perfil.cidade}, {perfil.estado}</Text>
        </View>
      )}

      {perfil.biografia && (
        <Text className="text-neutral-300 mt-2">{perfil.biografia}</Text>
      )}

      <View className="w-full mt-4 items-center">
        <TouchableOpacity
          className="flex-row items-center w-2/3 justify-between rounded-2xl border-2 border-yellow-500 bg-yellow-500 py-2 px-4"
          onPress={toggleMostrarEventos}
        >
          <MaterialCommunityIcons name="trophy" size={24} color="black" />
          <Text className="text-black font-semibold text-lg mx-2">{perfil.pontos.toFixed(0)}</Text>
          <MaterialCommunityIcons name="trophy" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {mostrarEventosButton && (
        <TouchableOpacity
          className="border-2 border-white rounded-2xl mt-4 py-2"
          onPress={toggleExpandir}
        >
          <Text className="text-white text-center text-lg">
            {participandoExpandido
              ? "Ocultar Eventos Participados"
              : `Eventos Participados (${perfil.eventos_participando.length})`}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView className="w-full h-full">
      <FlatList
        data={participandoExpandido ? eventosParticipando : []}
        keyExtractor={(item, index) => item.id?.toString() ?? `event-${index}`}
        renderItem={({ item }) => (
          <View className="px-6 py-2">
            <View className="bg-neutral-800 p-2 rounded-2xl">
              <EventCard event={item} userId={perfil.id} />
            </View>
          </View>
        )}
        ListHeaderComponent={Header}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          participandoExpandido ? (
            loadingEventos ? (
              <ActivityIndicator size="large" color="#facc15" className="mt-4" />
            ) : (
              <Text className="text-white text-center mt-4">Nenhum evento encontrado</Text>
            )
          ) : null
        }
      />
    </SafeAreaView>
  );
}
