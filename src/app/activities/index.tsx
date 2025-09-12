import React, { useState, useEffect } from "react";
import {
  Image,
  SafeAreaView,
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl, // 👈 importar aqui
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AddActivityModal, { ModalActivity } from "../components/modalActivities";
import AddButton from "../components/addButton";
import { DeletarTreino, ListarTreinos } from "~/api/activities";
import { ListarEsportes } from "~/api/getSports";

interface Activity {
  id: string;
  titulo: string;
  descricao: string;
  nome_esporte: string;
  data_hora: string;
  lugar: string;
  tempo_treinado: number;
  arquivo_imagem: string;
  pontos: number;
}

const ActivitiesScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("Tudo");
  const [activities, setActivities] = useState<Activity[]>([]);
  const [categories, setCategories] = useState<{ label: string; value: string }[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const carregarTreinos = async () => {
    const treinos = await ListarTreinos();
    const formatted: Activity[] = (treinos || []).map((t: any) => ({
      id: t.id,
      titulo: t.titulo,
      descricao: t.descricao,
      nome_esporte: t.esporte.nome,
      data_hora: t.data_hora,
      lugar: t.lugar,
      tempo_treinado: t.tempo_treinado,
      arquivo_imagem: t.arquivo_imagem || "",
      pontos: t.pontos,
    }));
    setActivities(formatted);

    const esportes = await ListarEsportes();
    const categoriasAtivas = esportes
      .filter((e: any) => formatted.some((a) => a.nome_esporte === e.value))
      .map((e: any) => ({ label: e.label, value: e.value }));

    setCategories([{ label: "Tudo", value: "Tudo" }, ...categoriasAtivas]);
  };

  useEffect(() => {
    carregarTreinos();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await carregarTreinos();
    setRefreshing(false);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      "Excluir atividade",
      "Tem certeza que deseja excluir esta atividade?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            const result = await DeletarTreino(id);
            if (result) {
              setActivities((prev) => prev.filter((act) => act.id !== id));
              Alert.alert("Sucesso", "Atividade deletada com sucesso!");
            } else {
              Alert.alert("Erro", "Não foi possível deletar a atividade.");
            }
          },
        },
      ]
    );
  };

  const handleSaveActivity = (m: ModalActivity) => {
    const newAct: Activity = {
      id: m.id,
      titulo: m.id,
      descricao: m.descricao,
      nome_esporte: m.category,
      data_hora: m.dateString,
      lugar: m.location,
      tempo_treinado: m.tempoTreinado,
      arquivo_imagem: m.fotoUri || "",
      pontos: m.pontos,
    };
    setActivities((prev) => [newAct, ...prev]);
    setModalVisible(false);
  };

  const groupedActivities = activities
    .filter((a) => selectedCategory === "Tudo" || a.nome_esporte === selectedCategory)
    .reduce((acc: Record<string, Activity[]>, act) => {
      const dateObj = new Date(act.data_hora);
      const formattedDate = dateObj.toLocaleDateString("pt-BR");
      if (!acc[formattedDate]) acc[formattedDate] = [];
      acc[formattedDate].push(act);
      return acc;
    }, {});

  const sortedDates = Object.keys(groupedActivities).sort(
    (a, b) =>
      new Date(b.split("/").reverse().join("-")).getTime() -
      new Date(a.split("/").reverse().join("-")).getTime()
  );

  const formatTempoTreinado = (minutos: number) => {
    const h = Math.floor(minutos / 60);
    const m = minutos % 60;
    let result = "";
    if (h > 0) result += `${h}h`;
    if (m > 0) result += h > 0 ? `${m}min` : `${m}min`;
    return result || "0min";
  };

  return (
    <SafeAreaView className="h-full w-full">
      <View className="px-4 pt-4 flex-row justify-between items-center">
        <Text className="text-white text-2xl font-bold">Minhas Atividades</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-4 mt-4 max-h-14"
      >
        {categories.map((cat, index) => (
          <TouchableOpacity
            key={`${cat.value}-${index}`}
            onPress={() => setSelectedCategory(cat.value)}
            className={`mr-2 px-6 h-10 justify-center items-center rounded-full border ${selectedCategory === cat.value
                ? "bg-white border-transparent"
                : "border-gray-500 border-2"
              }`}
          >
            <Text
              className={`text-sm font-medium ${selectedCategory === cat.value ? "text-black" : "text-gray-300"
                }`}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={sortedDates}
        keyExtractor={(date) => date}
        showsVerticalScrollIndicator={false}
        className="mt-0 flex-1 mb-20"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item: date }) => (
          <View className="mb-6">
            <Text className="text-white text-lg font-bold px-4 py-2 rounded-lg mb-2">
              {date}
            </Text>
            {groupedActivities[date].map((act) => {
              const time = new Date(act.data_hora).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              });
              return (
                <View
                  key={act.id}
                  className="mx-4 mb-4 p-4 border-2 border-neutral-600 rounded-2xl bg-neutral-900 flex flex-row"
                >
                  {act.arquivo_imagem ? (
                    <Image
                      source={{ uri: act.arquivo_imagem }}
                      className="w-40 h-40 mr-3 rounded-2xl border-neutral-700 border-2"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="w-40 h-40 mr-3 bg-neutral-600 justify-center items-center rounded-2xl">
                      <Text className="text-white font-bold text-2xl">
                        {act.titulo[0].toUpperCase()}
                      </Text>
                    </View>
                  )}

                  <View className="flex-1 justify-between">
                    <Text className="text-white text-lg font-semibold mb-1">
                      {act.titulo}
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleDelete(act.id)}
                      className="absolute top-2 right-2 p-1"
                    >
                      <Ionicons name="trash-outline" size={20} color="#FF4D4F" />
                    </TouchableOpacity>

                    <View className="flex-row mb-2">
                      <Text className="text-gray-400 ">{time}</Text>
                      <Text className="text-gray-400 ml-10">
                        {formatTempoTreinado(act.tempo_treinado)}
                      </Text>
                    </View>

                    <View className="flex-row mb-2 justify-between">
                      <Text className="text-gray-400 ">{act.nome_esporte}</Text>

                    </View>
                    <View className="mb-4 flex-row items-center ">
                      <Ionicons name="location-outline" size={14} color="#888" />
                      <Text className="text-gray-400 ml-1">{act.lugar}</Text>
                    </View>
                    <View className="border-2 border-yellow-500 p-2 rounded-2xl justify-center items-center text-center ">
                      <Text className="text-yellow-500 font-semibold">
                        {act.pontos.toFixed(0)}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      />

      <AddButton onPress={() => setModalVisible(true)} />

      <AddActivityModal
        visible={modalVisible}
        defaultCategory={
          selectedCategory === "Tudo" && categories.length > 1
            ? categories[1].value
            : selectedCategory
        }
        onSave={handleSaveActivity}
        onClose={async () => {
          setModalVisible(false);
          await carregarTreinos();
        }}
      />
    </SafeAreaView>
  );
};

export default ActivitiesScreen;
