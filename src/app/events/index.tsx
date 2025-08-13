import { useState } from "react";
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
import EventCreationModal from "../components/modalEvents";
import AddButton from "../components/addButton";


interface Event {
  id: string;
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
}

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [tournaments, setTournaments] = useState<Event[]>([]);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleDelete = (id: string) => {
    Alert.alert("Confirmar exclusão", "Deseja realmente excluir este card?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => {
          if (selectedCategory === "Eventos") {
            setEvents((prev) => prev.filter((ev) => ev.id !== id));
          } else {
            setTournaments((prev) => prev.filter((t) => t.id !== id));
          }
        },
      },
    ]);
  };

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedCardId((prev) => (prev === id ? null : id));
  };

  const renderEventCard = ({ item }: { item: Event }) => {
    const open = item.id === expandedCardId;
    return (
      <View className="bg-neutral-900 rounded-2xl mb-4 overflow-hidden shadow-lg">

        <TouchableOpacity
          onPress={() => toggleExpand(item.id)}
          activeOpacity={0.8}
        >
          {item.imageUri ? (
            <Image
              source={{ uri: item.imageUri }}
              className="w-full h-40"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-40 bg-gray-700 justify-center items-center">
              <MaterialIcons name="image" size={48} color="#9ca3af" />
            </View>
          )}
        </TouchableOpacity>


        <View className="p-4">

          <View className="flex-row justify-between items-start">
            <Text className="text-white text-lg font-bold flex-1 pr-2">
              {item.title}
            </Text>

            <TouchableOpacity onPress={() => handleDelete(item.id)}>
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
              <TouchableOpacity className="mt-3 bg-yellow-500 py-2 rounded-full">
                <Text className="text-black text-center font-semibold">
                  Inscreva-se
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };


  const handleSave = (event: Event) => {
    if (selectedCategory === "Eventos") {
      setEvents((prev) => [event, ...prev]);
    } else {
      setTournaments((prev) => [event, ...prev]);
    }
    setShowModal(false);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const [selectedCategory, setSelectedCategory] = useState<string>("Eventos");
  const TYPES = ["Eventos", "Torneios", "Eventos Criados", "Meus Eventos"];

  return (
    <SafeAreaView className="h-full w-full ">
      <View className="px-4 pt-4 flex-row justify-between items-center">
        <Text className="text-white text-2xl font-bold">
          {selectedCategory === "Eventos" ? "Eventos" : "Torneios"}
        </Text>
        {/* <View className="flex-row ">
          <TouchableOpacity>
            <MaterialIcons name="search" size={28} color={"white"} />
          </TouchableOpacity>
          <TouchableOpacity>
            <MaterialIcons name="more-vert" size={28} color={"white"} />
          </TouchableOpacity>
        </View> */}
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-4 mt-4 max-h-14"
      >
        {TYPES.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setSelectedCategory(cat)}
            className={`mr-2  px-6 h-10 justify-center items-center rounded-full border ${selectedCategory === cat
              ? "bg-white border-transparent"
              : " border-gray-500 border-2"
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

      <Text className="text-white text-xl font-bold p-4">
        {selectedCategory === "Eventos"
          ? "Próximos eventos"
          : "Próximos torneios"}
      </Text>

      <View className="flex-1 px-4">
        <FlatList
          data={selectedCategory === "Eventos" ? events : tournaments}
          keyExtractor={(item) => item.id}
          renderItem={renderEventCard}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 120 }}
          ListEmptyComponent={() => (
            <View className="flex-1 justify-center items-center">
              <Text className="text-white text-lg">
                {selectedCategory === "Eventos"
                  ? "Nenhum evento cadastrado"
                  : "Nenhum torneio disponível"}
              </Text>
            </View>
          )}
        />
      </View>

      <AddButton onPress={() => setShowModal(true)} />

      <EventCreationModal
        visible={showModal}
        onClose={handleCancel}
        defaultSport={""}
        onSave={handleSave}
      />
    </SafeAreaView>
  );
}
