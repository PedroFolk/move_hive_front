import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { SeguirUsuario, SugerirPerfis } from "~/api/user";


export default function SugestoesPerfis() {
    const [perfis, setPerfis] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPerfis = async () => {
            try {
                const data = await SugerirPerfis();
                if (data) setPerfis(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchPerfis();
    }, []);


    const handleSeguir = async (id: string) => {
        try {
            await SeguirUsuario(id);
            setPerfis((prev) =>
                prev.map((p) =>
                    p.id === id ? { ...p, seguido: true } : p
                )
            );
        } catch (error) {
            console.error(error);
            Alert.alert("Erro", "Não foi possível seguir este usuário.");
        }
    };

    
 


    if (loading) {
        return (
            <View className="p-4 items-center">
                <ActivityIndicator size="small" color="#007bff" />
            </View>
        );
    }

    if (perfis.length === 0) {
        return (
            <View className="p-4">
                <Text className="text-gray-500">Nenhuma sugestão disponível</Text>
            </View>
        );
    }


    return (
        <View className="p-4 bg-neutral-700 mt-2">
            <Text className="text-lg text-white font-bold mb-3">Sugestões para você</Text>
            <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={perfis}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View className="items-center mr-4 bg-neutral-900 p-3 rounded-xl w-40">
                        <Image
                            source={{ uri: item.foto_perfil }}
                            className="w-16 h-16 rounded-full mb-2 bg-white"
                        />
                        <Text className="font-semibold text-white text-center" numberOfLines={1}>
                            {item.nome_completo}
                        </Text>
                        <Text className="text-xs text-gray-400">@{item.username}</Text>

                        <TouchableOpacity
                            className={`mt-2 px-3 py-1 rounded-lg ${item.seguido ? "bg-gray-600" : "bg-yellow-500"}`}
                            disabled={item.seguido}
                            onPress={() => handleSeguir(item.id)}
                        >
                            <Text className={`font-bold text-sm ${item.seguido ? "text-white" : "text-black"}`}>
                                {item.seguido ? "Seguindo" : "Seguir"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
}