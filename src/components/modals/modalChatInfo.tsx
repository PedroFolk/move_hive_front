import { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  SafeAreaView,
  Image,
} from "react-native";
import { ConversaChatId, EnviarMensagemChat } from "~/api/chat";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";

interface ChatModalProps {
  visible: boolean;
  onClose: () => void;
  chatId: string;
}

export default function ChatModal({
  visible,
  onClose,
  chatId,
}: ChatModalProps) {
  const [mensagens, setMensagens] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const flatListRef = useRef<FlatList<any>>(null);
  const [meuUsuarioId, setMeuUsuarioId] = useState<string>("");

  useEffect(() => {
    (async () => {
      const userId = await SecureStore.getItemAsync("userId");
      if (userId) setMeuUsuarioId(userId);
    })();
  }, []);

  const carregarConversa = async () => {
    setRefreshing(true);
    try {
      const conversa = await ConversaChatId(chatId);
      if (conversa) {
        const ordenadas = conversa.sort(
          (
            a: { timestamp: string | number | Date },
            b: { timestamp: string | number | Date }
          ) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        setMensagens(ordenadas);
      } else {
        setMensagens([]);
      }
    } catch (e) {
      console.error(e);
    }
    setRefreshing(false);
    setLoading(false);
  };

  useEffect(() => {
    if (visible) carregarConversa();
  }, [visible]);

  useEffect(() => {
    if (mensagens.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [mensagens]);

  const enviarMensagem = async () => {
    if (!mensagem.trim()) return;

    const nova = {
      mensagem_id: Date.now().toString(),
      texto: mensagem,
      id_remetente: meuUsuarioId,
      timestamp: new Date().toISOString(),
      nome_usuario: "Você",
      foto_usuario: null, // Aqui você pode colocar sua foto real
    };

    setMensagens((prev) => [...prev, nova]);
    setMensagem("");

    try {
      await EnviarMensagemChat(chatId, mensagem);
    } catch (e) {
      console.error("Erro ao enviar mensagem:", e);
    }
  };

  const formatarData = (dataStr: string) => {
    try {
      const data = new Date(dataStr);
      if (isNaN(data.getTime())) return "";
      return data.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <SafeAreaView className="flex-1 bg-neutral-900">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          {/* Cabeçalho */}
          <View className="flex-row items-center justify-between p-4 border-b border-neutral-700 bg-neutral-900">
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="arrow-back" size={26} color="#eab308" />
            </TouchableOpacity>
            <Text className="text-lg font-bold text-white">Conversa</Text>
            <View className="w-6" />
          </View>

          {/* Corpo */}
          {loading ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color="#eab308" />
            </View>
          ) : (
            <FlatList
              ref={flatListRef}
              data={mensagens}
              keyExtractor={(item) => item.mensagem_id}
              contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={carregarConversa}
                  tintColor="#eab308"
                />
              }
              ListEmptyComponent={
                <View className="flex-1 items-center justify-center mt-20">
                  <Text className="text-neutral-400 text-base">
                    Nenhuma mensagem ainda.
                  </Text>
                </View>
              }
              renderItem={({ item }) => {
                const remetenteId = item.id_remetente?.toString().trim() ?? "";
                const minhaMensagem =
                  remetenteId &&
                  meuUsuarioId &&
                  remetenteId === meuUsuarioId.trim();

                const nome = item.nome_usuario || "Usuário";

                return (
                  <View
                    className={`mb-3 flex-row items-end ${
                      minhaMensagem ? "self-end flex-row-reverse" : "self-start"
                    }`}
                  >
                    {/* Foto */}
                    <View className="mx-2">
                      {item.foto_usuario ? (
                        <Image
                          source={{ uri: item.foto_usuario }}
                          className="w-7 h-7 rounded-full"
                        />
                      ) : (
                        <Ionicons
                          name="person-circle"
                          size={28}
                          color="#eab308"
                        />
                      )}
                    </View>

                    {/* Balão de mensagem */}
                    <View
                      className={`rounded-2xl px-4 py-3 max-w-[75%] ${
                        minhaMensagem ? "bg-yellow-600" : "bg-neutral-700"
                      }`}
                    >
                      {!minhaMensagem && (
                        <Text className="text-neutral-200 text-xs mb-1">
                          {nome}
                        </Text>
                      )}
                      <Text className="text-white">{item.texto}</Text>
                      <Text className="text-white text-xs text-right mt-1">
                        {formatarData(item.timestamp)}
                      </Text>
                    </View>
                  </View>
                );
              }}
            />
          )}

          <View className="flex-row items-center bg-neutral-800 border-t border-neutral-700 px-4 py-3">
            <TextInput
              value={mensagem}
              onChangeText={setMensagem}
              placeholder="Digite uma mensagem..."
              placeholderTextColor="#999"
              className="flex-1 text-white bg-neutral-700 rounded-full px-4 py-3 mr-3"
              multiline
            />
            <TouchableOpacity
              onPress={enviarMensagem}
              className="bg-yellow-600 p-3 rounded-full"
            >
              <Ionicons name="send" size={22} color="white" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}
