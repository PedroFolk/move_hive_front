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
    Modal, // Importação do Modal do React Native
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    UsuariosSeguidores,
    UsuariosSeguidos,
    PararDeSeguirUsuario,
    // SeguirUsuario, // Não é usado diretamente aqui
} from "~/api/user";
// Removida a importação 'router'
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ProfileModal from "./profile";

// Definição das Props para o Modal
interface UsuariosModalProps {
    isVisible: boolean;
    onClose: () => void;
    tipo: "seguindo" | "seguidores"; // Qual lista exibir
    userId?: string; // ID do usuário cujo perfil está sendo exibido
    onUpdate?: () => void; // Função para chamar na tela pai (Perfil) ao seguir/deixar de seguir
    // NOVA PROP: Função para notificar a tela pai que um usuário foi selecionado

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
    const [modalVisible, setModalVisible] = useState(false);
    const [perfilModalId, setPerfilModalId] = useState<string | null>(null);
    // Função para carregar os usuários (mantida)
    const carregarUsuarios = useCallback(async () => {
        setLoading(true);
        try {
            let dados: any[] = [];
            // NOTA: Ajuste suas APIs para aceitar o 'userId' se for listar o perfil de outra pessoa.
            if (tipo === "seguindo") {
                dados = await UsuariosSeguidos(userId);
            } else if (tipo === "seguidores") {
                dados = await UsuariosSeguidores(userId);
            }
            setUsuarios(dados);
            setUsuariosFiltrados(dados);
        } catch (error) {
            console.error("Erro ao carregar usuários:", error);
            setUsuarios([]);
            setUsuariosFiltrados([]);
        }
        setLoading(false);
    }, [tipo, userId]);
    const fecharPerfil = () => {
        setModalVisible(false);
        setPerfilModalId(null);
    }

    // Função para deixar de seguir (mantida)
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
                        carregarUsuarios(); // Recarrega a lista
                        if (onUpdate) onUpdate(); // Notifica a tela pai
                    },
                },
            ]
        );
    };
    const irParaPerfil = (usuario_id: string) => {
        setPerfilModalId(usuario_id);
        setModalVisible(true);
    };

    // Efeitos (mantidos)
    useEffect(() => {
        if (isVisible) {
            // Limpa o filtro e recarrega a lista ao abrir
            setFiltro("");
            carregarUsuarios();
        }
    }, [isVisible, carregarUsuarios]);

    useEffect(() => {
        if (!filtro) {
            setUsuariosFiltrados(usuarios);
        } else {
            const lowerFiltro = filtro.toLowerCase().trim();
            setUsuariosFiltrados(
                usuarios.filter(
                    (u) =>
                        u.username?.toLowerCase().includes(lowerFiltro) ||
                        u.nome_completo?.toLowerCase().includes(lowerFiltro)
                )
            );
        }
    }, [filtro, usuarios]);

    // Componente de Item da Lista (MODIFICADO)
    const renderItem = ({ item }: { item: any }) => (
        <View className="flex-row items-center justify-between p-4 border-b border-gray-700 ">
            <TouchableOpacity
                className="flex-row items-center flex-1 "
                onPress={() => { irParaPerfil(item.id) }}

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
                    <Text className="text-neutral-400 text-sm">{item.nome_completo}</Text>
                </View>
            </TouchableOpacity>

            {tipo === "seguindo" && (
                <TouchableOpacity onPress={() => handlePararDeSeguir(item.id)}>
                    <MaterialCommunityIcons name="close-circle" size={28} color="#f87171" />
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
            <View className="flex-1 bg-neutral-900 py-safe">
                <View className="p-4 border-b border-gray-700 flex-row items-center">
                    {/* Botão para fechar o Modal */}
                    <TouchableOpacity onPress={onClose} className="mr-4">
                        <MaterialCommunityIcons name="arrow-left" size={28} color="white" />
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
                    <ActivityIndicator size="large" color="#facc15" className="mt-4" />
                ) : (
                    <FlatList
                        data={usuariosFiltrados}
                        keyExtractor={(item, index) => item.id || `user-${index}`}
                        renderItem={renderItem}
                        ListEmptyComponent={
                            <Text className="text-white text-center mt-4">
                                Nenhum usuário encontrado
                            </Text>
                        }
                    />
                )}
                <ProfileModal
                    visible={modalVisible}
                    onClose={fecharPerfil} // Função para fechar o modal
                    userId={perfilModalId} // ID do perfil a ser exibido
                    meuUserId={""} // ID do usuário logado
                />
            </View>

        </Modal>
    );
}