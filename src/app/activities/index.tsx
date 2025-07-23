import React, { useState, useEffect } from "react";
import {
  useColorScheme,
  SafeAreaView,
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AddActivityModal, {
  ModalActivity,
  SPORTS,
} from "../components/modalActivities";

interface Activity {
  id: string;
  title: string;
  time: string;
  location: string;
  category: string;
}

const STORAGE_KEY = "@my_activities";

const CATEGORIES = ["Tudo", ...SPORTS];

const ActivitiesScreen: React.FC = () => {
  const theme = (useColorScheme() || "light") as "light" | "dark";

  const [selectedCategory, setSelectedCategory] = useState<string>("Tudo");
  const [activities, setActivities] = useState<Activity[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      if (json) setActivities(JSON.parse(json));
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
  }, [activities]);

  const displayedActivities = activities
    .filter((a) => selectedCategory === "Tudo" || a.title === selectedCategory)
    .slice()
    .sort((a, b) => a.time.localeCompare(b.time));

  const handleDelete = (id: string) => {
    Alert.alert(
      "Excluir atividade",
      "Tem certeza que deseja excluir esta atividade?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () =>
            setActivities((prev) => prev.filter((act) => act.id !== id)),
        },
      ]
    );
  };

  const handleSaveActivity = (m: ModalActivity) => {
    const newAct: Activity = {
      id: m.id,
      title: m.sport,
      time: m.time,
      location: m.location,
      category: m.category,
    };
    setActivities((prev) => [newAct, ...prev]);
    setModalVisible(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#272727]">
      <View className="px-4 pt-4 flex-row justify-between items-center">
        <Text className="text-white text-2xl font-bold">Minhas Atividades</Text>
        <Text className="text-gray-400 text-base">Hoje</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-4 mt-4"
      >
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setSelectedCategory(cat)}
            className={`mr-2 mb-8 px-6 h-10 justify-center items-center rounded-full border ${
              selectedCategory === cat
                ? "bg-white border-transparent"
                : "bg-gray-700 border-gray-500"
            }`}
          >
            <Text
              className={`text-sm font-medium ${
                selectedCategory === cat ? "text-black" : "text-gray-300"
              }`}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <FlatList
        data={displayedActivities}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "flex-start",
          paddingBottom: 100,
        }}
        showsVerticalScrollIndicator={false}
        className="mt-0"
        renderItem={({ item }) => (
          <View className="mx-4 mb-4 p-4 border border-gray-500 rounded-lg bg-[#1F1F1F]">
            <Text className="text-white text-lg font-semibold mb-1">
              {item.title}
            </Text>
            <TouchableOpacity
              onPress={() => handleDelete(item.id)}
              className="absolute top-2 right-2 p-1"
            >
              <Ionicons name="trash-outline" size={20} color="#FF4D4F" />
            </TouchableOpacity>
            <Text className="text-gray-400 mb-2">{item.time}</Text>
            <View className="flex-row items-center mb-4">
              <Ionicons name="location-outline" size={14} color="#888" />
              <Text className="text-gray-400 ml-1">{item.location}</Text>
            </View>
            <TouchableOpacity className="flex-row items-center self-end px-3 py-1 bg-gray-700 rounded-full">
              <Ionicons name="person-add-outline" size={16} color="#fff" />
              <Text className="text-white text-sm ml-1">Convidar</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="absolute bottom-24 right-6 bg-gray-700 rounded-full p-4"
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      <AddActivityModal
        visible={modalVisible}
        theme={theme}
        defaultCategory={
          selectedCategory === "Tudo" ? CATEGORIES[1] : selectedCategory
        }
        onSave={handleSaveActivity}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
};

export default ActivitiesScreen;
