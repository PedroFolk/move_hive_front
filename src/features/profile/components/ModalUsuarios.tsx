import React, { useEffect, useState, useCallback } from "react";
import {
    View,
    Text,
    FlatList,
    TextInput,
    Image,
    ActivityIndicator,
    TouchableOpacity,
    Alert,
    Modal,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { UsuariosSeguidos, UsuariosSeguidores, PararDeSeguirUsuario } from "~/features/profile/api/user";

interface UsuariosModalProps {
    isVisible: boolean;
    onClose: () => void;
    tipo: "seguindo" | "seguidores";
    userId?: string;
    onUpdate?: () => void;
}

export default function UsuariosModal({
    isVisible,
    onClose,
    tipo,
    userId,
    onUpdate,
}: UsuariosModalProps) {
    const [usuarios, setUsuarios] = useState<any[]>([]);
    const [filtro, setFiltro] = useState("");
    const [loading, setLoading] = useState(false);
    const [usuariosFiltrados, setUsuariosFiltrados] = useState<any[]>([]);

    const carregarUsuarios = useCallback(async () => {
        setLoading(true);
        try {
            let dados: any[] = [];
            if (tipo === "seguindo") {
                dados = await UsuariosSeguidos(userId);
            } else if (tipo === "seguidores") {
                dados = await UsuariosSeguidores(userId);
            }
            setUsuarios([...dados]);
            setUsuariosFiltrados([...dados]);
        } catch (error) {
            console.error("Erro ao carregar usuários:", error);
            setUsuarios([]);
            setUsuariosFiltrados([]);
        }
        setLoading(false);
    }, [tipo, userId]);

    const handlePararDeSeguir = (id: string) => {
        Alert.alert(
            "Parar de seguir",
            "Tem certeza que deseja parar de seguir este usuário?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Sim",
                    onPress: async () => {
                        await PararDeSeguirUsuario(id);
                        carregarUsuarios();
                        if (onUpdate) onUpdate();
                    },
                },
            ]
        );
    };

    const irParaPerfil = (usuario_id: string) => {
        onClose(); 
        router.push(`/profile?userId=${usuario_id}`);
    };

    useEffect(() => {
        if (isVisible) {
            setFiltro("");
            carregarUsuarios();
        }
    }, [isVisible, carregarUsuarios]);

    useEffect(() => {
        const lowerFiltro = filtro.toLowerCase().trim();
        const filtrados = usuarios.filter(
            (u) =>
                u.username?.toLowerCase().includes(lowerFiltro) ||
                u.nome_completo?.toLowerCase().includes(lowerFiltro)
        );
        setUsuariosFiltrados(filtrados);
    }, [filtro, usuarios]);

    const renderItem = ({ item }: { item: any }) => (
        <View className="flex-row items-center justify-between p-4 border-b border-gray-700">
            <TouchableOpacity
                className="flex-row items-center flex-1"
                onPress={() => irParaPerfil(item.id)}
            >
                {item.foto_perfil ? (
                    <Image
                        source={{ uri: item.foto_perfil }}
                        className="w-12 h-12 rounded-full"
                    />
                ) : (
                    <View className="w-12 h-12 rounded-full bg-gray-700 items-center justify-center">
                        <Text className="text-white font-bold">
                            {item.username?.[0]?.toUpperCase() || "U"}
                        </Text>
                    </View>
                )}
                <View className="ml-4">
                    <Text className="text-white font-bold">{item.username}</Text>
                    <Text className="text-neutral-400 text-sm">
                        {item.nome_completo}
                    </Text>
                </View>
            </TouchableOpacity>

            {tipo === "seguindo" && (
                <TouchableOpacity onPress={() => handlePararDeSeguir(item.id)}>
                    <MaterialCommunityIcons
                        name="close-circle"
                        size={28}
                        color="#f87171"
                    />
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View className="flex-1 py-safe bg-neutral-900">
                <View className="p-4 border-b border-gray-700 flex-row items-center">
                    <TouchableOpacity onPress={onClose} className="mr-4">
                        <MaterialCommunityIcons
                            name="arrow-left"
                            size={28}
                            color="white"
                        />
                    </TouchableOpacity>
                    <Text className="text-white font-bold text-lg">
                        {tipo === "seguidores" ? "Seguidores" : "Seguindo"}
                    </Text>
                </View>

                <View className="p-4 border-b border-gray-700">
                    <TextInput
                        placeholder="Pesquisar usuários..."
                        placeholderTextColor="#999"
                        className="bg-neutral-800 text-white rounded-xl p-4"
                        value={filtro}
                        onChangeText={setFiltro}
                    />
                </View>

                {loading ? (
                    <ActivityIndicator
                        size="large"
                        color="#facc15"
                        className="mt-4"
                    />
                ) : (
                    <FlatList
                        data={usuariosFiltrados}
                        keyExtractor={(item, index) => String(item.id ?? `user-${index}`)}
                        renderItem={renderItem}
                        ListEmptyComponent={
                            <Text className="text-white text-center mt-4">
                                Nenhum usuário encontrado
                            </Text>
                        }
                    />
                )}
            </View>
        </Modal>
    );
}
