import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SeguirUsuario, SugerirPerfis } from "~/api/user";
import ProfileModal from "../app/modals/profile"; // Ajuste o caminho real do seu ProfileModal

// IMPORTANTE: Substitua este valor pela sua lógica real para obter o ID do usuário logado!
const MEU_USER_ID = "ID_DO_USUARIO_LOGADO"; 

export default function SugestoesPerfis() {
  const [perfis, setPerfis] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados para o Modal de Perfil
  const [modalVisible, setModalVisible] = useState(false);
  const [perfilModalId, setPerfilModalId] = useState<string | null>(null);

  /**
   * Define o userId para o modal e o torna visível.
   */
  const irParaPerfil = (usuario_id: string) => {
    setPerfilModalId(usuario_id);
    setModalVisible(true);
  };
  
  /**
   * Fecha o modal e limpa o userId selecionado.
   */
  const fecharModal = () => {
    setModalVisible(false);
    setPerfilModalId(null);
  }

  useEffect(() => {
    const fetchPerfis = async () => {
      try {
        const data = await SugerirPerfis();
        // Filtra o próprio usuário, se necessário
        if (data) setPerfis(data.filter((p: any) => p.id !== MEU_USER_ID)); 
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchPerfis();
  }, []);

  const handleSeguir = async (id: string) => {
    try {
      await SeguirUsuario(id);
      setPerfis((prev) =>
        prev.map((p) => (p.id === id ? { ...p, seguido: true } : p))
      );
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível seguir este usuário.");
    }
  };

  if (loading) {
    return (
      <View className="p-4 items-center">
        <ActivityIndicator size="small" color="#FFD700" />
      </View>
    );
  }

  if (perfis.length === 0) {
    return (
      <View className="p-4 bg-neutral-700 mt-2">
         <Text className="text-lg text-white font-bold mb-3">
          Sugestões para você
        </Text>
        <Text className="text-gray-400">Nenhuma sugestão disponível no momento.</Text>
      </View>
    );
  }

  return (
    <View className="p-4 bg-neutral-700 mt-2">
      <Text className="text-lg text-white font-bold mb-3">
        Sugestões para você
      </Text>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={perfis}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity className="items-center mr-4 bg-neutral-900 p-3 rounded-xl w-40"
            // Chama a nova função para abrir o modal
            onPress={() => { irParaPerfil(item.id) }} 
          >
            <Image
              source={{ uri: item.foto_perfil }}
              className="w-16 h-16 rounded-full mb-2 bg-white"
            />
            <Text
              className="font-semibold text-white text-center"
              numberOfLines={1}
            >
              {item.nome_completo}
            </Text>
            <Text className="text-xs text-gray-400">@{item.username}</Text>

            <TouchableOpacity
              className={`mt-2 px-3 py-1 rounded-lg ${item.seguido ? "bg-gray-600" : "bg-yellow-500"}`}
              disabled={item.seguido}
              onPress={() => handleSeguir(item.id)}
            >
              <Text
                className={`font-bold text-sm ${item.seguido ? "text-white" : "text-black"}`}
              >
                {item.seguido ? "Seguindo" : "Seguir"}
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />

      {/* INSTANCIAÇÃO DO MODAL DE PERFIL */}
      <ProfileModal
        visible={modalVisible}
        onClose={fecharModal} // Função para fechar o modal
        userId={perfilModalId} // ID do perfil a ser exibido
        meuUserId={MEU_USER_ID} // ID do usuário logado
      />
    </View>
  );
}