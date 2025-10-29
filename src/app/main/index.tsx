import { useState, useEffect } from "react";
import { Text, ActivityIndicator, View } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import "../../../global.css"; 
import { ListarDadosPerfil, PreencherDadosModal } from "~/features/profile/api/user";
import ModalFirstTime from "~/features/profile/components/ModalFirstTime";
import DashboardScreen from "../dashboard";
import EventsScreen from "../events";
import FeedScreen from "../feed";
import HiveScreen from "../hive";
import ProfileScreen from "../profile";
import Menu from "~/core/componentes/Menu";


export default function Main() {
  const [selectedIndex, setSelectedIndex] = useState(2);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [meuUserId, setMeuUserId] = useState("");
  const params = useLocalSearchParams();

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const data = await ListarDadosPerfil();
        if (data?.tipo_usuario) {
          await SecureStore.setItemAsync("tipo_usuario", data.tipo_usuario);
        }
        if (data?.id) {
          setMeuUserId(data.id);
        }
      } catch (err) {
        console.error("Erro ao carregar perfil:", err);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();

    const checkToken = async () => {
      const token = await SecureStore.getItemAsync("token");
      if (!token) {
        router.replace("/login");
      }
    };

    checkToken();
  }, []);

  useEffect(() => {
    if (params.novoCadastro === "true") {
      setModalVisible(true);
    }
  }, [params.novoCadastro]);

  const renderContent = () => {
    switch (selectedIndex) {
      case 0:
        return <EventsScreen />;
      case 1:
        return <FeedScreen />;
      case 2:
        return <HiveScreen />;
      case 3:
        return <DashboardScreen />;
      case 4:
        return <ProfileScreen meuUserId={meuUserId} />; 
      default:
        return <HiveScreen />; 
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
    <>
      <View
        className={`w-full h-full  pb-safe bg-neutral-800`}
      >
        {renderContent()}
        <Menu
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex} />
      </View>
      
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
          if (result) {
            setModalVisible(false);
          } else {
            throw new Error("Falha ao enviar dados");
          }
        }}
      />
    </>
  );
}