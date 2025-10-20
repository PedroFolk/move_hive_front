import { useState, useEffect } from "react";
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { CriarComentario, ListarComentariosPost, DeletarComentario } from "~/api/feed";

interface ModalComentariosProps {
    visible: boolean;
    onClose: () => void;
    post: any;
    fotoPerfil?: string;
    onNovoComentario?: () => void;
}

interface Comentario {
    comentario_id: number;
    foto_perfil?: string;
    username: string;
    data_criacao: string;
    comentario: string;
    usuario_id?: string;
}

export default function ModalComentarios({
    visible,
    onClose,
    post,

    onNovoComentario,
}: ModalComentariosProps) {
    const [comentarios, setComentarios] = useState<Comentario[]>([]);
    const [novoComentario, setNovoComentario] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingEnvio, setLoadingEnvio] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            const id = await SecureStore.getItemAsync("userId");
            setUserId(id);
        })();

    }, []);

    useEffect(() => {
        if (visible && post?.postagem?.id) carregarComentarios();
    }, [visible, post]);

    const carregarComentarios = async () => {
        try {
            setLoading(true);
            const comentariosData = await ListarComentariosPost(post.postagem.id);
            setComentarios(comentariosData[0] || []);
        } catch (e) {
            console.log("Erro ao carregar comentários:", e);
        } finally {
            setLoading(false);
        }
    };

    const enviarComentario = async () => {
        if (!novoComentario.trim()) return;
        try {
            setLoadingEnvio(true);
            await CriarComentario(post.postagem.id, novoComentario);
            setNovoComentario("");
            Keyboard.dismiss();

            if (onNovoComentario) onNovoComentario();

            await carregarComentarios();
        } catch (e) {
            console.log("Erro ao enviar comentário:", e);
        } finally {
            setLoadingEnvio(false);
        }
    };

    const deletarComentario = async (comentario_id: any) => {
        Alert.alert("Excluir comentário", "Deseja realmente excluir este comentário?", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Excluir",
                style: "destructive",
                onPress: async () => {
                    try {
                        await DeletarComentario(post.postagem.id, comentario_id);
                        await carregarComentarios();
                    } catch (e) {
                        console.log("Erro ao deletar comentário:", e);
                    }
                },
            },
        ]);
    };

    if (!visible || !post) return null;

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View className="flex-1 justify-end bg-black/60">
                <View className="h-[60%] bg-neutral-800 rounded-t-3xl flex-col">
                    <View className="flex-1 px-4 py-4">
                        <View className="flex-row justify-between items-center mb-3">
                            <Text className="text-white text-lg font-bold">Comentários</Text>
                            <TouchableOpacity onPress={onClose}>
                                <Ionicons name="close" size={24} color="white" />
                            </TouchableOpacity>
                        </View>

                        {loading ? (
                            <ActivityIndicator color="#facc15" />
                        ) : (
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                className="flex-1"
                                contentContainerStyle={{ paddingBottom: 60 }}
                            >
                                {comentarios.map((item, index) => (
                                    <View key={index} className="my-4 flex-row items-start">
                                        {item.foto_perfil ? (
                                            <Image
                                                source={{ uri: item.foto_perfil }}
                                                className="w-8 h-8 rounded-full mr-2"
                                            />
                                        ) : (
                                            <View className="w-8 h-8 rounded-full bg-neutral-700 mr-2" />
                                        )}
                                        <View className="flex-row justify-between flex-1 ">
                                            <View className="flex justify-between mb-1">
                                                <View className="flex-row items-center">
                                                    <Text className="text-white font-bold mr-2">
                                                        @{item.username || "usuário"}
                                                    </Text>
                                                    {item.data_criacao && (
                                                        <Text className="text-neutral-400 text-xs">
                                                            {new Date(item.data_criacao).toLocaleTimeString(
                                                                "pt-BR",
                                                                { hour: "2-digit", minute: "2-digit" }
                                                            )}
                                                        </Text>
                                                    )}
                                                </View>



                                                <Text className="text-white text-sm">{item.comentario}</Text>
                                            </View>
                                            <View className=" justify-center">


                                                {item.usuario_id === userId && (

                                                    <TouchableOpacity onPress={() => deletarComentario(item.comentario_id)}>
                                                        <Ionicons name="trash" size={24} color="#f87171" />
                                                    </TouchableOpacity>
                                                )}
                                            </View>
                                        </View>
                                    </View>
                                ))}
                            </ScrollView>
                        )}
                    </View>
                </View>

                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    className="absolute bottom-0 w-full"
                    keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -500}
                >
                    <View className="bg-neutral-800 border-t border-neutral-700 pt-3 pb-safe px-4">
                        <View className="flex-row items-center">
                            <TextInput
                                value={novoComentario}
                                onChangeText={setNovoComentario}
                                placeholder="Digite uma mensagem..."
                                placeholderTextColor="#999"
                                className="flex-1 text-white bg-neutral-700 rounded-full px-4 py-3 mr-3"
                                multiline
                            />
                            <TouchableOpacity
                                onPress={enviarComentario}
                                className="bg-yellow-500 p-3 rounded-full"
                                disabled={loadingEnvio || !novoComentario.trim()}
                            >
                                {loadingEnvio ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Ionicons name="send" size={22} color="white" />
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
}
