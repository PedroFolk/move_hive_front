import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
  useColorScheme,
  Platform,
  LayoutAnimation,
  UIManager,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { BottomNav } from "../components/menuBottom";
import styles, { darkStyles, IMAGE_SIZE } from "./styles";
import EventCreationModal from "../components/modalEvets";

interface Event {
  id: string;
  title: string;
  description: string;
  startTime: string;
  location: string;
  date: string;
  imageUri?: string;
}

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function Events() {
  const theme = useColorScheme() || "light";
  const [selectedTab, setSelectedTab] = useState<"events" | "tournaments">(
    "events",
  );
  const [events, setEvents] = useState<Event[]>([]);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedCardId((prev) => (prev === id ? null : id));
  };

  const renderEventCard = ({ item }: { item: Event }) => {
    const open = item.id === expandedCardId;
    return (
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme === "dark" ? "#1F1F1F" : "#FFF",
            borderColor: theme === "dark" ? "#333" : "#ECECEC",
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => toggleExpand(item.id)}
          activeOpacity={0.8}
          style={{ flexDirection: "row", minHeight: IMAGE_SIZE }}
        >
          {item.imageUri ? (
            <Image
              source={{ uri: item.imageUri }}
              style={[
                styles.cardImage,
                { borderBottomLeftRadius: open ? 0 : 8 },
              ]}
              resizeMode="cover"
            />
          ) : (
            <View
              style={[
                styles.cardImage,
                {
                  backgroundColor: theme === "dark" ? "#2A2A2A" : "#F5F5F5",
                  borderBottomLeftRadius: open ? 0 : 8,
                },
              ]}
            >
              <MaterialIcons
                name="image"
                size={24}
                color={theme === "dark" ? "#555" : "#AAA"}
              />
            </View>
          )}
          <View style={styles.cardContent}>
            <Text
              style={[
                styles.cardTitle,
                { color: theme === "dark" ? "#FFF" : "#1F1F1F" },
              ]}
            >
              {item.title}
            </Text>
            <View style={styles.cardInfoRow}>
              <MaterialIcons
                name="access-time"
                size={14}
                color={theme === "dark" ? "#DDD" : "#666"}
              />
              <Text
                style={[
                  styles.cardInfoText,
                  { color: theme === "dark" ? "#CCC" : "#666" },
                ]}
              >
                {item.startTime}
              </Text>
            </View>
            <View style={styles.cardInfoRow}>
              <MaterialIcons
                name="place"
                size={14}
                color={theme === "dark" ? "#DDD" : "#666"}
              />
              <Text
                style={[
                  styles.cardInfoText,
                  { color: theme === "dark" ? "#CCC" : "#666" },
                ]}
              >
                {item.location}
              </Text>
            </View>
            <Text
              style={[
                styles.cardDate,
                { color: theme === "dark" ? "#CCC" : "#444" },
              ]}
            >
              {item.date}
            </Text>
          </View>
        </TouchableOpacity>
        {open && (
          <View
            style={[
              styles.cardFooter,
              { backgroundColor: theme === "dark" ? "#272727" : "#F9F9F9" },
            ]}
          >
            <Text
              style={[
                styles.cardDesc,
                { color: theme === "dark" ? "#DDD" : "#333" },
              ]}
            >
              {item.description}
            </Text>
            <TouchableOpacity
              style={[
                styles.cardButton,
                { backgroundColor: theme === "dark" ? "#E9B308" : "#FFA500" },
              ]}
            >
              <Text
                style={[
                  styles.cardButtonText,
                  { color: theme === "dark" ? "#525252" : "#FFF" },
                ]}
              >
                Inscreva-se
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const handleCreateEvent = (event: Event) => {
    setEvents((prev) => [event, ...prev]);
    setShowModal(false);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    // SafeAreaView with flex: 1 and width: "100%" ensures the component takes up the full screen
    <SafeAreaView
      style={{
        flex: 1,
        width: "100%", // Explicitly set to ensure full width
        backgroundColor: theme === "dark" ? "#272727" : "#FFF",
      }}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text
          style={[
            styles.headerTitle,
            { color: theme === "dark" ? "#EBEBEB" : "#1F1F1F" },
          ]}
        >
          Eventos
        </Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity>
            <MaterialIcons
              name="search"
              size={28}
              color={theme === "dark" ? "#EBEBEB" : "#000"}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <MaterialIcons
              name="more-vert"
              size={28}
              color={theme === "dark" ? "#EBEBEB" : "#000"}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          onPress={() => setSelectedTab("events")}
          style={[
            styles.tabButton,
            {
              backgroundColor:
                selectedTab === "events" ? "#FFF" : "transparent",
              borderColor: theme === "dark" ? "#FFF" : "#444",
            },
          ]}
        >
          <Text
            style={{
              color:
                selectedTab === "events"
                  ? "#000"
                  : theme === "dark"
                    ? "#FFF"
                    : "#444",
            }}
          >
            Eventos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelectedTab("tournaments")}
          style={[
            styles.tabButton,
            {
              backgroundColor:
                selectedTab === "tournaments" ? "#FFF" : "transparent",
              borderColor: theme === "dark" ? "#FFF" : "#444",
            },
          ]}
        >
          <Text
            style={{
              color:
                selectedTab === "tournaments"
                  ? "#000"
                  : theme === "dark"
                    ? "#FFF"
                    : "#444",
            }}
          >
            Torneios
          </Text>
        </TouchableOpacity>
      </View>

      {/* Subtitle */}
      {selectedTab === "events" && (
        <Text
          style={[
            styles.subtitle,
            { color: theme === "dark" ? "#EBEBEB" : "#1F1F1F" },
          ]}
        >
          Próximos eventos
        </Text>
      )}

      {/* Lista */}
      <View style={styles.listContainer}>
        {selectedTab === "events" ? (
          events.length > 0 ? (
            <FlatList
              data={events}
              keyExtractor={(item) => item.id}
              renderItem={renderEventCard}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 120 }} // Accommodates BottomNav height
            />
          ) : (
            <View style={styles.empty}>
              <Text style={{ color: theme === "dark" ? "#BBBBBB" : "#777" }}>
                Nenhum evento cadastrado
              </Text>
            </View>
          )
        ) : (
          <View style={styles.empty}>
            <Text style={{ color: theme === "dark" ? "#BBBBBB" : "#777" }}>
              Nenhum torneio disponível
            </Text>
          </View>
        )}
      </View>

      {/* Botão de adicionar */}
      <TouchableOpacity
        style={[
          styles.addButton,
          { backgroundColor: theme === "dark" ? "#525252" : "#FFA500" },
        ]}
        onPress={() => setShowModal(true)}
      >
        <Ionicons
          name="add"
          size={28}
          color={theme === "dark" ? "#EBEBEB" : "#FFF"}
        />
      </TouchableOpacity>

      {/* Modal de criação */}
      <EventCreationModal
        visible={showModal}
        theme={theme}
        onClose={handleCancel}
        onSave={handleCreateEvent}
      />
    </SafeAreaView>
  );
}
