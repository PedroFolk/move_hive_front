import { useState, useEffect } from "react";
import { Text, ActivityIndicator, View } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import Events from "../events";
import Perfil from "../profile";
import Activity from "../activities";
import Ranking from "../ranking";
import { PreencherDadosModal } from "~/api/user";
import "../../../../global.css";
import ModalFirstTime from "~/components/modals/modalFirstTime";


export default function Main() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const params = useLocalSearchParams();


  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");
        const id = await SecureStore.getItemAsync("userId");

        if (!token) {
          await SecureStore.deleteItemAsync("token");
          await SecureStore.deleteItemAsync("userId");
          router.replace("/login");
        }
      } catch (err) {
        console.error("Erro ao verificar auth:", err);
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (params.novoCadastro === "true") {
      setModalVisible(true);
    }
  }, [params.novoCadastro]);

  const renderContent = () => {
    switch (selectedIndex) {
      case 0:
        return (
          <View className="bg-neutral-800">

            <Events />

          </View>
        );
      case 1:
        return <Activity />;
      case 2:
        return <Ranking />;
      case 3:
      default:
        return <Perfil meuUserId={""} />;
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator size="large" color="#FFD700" />
        <Text className="text-white mt-4">Verificando autenticação...</Text>
      </View>
    );
  }

  return (
    <View
      className={`w-full h-full items-center justify-center flex pt-safe pb-safe bg-neutral-800`}
    >
      {renderContent()}
      <ModalFirstTime
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={async (data) => {
          const result = await PreencherDadosModal(
            data.biografia,
            data.cidade,
            data.estado,
            data.esportes_praticados,
            data.arquivo_foto
          );
          if (!result) {
            alert("Erro ao atualizar perfil.");
          }
        }}
      />
    </View>
  );
}
