import { router } from "expo-router";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import SugestoesPerfis from "../../components/sugestoesPerfil";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";

const irParaPerfil = (usuario_id: string) => {
    router.push({
        pathname: "/profile",
        params: { userId: usuario_id },
    });

}
export default function SocialPage() {
    const [temNotificacoes, setTemNotificacoes] = useState(false);

    return (
        <View className="bg-neutral-800 w-full h-full py-safe flex">
            <View className="px-4 pt-4 flex-row justify-between items-center">
                <Text className="text-white text-2xl font-bold mb-4">
                    Social
                </Text>

                <TouchableOpacity onPress={() => router.push("../notifications")}>
                    <View className="relative ">

                        <MaterialCommunityIcons name="bell-outline" size={28} color="white" />
                        {temNotificacoes && (
                            <View
                                className=" absolute top-0 left-0 w-2 h-2 rounded-full bg-red-500"

                            />
                        )}
                    </View>
                </TouchableOpacity>
            </View>
            <SugestoesPerfis />
        </View>
    )
}