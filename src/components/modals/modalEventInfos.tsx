import { useRouter } from "expo-router";
import { Modal, ScrollView, Text, Image, View, TouchableOpacity } from "react-native";
import { MaterialIcons, Entypo } from '@expo/vector-icons'; // ícones para data, hora e local

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
}

export default function ModalEventInfos({
    visible,
    onClose,
    title,
    description,
    dateString,
    hourString,
    city,
    state,
    imageUri,
    isPrivate }: ModalEventInfosProps) {
    const router = useRouter();

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-neutral-800">
                {/* Imagem de destaque */}
                <View style={{ backgroundColor: "rgba(0,0,0,1)" }}>
                    <Image
                        source={{ uri: imageUri }}
                        className="absolute flex-1 w-full h-64 "
                        resizeMode="cover"
                    />
                </View>

                {/* Overlay com título */}
                <View
                    className="h-64 w-full justify-center absolute items-center"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                    <Text className="text-white font-bold text-3xl pt-40 text-center px-4">
                        {title.toUpperCase()}
                    </Text>
                </View>

                {/* Botão fechar */}
                <View className="py-safe px-4 z-10">
                    <TouchableOpacity onPress={onClose}>
                        <Text className="text-white text-3xl">←</Text>
                    </TouchableOpacity>
                </View>

                {/* Conteúdo */}
                <View className="px-4 mt-32 h-full flex-1 justify-between">
                    <View>
                        <View className="flex justify-between items-start">

                            {/* Local */}
                            <View className="flex-row items-center space-x-2">
                                <Entypo name="location-pin" size={24} color="white" />
                                <Text className="text-white text-lg">{city}, {state}</Text>
                            </View>

                            <View>

                                {/* Data */}
                                <View className="flex-row items-center space-x-2">
                                    <MaterialIcons name="date-range" size={24} color="white" />
                                    <Text className="text-white text-lg">{dateString}</Text>
                                </View>

                                {/* Hora */}
                                <View className="flex-row items-center space-x-2">
                                    <MaterialIcons name="access-time" size={24} color="white" />
                                    <Text className="text-white text-lg">{hourString}</Text>
                                </View>


                            </View>


                        </View>

                        {/* Descrição */}
                        <View>
                            <Text className="text-white font-bold text-xl mt-10 mb-2">Descrição</Text>
                            <Text className="text-white text-base">{description}</Text>
                        </View>






                    </View>
                    {/* Ação */}
                    <TouchableOpacity
                        className="my-safe bg-yellow-500 py-3 rounded-xl items-center"
                        onPress={() => alert("Você confirmou presença!")}
                    >
                        <Text className="text-black font-bold text-lg">Participar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}
