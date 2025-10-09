import { useState, useEffect } from "react";
import { View, Text, FlatList, ScrollView, TouchableOpacity, Image } from "react-native";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";

import { ListarTodosHives } from "~/api/hive";
import { UsuarioAlheio } from "~/api/user";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type HiveType = {
    id: string;
    titulo: string;
    esporte_nome: string;
    foto: string;
    participantes: { uri: string; id: string }[];
    max_participantes: number;
    usuario_id: string;
    localizacao: string;
};

export default function Hive() {
    const [hives, setHives] = useState<HiveType[]>([]);
    const [meuUsuarioId, setMeuUsuarioId] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string>("Todos");

    const TYPES = ["Todos", "Participando", "Meus"];

    useEffect(() => {
        (async () => {
            const userId = await SecureStore.getItemAsync("userId");
            if (userId) setMeuUsuarioId(userId);

            const result = await ListarTodosHives();
            const mapped = await Promise.all(
                result.map(async (h: any) => {
                    const participantesComFoto = await Promise.all(
                        h.participantes.map(async (p: string) => {
                            try {
                                const usuario = await UsuarioAlheio(p);
                                return { uri: usuario?.foto_perfil || "https://via.placeholder.com/150", id: p };
                            } catch {
                                return { uri: "https://via.placeholder.com/150", id: p };
                            }
                        })
                    );
                    return { ...h, participantes: participantesComFoto };
                })
            );

            setHives(mapped);
        })();
    }, []);

    const currentData = hives.filter(hive => {
        if (!meuUsuarioId) return true;

        if (selectedCategory === "Meus") return hive.usuario_id === meuUsuarioId;
        if (selectedCategory === "Participando") return hive.participantes.some(p => p.id === meuUsuarioId) && hive.usuario_id !== meuUsuarioId;

        return true;
    });

    const handleParticipate = (hive: HiveType) => {
        if (hive.participantes.some(p => p.id === meuUsuarioId)) return;

        setHives(prev =>
            prev.map(h =>
                h.id === hive.id
                    ? { ...h, participantes: [...h.participantes, { id: meuUsuarioId, uri: "https://via.placeholder.com/150" }] }
                    : h
            )
        );
    };

    const renderItem = ({ item }: { item: HiveType }) => (
        <View className="flex-row bg-neutral-900 rounded-xl p-3 m-2 items-center">
            <Image
                source={{ uri: item.foto }}
                className="w-32 h-32 rounded-lg"
                resizeMode="cover"
            />
            <View className="flex-1 ml-3 space-y-1">
                <Text className="text-white font-bold mb-4">{item.titulo}</Text>
                <Text className="text-gray-300 mb-2">{item.esporte_nome}</Text>
                <Text className="text-gray-300 mb-2">{item.localizacao}</Text>
                <View className="flex-row mt-1 items-center">
                    {item.participantes.map((p, idx) => (
                        <Image
                            key={idx}
                            source={{ uri: p.uri }}
                            className="w-8 h-8 rounded-full border-2 border-neutral-800 "
                        />
                    ))}
                    <Text className="text-gray-400 ml-2">
                        {item.participantes.length}/{item.max_participantes}
                    </Text>
                </View>
            </View>

            {item.usuario_id !== meuUsuarioId && !item.participantes.some(p => p.id === meuUsuarioId) && (
                <TouchableOpacity
                    className="bg-yellow-500 p-2 rounded-full animate-pulse"
                    onPress={() => handleParticipate(item)}
                >
                    <Text className="text-black font-bold px-2">Participar</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <View className="flex-1 bg-neutral-800 py-safe">
            <View className="px-4 pt-4 flex-row justify-between items-center">
                <Text className="text-white text-2xl font-bold">HIVE</Text>

                <TouchableOpacity onPress={() => router.push("../notifications")}>
                    <MaterialCommunityIcons name="bell-outline" size={28} color="white" />
                </TouchableOpacity>
            </View>


            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4 mt-4 max-h-14">
                {TYPES.map(cat => (
                    <TouchableOpacity
                        activeOpacity={1}
                        key={cat}
                        onPress={() => setSelectedCategory(cat)}
                        className={`mb-2 mr-2 px-6 h-10 justify-center items-center rounded-full border ${selectedCategory === cat ? "bg-white border-transparent" : "bg-neutral-800 border-gray-500 border-2"
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


            <FlatList
                data={currentData}
                keyExtractor={item => item.id}
                renderItem={renderItem}
            />
        </View>
    );
}
