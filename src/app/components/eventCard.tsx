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
        <View className="bg-neutral-900 rounded-2xl mb-4 overflow-hidden shadow-lg">
            <TouchableOpacity onPress={() => setExpanded((p) => !p)} activeOpacity={0.8}>
                {event.imageUri ? (
                    <Image source={{ uri: event.imageUri }} className="w-full h-40" resizeMode="cover" />
                ) : (
                    <View className="w-full h-40 bg-gray-700 justify-center items-center">
                        <MaterialIcons name="image" size={48} color="#9ca3af" />
                    </View>
                )}
            </TouchableOpacity>

            <View className="p-4">
                <View className="flex-row justify-between items-start">
                    <Text className="text-white text-lg font-bold flex-1 pr-2">{event.title}</Text>
                    {onDelete && (
                        <TouchableOpacity onPress={onDelete}>
                            <MaterialIcons name="delete" size={24} color="#ef4444" />
                        </TouchableOpacity>
                    )}
                </View>

                <View className="flex-row items-center mt-2">
                    <MaterialIcons name="access-time" size={16} color="#fbbf24" />
                    <Text className="text-gray-300 text-sm ml-1">{event.hourString}</Text>
                </View>

                <View className="flex-row items-center mt-1">
                    <MaterialIcons name="place" size={16} color="#3b82f6" />
                    <Text className="text-gray-300 text-sm ml-1">{event.state}, {event.city}</Text>
                </View>

                <Text className="text-gray-400 text-sm mt-1">{event.dateString}</Text>
                {expanded && (
                    <View className="mt-3 border-t border-gray-700 pt-3">
                        <Text className="text-gray-200 text-sm">{event.description}</Text>

                        {onParticipate && (
                            <TouchableOpacity
                                className={`mt-3 py-2 rounded-full ${isParticipated ? "bg-white" : "bg-yellow-500"}`}
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
                                        onParticipate();
                                    }
                                }}
                            >
                                <Text className={`text-center font-semibold ${isParticipated ? "text-black" : "text-black"}`}>
                                    {isParticipated ? "Já inscrito" : "Inscreva-se"}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </View>
        </View>
    );
}
