import React, { useEffect, useState, useCallback } from "react";
import {
    View,
    Text,
    SafeAreaView,
    FlatList,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    Image,
    Alert,
} from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import AddActivityModal, { ModalActivity } from "../components/ModalActivities";
import AddButton from "../../../core/componentes/addButton";
import { ListarEsportes } from "~/core/api/getSports";
import { FeedTreinoSeguindo, ListarTreinos, DeletarTreino } from "../api/activities";
import { ListaRankingTodos, ListaRankingSeguindo } from "../api/rank";

interface UserRanking {
    nome_completo: string;
    username: string;
    pontos: number;
    foto_perfil?: string;
}

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

export default function Dashboard() {
    const [abaAtiva, setAbaAtiva] = useState<"ranking" | "atividades">("ranking");
    const tituloPagina = abaAtiva === "ranking" ? "Ranking" : "Atividades";

    const [ranking, setRanking] = useState<UserRanking[]>([]);
    const [selectedRankingCategory, setSelectedRankingCategory] = useState<string>("Geral");
    const [rankingRefreshing, setRankingRefreshing] = useState(false);
    const RANKING_TYPES = ["Geral", "Seguindo"];

    const fetchRanking = useCallback(async () => {
        setRankingRefreshing(true);
        let data: UserRanking[] | null = null;
        if (selectedRankingCategory === "Geral") data = await ListaRankingTodos();
        else if (selectedRankingCategory === "Seguindo") data = await ListaRankingSeguindo();
        if (data) setRanking(data);
        setRankingRefreshing(false);
    }, [selectedRankingCategory]);

    useEffect(() => {
        if (abaAtiva === "ranking") fetchRanking();
    }, [selectedRankingCategory, abaAtiva]);

    const renderRankingItem = ({ item, index }: { item: UserRanking; index: number }) => (
        <View className="flex-row  items-center p-3 mb-2 bg-neutral-900 rounded-xl">
            {index === 0 ? (
                <MaterialCommunityIcons name="medal" size={24} color="#FFD700" />
            ) : index === 1 ? (
                <MaterialCommunityIcons name="medal" size={24} color="#C0C0C0" />
            ) : index === 2 ? (
                <MaterialCommunityIcons name="medal" size={24} color="#CD7F32" />
            ) : (
                <Text className="text-white w-6">{index + 1}</Text>
            )}

            {item.foto_perfil ? (
                <Image
                    source={{ uri: item.foto_perfil }}
                    className="w-10 h-10 mx-2 rounded-full"
                    resizeMode="cover"
                />
            ) : (
                <View className="w-10 h-10 mx-2 bg-neutral-600 justify-center items-center rounded-full">
                    <Text className="text-white font-bold text-base">
                        {item.username ? item.username[0].toUpperCase() : "U"}
                    </Text>
                </View>
            )}

            <View className="flex-1">
                <Text className="text-white font-medium">{item.nome_completo}</Text>
                <Text className="text-gray-400">@{item.username}</Text>
            </View>

            <View className="flex-row items-center">
                <Text className="text-white font-bold">{item.pontos.toFixed(0)}</Text>
                <MaterialCommunityIcons name="star" size={16} color="#FFD700" className="ml-1" />
            </View>
        </View>
    );

    const [activities, setActivities] = useState<Activity[]>([]);
    const [categories, setCategories] = useState<{ label: string; value: string }[]>([]);
    const [selectedActivityCategory, setSelectedActivityCategory] = useState<string>("Minhas");
    const [activityRefreshing, setActivityRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const carregarAtividades = async () => {
        let treinosRaw: any[] | null = [];
        if (selectedActivityCategory === "Seguindo") {
            treinosRaw = await FeedTreinoSeguindo();
        } else {
            treinosRaw = await ListarTreinos();
        }

        const formatted: Activity[] = (Array.isArray(treinosRaw) ? treinosRaw : []).map((t: any) => ({
            id: t.id,
            titulo: t.titulo,
            descricao: t.descricao,
            nome_esporte: t.nome_esporte || t.esporte?.nome,
            data_hora: t.data_hora,
            lugar: t.lugar,
            tempo_treinado: t.tempo_treinado,
            arquivo_imagem: t.arquivo_imagem || "",
            pontos: t.pontos || 0,
        }));

        setActivities(formatted);

        const esportes = await ListarEsportes();
        const categoriasAtivas = esportes
            .filter((e: any) => formatted.some((a) => a.nome_esporte === e.value))
            .map((e: any) => ({ label: e.label, value: e.value }));

        setCategories([{ label: "Minhas", value: "Minhas" }, { label: "Seguindo", value: "Seguindo" }, ...categoriasAtivas]);
    };


    useEffect(() => {
        if (abaAtiva === "atividades") carregarAtividades();
    }, [abaAtiva, selectedActivityCategory]);

    const onRefreshActivities = async () => {
        setActivityRefreshing(true);
        await carregarAtividades();
        setActivityRefreshing(false);
    };

    const handleDeleteActivity = (id: string) => {
        Alert.alert("Excluir atividade", "Tem certeza que deseja excluir esta atividade?", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Excluir",
                style: "destructive",
                onPress: async () => {
                    const result = await DeletarTreino(id);
                    if (result) setActivities((prev) => prev.filter((act) => act.id !== id));
                    else Alert.alert("Erro", "Não foi possível deletar a atividade.");
                },
            },
        ]);
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
        .filter(
            (a) =>
                selectedActivityCategory === "Minhas" ||
                selectedActivityCategory === "Seguindo" ||
                a.nome_esporte === selectedActivityCategory
        )
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
        <View className="flex-1 w-full bg-neutral-800 py-safe">
            <View className="px-4 pt-4 flex-row justify-between items-center">
                <Text className="text-white text-2xl font-bold">{tituloPagina}</Text>
            </View>

            <View className="flex-row justify-around mt-4 mb-2 border-b border-neutral-700">
                {["ranking", "atividades"].map((aba) => (
                    <TouchableOpacity
                        key={aba}
                        activeOpacity={100}
                        className="p-4"
                        onPress={() => setAbaAtiva(aba as "ranking" | "atividades")}
                    >
                        <Text
                            className={`text-base font-bold ${abaAtiva === aba ? "text-yellow-400" : "text-neutral-400"
                                }`}
                        >
                            {aba === "ranking" ? "Ranking" : "Atividades"}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>


            {abaAtiva === "ranking" && (
                <>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4 mt-4 max-h-14">
                        {RANKING_TYPES.map((item) => (
                            <TouchableOpacity
                                key={item}
                                onPress={() => setSelectedRankingCategory(item)}
                                className={`mr-2 px-6 h-10 justify-center items-center rounded-full border ${selectedRankingCategory === item ? "bg-white border-transparent" : "border-gray-500 border-2"
                                    }`}
                            >
                                <Text className={`text-sm font-medium ${selectedRankingCategory === item ? "text-black" : "text-gray-300"}`}>
                                    {item}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <FlatList
                        data={ranking}
                        keyExtractor={(item) => item.username}
                        renderItem={renderRankingItem}
                        showsVerticalScrollIndicator={false}
                        className="flex-1 mt-0"
                        contentContainerStyle={{
                            paddingHorizontal: 16,
                            paddingTop: 8,
                            paddingBottom: 16,
                        }}
                        refreshControl={
                            <RefreshControl refreshing={rankingRefreshing} onRefresh={fetchRanking} />
                        }
                        ListEmptyComponent={() => (
                            <View className="items-center mt-4">
                                <Text className="text-white text-lg">Nenhum usuário encontrado</Text>
                            </View>
                        )}
                    />

                </>
            )}


            {abaAtiva === "atividades" && (
                <>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4 mt-4 max-h-14">
                        {categories.map((cat, index) => (
                            <TouchableOpacity
                                key={`${cat.value}-${index}`}
                                onPress={() => setSelectedActivityCategory(cat.value)}
                                className={`mr-2 px-6 h-10 justify-center items-center rounded-full border ${selectedActivityCategory === cat.value
                                    ? "bg-white border-transparent"
                                    : "border-gray-500 border-2"
                                    }`}
                            >
                                <Text className={`text-sm font-medium ${selectedActivityCategory === cat.value ? "text-black" : "text-gray-300"}`}>
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
                        refreshControl={<RefreshControl refreshing={activityRefreshing} onRefresh={onRefreshActivities} />}
                        renderItem={({ item: date }) => (
                            <View className="mb-6">
                                <Text className="text-white text-lg font-bold px-4 py-2 rounded-lg mb-2">{date}</Text>
                                {groupedActivities[date].map((act) => {
                                    const time = new Date(act.data_hora).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
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
                                                    <Text className="text-white font-bold text-2xl">{act.titulo[0].toUpperCase()}</Text>
                                                </View>
                                            )}

                                            <View className="flex-1 justify-between">
                                                <Text className="text-white text-lg font-semibold mb-1">{act.titulo}</Text>
                                                {selectedActivityCategory !== "Seguindo" && (
                                                    <TouchableOpacity
                                                        onPress={() => handleDeleteActivity(act.id)}
                                                        className="absolute top-2 right-2 p-1"
                                                    >
                                                        <Ionicons name="trash-outline" size={20} color="#FF4D4F" />
                                                    </TouchableOpacity>
                                                )}


                                                <View className="flex-row mb-2">
                                                    <Text className="text-gray-400">{time}</Text>
                                                    <Text className="text-gray-400 ml-10">{formatTempoTreinado(act.tempo_treinado)}</Text>
                                                </View>

                                                <View className="flex-row mb-2 justify-between">
                                                    <Text className="text-gray-400">{act.nome_esporte}</Text>
                                                </View>
                                                <View className="mb-4 flex-row items-center">
                                                    <Ionicons name="location-outline" size={14} color="#888" />
                                                    <Text className="text-gray-400 ml-1">{act.lugar}</Text>
                                                </View>
                                                <View className="border-2 border-yellow-500 p-2 rounded-2xl justify-center items-center text-center">
                                                    <Text className="text-yellow-500 font-semibold">{act.pontos.toFixed(0)}</Text>
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
                            selectedActivityCategory === "Minhas" && categories.length > 1 ? categories[1].value : selectedActivityCategory
                        }
                        onSave={handleSaveActivity}
                        onClose={async () => {
                            setModalVisible(false);
                            await carregarAtividades();
                        }}
                    />
                </>
            )}
        </View>
    );
}
