import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import { useState } from "react";
import * as Haptics from "expo-haptics";

interface Event {
    id?: string;
    title: string;
    description: string;
    dateString: string;
    hourString: string;
    city: string;
    state: string;
    imageUri?: string;
    isPrivate?: boolean;
}

interface EventCardProps {
    event: Event;
    onPress?: () => void;
}

export default function EventCard({ event, onPress }: EventCardProps) {
    const [expanded, setExpanded] = useState(false);

    return (
        <TouchableOpacity
            className="mr-4 mb-4 max-h-64 w-48 bg-neutral-900 rounded-2xl shadow-lg "
            activeOpacity={0.8}
            onPress={() => {
                Haptics.selectionAsync();
                onPress?.();
                setExpanded(p => !p);
            }}
        >
            {event.imageUri ? (
                <Image
                    source={{ uri: event.imageUri }}
                    className="w-full h-40 rounded-t-2xl"
                    resizeMode="cover"
                />
            ) : (
                <View className="w-full h-40 bg-gray-600 justify-center items-center">
                    <Text className="text-white text-4xl font-bold">
                        {event.title[0]}
                    </Text>
                </View>
            )}



            <View className="p-4">
                <Text className="text-white text-lg font-bold mb-1" numberOfLines={1}>
                    {event.title}
                </Text>


                <View>
                    <Text className="text-gray-400 text-sm " numberOfLines={1}>
                        {event.state}, {event.city}
                    </Text>
                    <Text className="text-gray-400 text-sm mb-2" numberOfLines={1}>
                        {event.dateString}
                    </Text>

                </View>





            </View>
        </TouchableOpacity>
    );
}
