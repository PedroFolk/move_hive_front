import { useRouter } from "expo-router";
import { Modal, ScrollView, Text, Image, View, TouchableOpacity, ActivityIndicator } from "react-native";
import { MaterialIcons, Entypo, Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { ParticiparEvento, CancelarParticipacao } from "~/api/event";

type ModalEventInfosProps = {
    visible: boolean;
    onClose: () => void;
    id?: string;
    title: string;
    description: string;
    dateString: string;
    hourString: string;
    city: string;
    state: string;
    imageUri?: string;
    isPrivate?: boolean;
    participantes?: { id: string }[];
}

export default function ModalEventInfos({
    id,
    visible,
    onClose,
    title,
    description,
    dateString,
    hourString,
    city,
    state,
    imageUri,
    isPrivate,
    participantes
}: ModalEventInfosProps) {
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isParticipated, setIsParticipated] = useState(false);

    useEffect(() => {
        const fetchUserId = async () => {
            const id = await SecureStore.getItemAsync("userId");
            setUserId(id);
        };
        fetchUserId();
    }, []);

    // Atualiza o estado quando o modal abrir ou quando participantes mudarem
    useEffect(() => {
        if (userId && participantes) {
            setIsParticipated(participantes.some(p => p.id === userId));
        }
    }, [userId, participantes, visible]);

    const handleParticipate = async () => {
        if (!id || !userId || loading) return; // evita múltiplos cliques
        setLoading(true);

        try {
            if (!isParticipated) {
                await ParticiparEvento(id);
            } else {
                await CancelarParticipacao(id);
            }
            // Atualiza o estado local após a ação
            setIsParticipated(!isParticipated);
        } catch (error) {
            console.log("Erro ao atualizar participação:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <View className="flex-1 py-safe bg-neutral-800">
                <View>
                    <View className="px-4 py-2 z-10 flex-row justify-between items-center">
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={30} color="#fff" />
                        </TouchableOpacity>

                        <Text className="text-white text-2xl font-semibold">{title}</Text>

                        <TouchableOpacity className="bg-neutral-800">
                            <Ionicons name="close" size={30} color="#262626" />
                        </TouchableOpacity>
                    </View>

                    <View>
                        {imageUri ? (
                            <Image source={{ uri: imageUri }} className=" shadow-md m-4 rounded-lg h-64" resizeMode="cover" />
                        ) : (
                            <View className="h-64 rounded-lg mt-4 mx-4 bg-neutral-900 justify-center items-center">
                                <Text className="text-white text-2xl">Não foi possível carregar a imagem</Text>
                            </View>
                        )}
                    </View>
                </View>

                <View className="px-4 pt-4 h-full flex-1 justify-between shadow-md">
                    <ScrollView className="mt-[-10] h-full bg-neutral-900 rounded-lg p-4">
                        <View className="flex justify-between items-start ">
                            <View className="flex-row items-center ">
                                <Entypo name="location-pin" size={24} color="white" className="mr-2" />
                                <Text className="text-white text-lg">{city}, {state}</Text>
                            </View>

                            <View>
                                <View className="flex-row items-center mt-2">
                                    <MaterialIcons name="date-range" size={24} color="white" className="mr-2" />
                                    <Text className="text-white text-lg">{dateString}</Text>
                                </View>

                                <View className="flex-row items-center mt-2">
                                    <MaterialIcons name="access-time" size={24} color="white" className="mr-2" />
                                    <Text className="text-white text-lg">{hourString}</Text>
                                </View>
                            </View>
                        </View>

                        <View>
                            <Text className="text-white font-semibold text-xl mt-6 mb-2">Descrição</Text>
                            <Text className="text-white text-base">{description}</Text>
                        </View>
                    </ScrollView>

                    <TouchableOpacity
                        className={`my-safe py-3 rounded-xl items-center shadow-md ${isParticipated ? '  bg-red-900' : 'bg-yellow-500'}`}
                        onPress={handleParticipate}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#000" />
                        ) : (
                            <Text className={`${isParticipated ? 'text-neutral-400' : 'text-black'} font-bold text-lg`}>
                                {isParticipated ? "Cancelar Participação" : "Participar"}
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}
