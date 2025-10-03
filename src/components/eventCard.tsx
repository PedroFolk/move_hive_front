import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";

interface Event {
    id?: string;
    title: string;
    sport: string;
    description: string;
    dateString: string;
    city: string;
    state: string;
    hourString: string;
    imageUri?: string;
    participantes?: { id: string }[];
}

interface EventCardProps {
    event: Event;
    userId: string | null;
    onDelete?: () => void;
    onParticipate?: () => void;
}

export default function EventCard({ event, userId, onDelete, onParticipate }: EventCardProps) {
    const [expanded, setExpanded] = useState(false);
    const isParticipated = userId ? event.participantes?.some(p => p.id === userId) ?? false : false;

    return (
        <View className="mb-6">
            <TouchableOpacity onPress={() => setExpanded(p => !p)} activeOpacity={0.8}>
                <View className="flex-row bg-neutral-900 border-2 border-neutral-600 rounded-2xl overflow-hidden">
                    {event.imageUri ? (
                        <Image
                            source={{ uri: event.imageUri }}
                            className="w-40 h-40"
                            resizeMode="cover"
                        />
                    ) : (
                        <View className="w-40 h-40 bg-neutral-600 justify-center items-center">
                            <Text className="text-white font-bold text-2xl">{event.title[0]}</Text>
                        </View>
                    )}
                    <View className="flex-1 p-4 justify-between">
                        <View>
                            <Text className="text-white text-lg font-semibold mb-1">{event.title}</Text>

                            <View className="flex-row mb-1 items-center">
                                <MaterialIcons name="access-time" size={14} color="#fbbf24" />
                                <Text className="text-gray-400 text-sm ml-1">{event.hourString}</Text>
                            </View>

                            <View className="flex-row mb-1 items-center">
                                <MaterialIcons name="place" size={14} color="#3b82f6" />
                                <Text className="text-gray-400 text-sm ml-1">{event.state}, {event.city}</Text>
                            </View>

                            {expanded && (
                                <Text className="text-gray-300 text-sm mt-1">{event.description}</Text>
                            )}
                        </View>
                        <TouchableOpacity
                            className={`mt-2 py-2 rounded-lg ${isParticipated ? "bg-red-500 text-white" : "bg-yellow-500 text-black"}`}
                            onPress={() => {
                                if (isParticipated) {
                                    Alert.alert(
                                        "Cancelar participação",
                                        "Deseja realmente cancelar sua participação neste evento?",
                                        [
                                            { text: "Não", style: "cancel" },
                                            { text: "Sim", style: "destructive", onPress: onParticipate },
                                        ]
                                    );
                                } else {
                                    onParticipate?.();
                                }
                            }}
                        >
                            <Text className={`text-center font-semibold ${isParticipated ? "text-black" : "text-black"}`}>
                                {isParticipated ? "Cancelar Inscrição" : "Inscreva-se"}
                            </Text>
                        </TouchableOpacity>

                    </View>



                    {onDelete && (
                        <TouchableOpacity onPress={onDelete} className="absolute top-2 right-2 p-1 z-10">
                            <MaterialIcons name="delete" size={20} color="#ef4444" />
                        </TouchableOpacity>
                    )}
                </View>
            </TouchableOpacity>
        </View>
    );
}
