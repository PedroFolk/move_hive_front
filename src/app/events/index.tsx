import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
  useColorScheme,

  LayoutAnimation,

  Alert,
  ScrollView,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";

import EventCreationModal from "../components/modalEvents";
import AddButton from "../components/addButton";

interface Event {
  id: string;
  title: string;
  description: string;
  startTime: string;
  location: string;
  date: string;
  imageUri?: string;
}



export default function Events() {
  const theme = useColorScheme() || "light";

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
      <View >
        <TouchableOpacity

          onPress={() => handleDelete(item.id)}
        >
          <MaterialIcons
            name="delete"
            size={24}

          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => toggleExpand(item.id)}
          activeOpacity={0.8}
        >
          {item.imageUri ? (
            <Image
              source={{ uri: item.imageUri }}

              resizeMode="cover"
            />
          ) : (
            <View

            >
              <MaterialIcons
                name="image"
                size={24}

              />
            </View>
          )}
          <View >
            <Text >{item.title}</Text>
            <View >
              <MaterialIcons
                name="access-time"
                size={14}

              />
              <Text>{item.startTime}</Text>
            </View>
            <View >
              <MaterialIcons
                name="place"
                size={14}

              />
              <Text>{item.location}</Text>
            </View>
            <Text >{item.date}</Text>
          </View>
        </TouchableOpacity>
        {open && (
          <View >
            <Text>{item.description}</Text>
            <TouchableOpacity

            >
              <Text >Inscreva-se</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const handleSave = (item: Event) => {
    if (selectedCategory === "Eventos") {
      setEvents((prev) => [item, ...prev]);
    } else {
      setTournaments((prev) => [item, ...prev]);
    }
    setShowModal(false);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const [selectedCategory, setSelectedCategory] = useState<string>("Eventos");
  const TYPES = ["Eventos", "Torneios"]


  return (
    <SafeAreaView className="h-full w-full ">
      <View className="px-4 pt-4 flex-row justify-between items-center">
        <Text className="text-white text-2xl font-bold">
          {selectedCategory === "Eventos" ? "Eventos" : "Torneios"}
        </Text>
        <View className="flex-row ">
          <TouchableOpacity >
            <MaterialIcons
              name="search"
              size={28}
              color={"white"}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <MaterialIcons
              name="more-vert"
              size={28}
              color={"white"}

            />
          </TouchableOpacity>
        </View>
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



      <Text className="text-white text-xl font-bold p-4" >
        {selectedCategory === "Eventos" ? "Próximos eventos" : "Próximos torneios"}
      </Text>

      <View className="flex-1 px-4">
        <FlatList
          data={selectedCategory === "Evenetos" ? events : tournaments}
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


      <AddButton
        onPress={() => setShowModal(true)} />

      <EventCreationModal
        visible={showModal}
        theme={theme}
        onClose={handleCancel}
        onSave={handleSave}
      />
    </SafeAreaView>
  );
}
