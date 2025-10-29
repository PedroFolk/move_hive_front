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
  Image,
  Keyboard,
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
} from "firebase/firestore";
import { db } from "../../../core/api/firebaseconfig";
import { UsuarioAlheio } from "~/features/profile/api/user";

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
  foto_usuario?: string;
}

export default function ChatModal({ visible, onClose, chatId }: ChatModalProps) {
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [loading, setLoading] = useState(true);
  const [mensagem, setMensagem] = useState("");
  const [enviando, setEnviando] = useState(false);
  const flatListRef = useRef<FlatList<Mensagem>>(null);
  const [meuUsuarioId, setMeuUsuarioId] = useState<string>("");
  const cacheUsuarios = useRef<Record<string, { nome: string; foto: string }>>({});
  const prevCount = useRef(0);


  useEffect(() => {
    (async () => {
      const userId = await SecureStore.getItemAsync("userId");
      if (userId) setMeuUsuarioId(userId);
    })();
  }, []);

  const scrollToBottom = () => {
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  useEffect(() => {
    if (!visible || !chatId) return;
    setLoading(true);

    const q = query(collection(db, "Chat", chatId, "mensagens"), orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const msgs: Mensagem[] = snapshot.docs.map((doc) => ({
        mensagem_id: doc.id,
        ...doc.data(),
      })) as Mensagem[];

      const idsParaBuscar = Array.from(new Set(msgs.map((m) => m.id_remetente))).filter(
        (id) => !cacheUsuarios.current[id]
      );

      if (idsParaBuscar.length > 0) {
        const resultados = await Promise.all(
          idsParaBuscar.map(async (id) => {
            try {
              const usuario = await UsuarioAlheio(id);
              return { id, nome: usuario?.username || "Usuário", foto: usuario?.foto_perfil || "" };
            } catch {
              return { id, nome: "Usuário", foto: "" };
            }
          })
        );
        resultados.forEach((r) => {
          cacheUsuarios.current[r.id] = { nome: r.nome, foto: r.foto };
        });
      }

      const mensagensComDados = msgs.map((m) => ({
        ...m,
        nome_usuario: cacheUsuarios.current[m.id_remetente]?.nome || "Usuário",
        foto_usuario: cacheUsuarios.current[m.id_remetente]?.foto || "",
      }));

      setMensagens(mensagensComDados);
      setLoading(false);

      if (msgs.length > prevCount.current || msgs.length === 1) {
        prevCount.current = msgs.length;
        scrollToBottom();
      }
    });

    return () => unsubscribe();
  }, [visible, chatId]);

  const enviarMensagem = async () => {
    if (!mensagem.trim() || !chatId || !meuUsuarioId) return;

    const texto = mensagem.trim();
    setMensagem(""); 
    Keyboard.dismiss();
    setEnviando(true);

    try {
      await addDoc(collection(db, "Chat", chatId, "mensagens"), {
        texto,
        id_remetente: meuUsuarioId,
        timestamp: serverTimestamp(),
      });

      await updateDoc(doc(db, "Chat", chatId), {
        ultima_mensagem: texto,
        horario_ultima_mensagem: serverTimestamp(),
      });

      scrollToBottom(); // rola ao fim
    } catch (e) {
      console.error("Erro ao enviar mensagem:", e);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 py-safe bg-neutral-900">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >

          <View className="flex-row items-center justify-between p-4 border-b border-neutral-700 bg-neutral-900">
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="arrow-back" size={26} color="#eab308" />
            </TouchableOpacity>
            <Text className="text-lg font-bold text-white">Conversa</Text>
            <View className="w-6" />
          </View>


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
              onContentSizeChange={scrollToBottom}
              ListEmptyComponent={
                <View className="flex-1 items-center justify-center mt-20">
                  <Text className="text-neutral-400 text-base">Nenhuma mensagem ainda.</Text>
                </View>
              }
              renderItem={({ item }) => {
                const minhaMensagem = item.id_remetente === meuUsuarioId;
                const nome = item.nome_usuario || "Usuário";
                const foto = item.foto_usuario || "";

                return (
                  <View
                    className={`mb-3 flex-row items-end ${
                      minhaMensagem ? "self-end flex-row-reverse" : "self-start"
                    }`}
                  >
                    <View className="mx-2">
                      {foto ? (
                        <Image source={{ uri: foto }} className="w-7 h-7 rounded-full" />
                      ) : (
                        <Ionicons name="person-circle" size={28} color="#eab308" />
                      )}
                    </View>

                    <View
                      className={`rounded-2xl px-4 py-3 max-w-[75%] ${
                        minhaMensagem ? "bg-yellow-600" : "bg-neutral-700"
                      }`}
                    >
                      {!minhaMensagem && (
                        <Text className="text-neutral-200 text-xs mb-1">{nome}</Text>
                      )}
                      <Text className="text-white">{item.texto}</Text>
                      <Text className="text-white text-xs text-right mt-1">
                        {item.timestamp
                          ? new Date(
                              item.timestamp.toDate?.() || item.timestamp
                            ).toLocaleTimeString("pt-BR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : ""}
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
              disabled={enviando}
              className={`p-3 rounded-full ${
                enviando ? "bg-yellow-400 opacity-70" : "bg-yellow-500"
              }`}
            >
              {enviando ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Ionicons name="send" size={22} color="white" />
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
