import { useState, useEffect } from "react";
import { View, Text, FlatList, ScrollView, TouchableOpacity, Image, Alert } from "react-native";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";

import { cancelarParticipacaoHive, DeletarHive, ListarTodosHives, ParticiparHive } from "~/api/hive";
import { UsuarioAlheio } from "~/api/user";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import HiveCreationModal from "~/components/modals/modalHive";
import AddButton from "~/components/addButton";

type HiveType = {
    id: string;
    titulo: string;
    esporte_nome: string;
    foto: string;
    participantes: { uri: string; id: string }[];
    max_participantes: number;
    usuario_id: string;
    localizacao: string;
    data_hora: string;
    descricao: string;
    endereco: string
    privado: boolean;
    observacoes: string;
};

export default function Hive() {
    const [hives, setHives] = useState<HiveType[]>([]);
    const [meuUsuarioId, setMeuUsuarioId] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string>("Participando");
    const [modalVisible, setModalVisible] = useState(false);
    const [hiveToEdit, setHiveToEdit] = useState<HiveType | undefined>(undefined);


    const TYPES = ["Todos", "Participando", "Meus"];

    useEffect(() => {
        (async () => {
            const userId = await SecureStore.getItemAsync("userId");
            if (userId) {
                setMeuUsuarioId(userId);
                await loadHives(userId);
            }
        })();
    }, []);

    const loadHives = async (userId: string) => {
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
    };


    const currentData = hives.filter(hive => {
        if (!meuUsuarioId) return true;

        if (selectedCategory === "Meus") {
            return hive.usuario_id === meuUsuarioId;
        }

        if (selectedCategory === "Participando") {
            return hive.usuario_id !== meuUsuarioId && hive.participantes.some(p => p.id === meuUsuarioId);
        }

        if (selectedCategory === "Todos") {
            return hive.usuario_id !== meuUsuarioId && !hive.participantes.some(p => p.id === meuUsuarioId);
        }

        return true;
    });


    const handleParticipate = async (hive: HiveType) => {
        if (hive.participantes.some(p => p.id === meuUsuarioId)) return;

        try {
            await ParticiparHive(hive.id);
            setHives(prev =>
                prev.map(h =>
                    h.id === hive.id
                        ? {
                            ...h,
                            participantes: [
                                ...h.participantes,
                                { id: meuUsuarioId, uri: "https://via.placeholder.com/150" },
                            ],
                        }
                        : h
                )
            );
        } catch (error) {
            console.error("Erro ao participar do hive:", error);
        }
    };


    const handleCancelParticipation = async (hive: HiveType) => {

        Alert.alert(
            "Confirmar exclusão",
            "Tem certeza que deseja deletar este Hive?",
            [
                {
                    text: "Cancelar",
                    style: "cancel",
                }, {
                    text: "Deletar",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await cancelarParticipacaoHive(hive.id);
                            setHives(prev =>
                                prev.map(h =>
                                    h.id === hive.id
                                        ? {
                                            ...h,
                                            participantes: h.participantes.filter(p => p.id !== meuUsuarioId),
                                        }
                                        : h
                                )
                            );
                        } catch (error) {
                            console.error("Erro ao cancelar participação:", error);
                        }


                    }
                }
            ]
        );
    };


    const handleDelete = (hiveId: string) => {
        Alert.alert(
            "Confirmar exclusão",
            "Tem certeza que deseja deletar este Hive?",
            [
                {
                    text: "Cancelar",
                    style: "cancel",
                },
                {
                    text: "Deletar",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await DeletarHive(hiveId);
                            setHives(prev => prev.filter(h => h.id !== hiveId));
                        } catch (error) {
                            console.error("Erro ao deletar o hive:", error);
                        }
                    },
                },
            ]
        );
    };

    const handleEdit = (hive: HiveType) => {
        setHiveToEdit(hive);
        setModalVisible(true);
    };

    const handleSaveHive = async () => {
        await loadHives(meuUsuarioId);
        setModalVisible(false);
        setHiveToEdit(undefined);
    };


    const handleCreate = () => {
        setHiveToEdit(undefined);
        setModalVisible(true);
    };

    const renderItem = ({ item }: { item: HiveType }) => (
        <View className="flex-row bg-neutral-900 rounded-xl p-3 m-2 items-center mt-4 ">
            <Image
                source={{ uri: item.foto }}
                className="w-32 h-32 rounded-lg"
                resizeMode="cover"
            />

            <View className="flex-1 ml-3 space-y-1">
                <Text className="text-white font-bold mb-1">{item.titulo}</Text>
                <Text className="text-gray-300">{item.esporte_nome}</Text>
                <Text className="text-gray-300">{item.localizacao}</Text>

                <View className="flex-row mt-2 items-center">
                    {item.participantes.slice(0, 5).map((p) => (
                        <Image
                            key={p.id}
                            source={{ uri: p.uri }}
                            className="w-8 h-8 rounded-full border-2 border-neutral-800 -ml-2"
                        />
                    ))}
                    {item.participantes.length > 5 && (
                        <View className="w-8 h-8 rounded-full bg-gray-700 justify-center items-center -ml-2 border-2 border-neutral-800">
                            <Text className="text-xs text-white font-bold">
                                +{item.participantes.length - 5}
                            </Text>
                        </View>
                    )}
                    <Text className="text-gray-400 ml-2">
                        {item.participantes.length}/{item.max_participantes}
                    </Text>
                </View>
            </View>

            <View className="ml-2">
                {item.usuario_id === meuUsuarioId && selectedCategory === "Meus" ? (
                    <View className="flex justify-between flex-1">
                        <TouchableOpacity
                            className="p-2 bg-red-600 rounded-full"
                            onPress={() => handleDelete(item.id)}
                        >
                            <MaterialIcons name="delete" size={22} color="white" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="p-2 bg-yellow-500 rounded-full"
                            onPress={() => handleEdit(item)}
                        >
                            <MaterialIcons name="edit" size={22} color="black" />
                        </TouchableOpacity>
                    </View>
                ) : item.usuario_id !== meuUsuarioId && item.participantes.some(p => p.id === meuUsuarioId) ? (
                    <TouchableOpacity
                        className="p-2 bg-red-500 rounded-full"
                        onPress={() => handleCancelParticipation(item)}
                    >
                        <MaterialIcons name="close" size={22} color="white" />
                    </TouchableOpacity>
                ) : item.usuario_id !== meuUsuarioId ? (
                    <TouchableOpacity
                        className="p-2 bg-yellow-500 rounded-full animate-pulse"
                        onPress={() => handleParticipate(item)}
                    >
                        <MaterialCommunityIcons name="account-plus" size={22} color="black" />
                    </TouchableOpacity>
                ) : null}
            </View>
        </View>
    );



    return (
        <View className="flex-1 bg-neutral-800 py-safe">
            <View className="px-4 pt-4 flex-row justify-between items-center">
                <Text className="text-white text-2xl font-bold">HIVE</Text>
                <View className="flex-row">
                    <TouchableOpacity onPress={() => router.push("../feed")}>
                        <MaterialCommunityIcons name="bell-outline" size={28} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity className="ml-4" onPress={() => router.push("../notifications")}>
                        <MaterialCommunityIcons name="chat-processing-outline" size={28} color="white" />
                    </TouchableOpacity>

                </View>



            </View>


            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4 mt-4 max-h-10">
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
                initialNumToRender={5}
                windowSize={10}
            />

            <AddButton onPress={() => { handleCreate() }} />

            <HiveCreationModal
                visible={modalVisible}
                onClose={() => {
                    setModalVisible(false);
                    setHiveToEdit(undefined);
                }}
                onSave={handleSaveHive}
                hiveToEdit={hiveToEdit}
            />


        </View>


    );

}

