import React, { useState, useEffect } from "react";
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    Image,
    Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SeguirUsuario, TodosPerfis } from "~/features/profile/api/user";

interface ModalSearchUserProps {
    visible: boolean;
    onClose: () => void;
}

export default function ModalSearchUser({
    visible,
    onClose,
}: ModalSearchUserProps) {
    const [query, setQuery] = useState("");
    const [usuarios, setUsuarios] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (visible) {
            carregarUsuarios();
        } else {
            setQuery("");
            setUsuarios([]);
        }
    }, [visible]);

    const handleSeguir = async (id: string) => {
        try {
            await SeguirUsuario(id);
            await carregarUsuarios();
        } catch (error) {
            console.error(error);
            Alert.alert("Erro", "Não foi possível seguir este usuário.");
        }
    };

    const carregarUsuarios = async () => {
        setLoading(true);
        try {
            const data = await TodosPerfis();
            setUsuarios(data);
        } catch (error) {
            console.log("Erro ao carregar usuários:", error);
        } finally {
            setLoading(false);
        }
    };

    const filtrar = () => {
        if (!query.trim()) return usuarios;
        return usuarios.filter((u) => {
            const username = u?.username ? String(u.username).toLowerCase() : "";
            const nome = u?.nome_completo ? String(u.nome_completo).toLowerCase() : "";
            return (
                username.includes(query.toLowerCase()) ||
                nome.includes(query.toLowerCase())
            );
        });
    };


    const renderItem = ({ item }: { item: any }) => (
        <View className="flex-row items-center px-4 py-4 justify-between ">

            <View className="flex-row items-center">
                {item.foto_perfil ? (
                    <Image
                        source={{ uri: item.foto_perfil }}
                        className="w-10 h-10 rounded-full mr-3"
                    />
                ) : (
                    <View className="w-10 h-10 bg-neutral-600 rounded-full mr-3 items-center justify-center">
                        <Text className="text-white font-bold">
                            {item.username ? item.username[0].toUpperCase() : "U"}
                        </Text>
                    </View>
                )}

                <View>
                    <Text className="text-white font-bold">{item.nome_completo}</Text>
                    <Text className="text-neutral-400">@{item.username}</Text>
                </View>
            </View>

            <TouchableOpacity
                className="bg-yellow-500 px-3 py-1 rounded-lg"
                onPress={() => {
                    handleSeguir(item.id);
                }}
            >
                <Text className="text-black font-bold text-sm">Seguir</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View className="flex-1 bg-black/70 justify-center">
                <View className="bg-neutral-900 rounded-2xl mx-4 p-4 max-h-[80%]">

                    <View className="flex-row border-b border-neutral-700 mb-4 pb-2 items-center">
                        <Ionicons name="search" size={30} color="white" />
                        <TextInput
                            className="flex-1 ml-2 text-white text-lg py-2"
                            placeholder="Buscar usuário..."
                            placeholderTextColor="#aaa"
                            value={query}
                            onChangeText={setQuery}
                        />
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={32} color="white" />
                        </TouchableOpacity>
                    </View>


                    {loading ? (
                        <Text className="text-white text-center mt-4">Carregando...</Text>
                    ) : (
                        <FlatList
                            data={filtrar()}
                            keyExtractor={(item, index) => String(item.id ?? index)}

                            renderItem={renderItem}
                            ListEmptyComponent={
                                <Text className="text-neutral-400 text-center mt-4 ">
                                    Nenhum usuário encontrado
                                </Text>
                            }
                        />
                    )}
                </View>
            </View>
        </Modal>
    );
}
