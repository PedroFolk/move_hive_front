import { useState, useEffect, useCallback } from "react";
import { Platform, SafeAreaView, Text, ActivityIndicator } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import Menu from "../components/menu";
import Events from "../events";
import Perfil from "../profile";
import Activity from "../activities";
import Ranking from "../ranking";
import ModalFirstTime from "../components/modalFirstTime";
import EventCreationModal from "../components/modalEvents";

import { PreencherDadosModal } from "~/api/user";
import { colors } from "../../styles/styles";
import "../../../global.css";
import * as SecureStore from "expo-secure-store";

type EventsFetcher = (() => Promise<void>) | null;

export default function Main() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [eventCreationModalVisible, setEventCreationModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [eventsFetcher, setEventsFetcher] = useState<EventsFetcher>(null);
  const params = useLocalSearchParams();

  const handleSetEventsFetcher = useCallback((fetcher: () => Promise<void>) => {
    setEventsFetcher(() => fetcher);
  }, []);

  const handleEventSave = async (eventData: any) => {
    setEventCreationModalVisible(false);
    if (selectedIndex === 0 && eventsFetcher) {
      await eventsFetcher();
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");
        const id = await SecureStore.getItemAsync("userId");
        if (!token || !id) {
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
  }, []);

  const renderContent = () => {
    switch (selectedIndex) {
      case 0:
        return (
          <Events
            onShowEventModal={() => setEventCreationModalVisible(true)}
            onFetchDataAvailable={handleSetEventsFetcher}
          />
        );
      case 1:
        return <Activity />;
      case 2:
        return <Ranking />;
      case 3:
        return <Perfil meuUserId={""} />;
      default:
        return <Perfil meuUserId={""} />;
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator size="large" color="#FFD700" />
        <Text className="text-white mt-4">Verificando autenticação...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className={`w-full h-full items-center justify-center pt-safe pb-safe ${colors.background} `}
    >
      {renderContent()}

      <Menu
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
        onShowEventModal={() => setEventCreationModalVisible(true)}
      />

      <ModalFirstTime
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={async (data) => {
          const result = await PreencherDadosModal(
            data.biografia,
            data.cidade,
            data.estado,
            data.esportes_praticados,
            data.arquivo_foto,
          );
          if (!result) {
            alert("Erro ao atualizar perfil.");
          }
        }}
      />

      <EventCreationModal
        visible={eventCreationModalVisible}
        onClose={() => setEventCreationModalVisible(false)}
        onSave={handleEventSave}
        defaultSport=""
      />
    </SafeAreaView>
  );
}
