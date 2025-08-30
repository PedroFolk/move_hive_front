import { useEffect, useState, useCallback } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
    SafeAreaView,
    TouchableOpacity,
    View,
    Text,
    FlatList,
    RefreshControl,
} from "react-native";
import { ListarNofificacao, MarcarNotificacaoComoLida } from "~/api/feed";

interface Notificacao {
    id: string;
    usuario_destino_id: string;
    tipo: string;
    referencia_id: string;
    mensagem: string;
    data_criacao: string;
    lida?: boolean;
}

export default function Notifications() {
    const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = useCallback(async () => {
        setRefreshing(true);
        const data = await ListarNofificacao();
        if (data) setNotificacoes(data);

        if (data) {
            const naoLidas = data.filter((n: Notificacao) => !n.lida);
            await Promise.all(naoLidas.map((n: { id: string; }) => MarcarNotificacaoComoLida(n.id)));
        }

        setRefreshing(false);
    }, []);

    useEffect(() => {
        fetchData();
    }, []);

    const renderItem = ({ item }: { item: Notificacao }) => (
        <View
            className={`p-4 mb-2 rounded-lg flex-row items-start`}
            style={{
                backgroundColor: item.lida ? "#2c2c2c" : "#4c1d95", 
                borderLeftWidth: item.lida ? 0 : 4, 
                borderLeftColor: item.lida ? "transparent" : "#f87171", 
            }}
        >
            <MaterialCommunityIcons
                name="bell-ring-outline"
                size={24}
                color="white"
                style={{ marginRight: 12 }}
            />
            <View className="flex-1">
                <Text
                    style={{
                        fontWeight: item.lida ? "normal" : "bold", 
                        color: "white",
                    }}
                >
                    {item.mensagem}
                </Text>
                <Text className="text-gray-400 text-sm mt-1">
                    {new Date(item.data_criacao).toLocaleString("pt-BR")}
                </Text>
            </View>
        </View>
    );


    return (
        <SafeAreaView className="flex-1 w-full bg-neutral-900 pt-safe pb-safe">
            <View className="px-4 pt-4 flex-row items-center">
                <TouchableOpacity onPress={() => router.back()}>
                    <MaterialCommunityIcons name="arrow-left" size={28} color="white" />
                </TouchableOpacity>
                <Text className="text-white text-2xl font-bold ml-4">
                    Central de notificações
                </Text>
            </View>

            <FlatList
                data={notificacoes}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={fetchData} />
                }
                ListEmptyComponent={() => (
                    <View className="items-center mt-10">
                        <Text className="text-white text-lg">Nenhuma notificação</Text>
                    </View>
                )}
            />
        </SafeAreaView>
    );
}
