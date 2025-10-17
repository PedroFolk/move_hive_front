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
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import {
  query,
  collection,
  orderBy,
  onSnapshot,
  serverTimestamp,
  addDoc,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebaseconfig";
import { UsuarioAlheio } from "~/api/user";

interface ChatModalProps {
  visible: boolean;
  onClose: () => void;
  chatId: string;
}

interface Mensagem {
  mensagem_id: string;
  id_remetente: string;
  texto: string;
  timestamp?: any;
  nome_usuario?: string;
}

export default function ChatModal({ visible, onClose, chatId }: ChatModalProps) {
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const flatListRef = useRef<FlatList<Mensagem>>(null);
  const [meuUsuarioId, setMeuUsuarioId] = useState<string>("");
  const [fotosUsuarios, setFotosUsuarios] = useState<Record<string, string>>({}); 

  useEffect(() => {
    (async () => {
      const userId = await SecureStore.getItemAsync("userId");
      if (userId) setMeuUsuarioId(userId);
    })();
  }, []);

  useEffect(() => {
    if (!visible || !chatId) return;

    const q = query(
      collection(db, "Chat", chatId, "mensagens"),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const novas: Mensagem[] = snapshot.docs.map((doc) => ({
        mensagem_id: doc.id,
        ...doc.data(),
      })) as Mensagem[];

      setMensagens(novas);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [visible, chatId]);

  useEffect(() => {
    if (!meuUsuarioId || mensagens.length === 0) return;

    const buscarFotos = async () => {
      const ids = mensagens
        .map((m) => m.id_remetente?.toString().trim())

      if (ids.length === 0) return;

      const promessas = ids.map(async (id) => {
        const usuario = await UsuarioAlheio(id);
        return { id, foto: usuario?.foto_perfil || "" };
      });

      const resultados = await Promise.all(promessas);

      const novasFotos: Record<string, string> = {};
      resultados.forEach((r) => {
        if (r.foto) novasFotos[r.id] = r.foto;
      });

      setFotosUsuarios((prev) => ({ ...prev, ...novasFotos }));
    };

    buscarFotos();
  }, [mensagens, meuUsuarioId]);



  useEffect(() => {
    if (mensagens.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [mensagens]);

  const formatarData = (timestamp: any) => {
    if (!timestamp) return "";
    try {
      const data =
        timestamp instanceof Date
          ? timestamp
          : timestamp.toDate
            ? timestamp.toDate()
            : new Date(timestamp);
      return data.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  const enviarMensagem = async () => {
    if (!mensagem.trim() || !chatId || !meuUsuarioId) return;

    try {
      const userRef = doc(db, "Usuarios", meuUsuarioId);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.exists() ? userSnap.data() : null;

      await addDoc(collection(db, "Chat", chatId, "mensagens"), {
        texto: mensagem,
        id_remetente: meuUsuarioId,
        timestamp: serverTimestamp(),
        nome_usuario: userData?.nome || "Usuário",
      });

      await updateDoc(doc(db, "Chat", chatId), {
        ultima_mensagem: mensagem,
        horario_ultima_mensagem: new Date().toISOString(),
      });

      setMensagem("");
    } catch (e) {
      console.error("Erro ao enviar mensagem:", e);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 py-safe bg-neutral-900">
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
            <FlatList<Mensagem>
              ref={flatListRef}
              data={mensagens}
              keyExtractor={(item) => item.mensagem_id}
              contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={() => { }}
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
                  remetenteId && meuUsuarioId && remetenteId === meuUsuarioId.trim();

                const nome = item.nome_usuario || "Usuário";

                const foto = fotosUsuarios[remetenteId]; 


                return (
                  <View
                    className={`mb-3 flex-row items-end ${minhaMensagem ? "self-end flex-row-reverse" : "self-start"
                      }`}
                  >
                    {/* Foto */}
                    <View className="mx-2">
                      {foto ? (
                        <Image source={{ uri: foto }} className="w-7 h-7 rounded-full" />
                      ) : (
                        <Ionicons name="person-circle" size={28} color="#eab308" />
                      )}
                    </View>

                    {/* Balão */}
                    <View
                      className={`rounded-2xl px-4 py-3 max-w-[75%] ${minhaMensagem ? "bg-yellow-600" : "bg-neutral-700"
                        }`}
                    >
                      {!minhaMensagem && (
                        <Text className="text-neutral-200 text-xs mb-1">{nome}</Text>
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

          {/* Campo de envio */}
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
      </View>
    </Modal>
  );
}
