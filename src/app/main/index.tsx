import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import Menu from "../components/menu";
import Events from "../events";
import Perfil from "../profile";
import Activity from "../activities";
import Feed from "../feed";
import { colors } from "../../styles/styles";
import ModalFirstTime from "../components/modalFirstTime";
import { PreencherDadosModal } from "~/api/user";
import "../../../global.css";
import * as SecureStore from "expo-secure-store";


export default function Main() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const params = useLocalSearchParams();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");

        if (!token) {

          await SecureStore.deleteItemAsync("token");
          await SecureStore.deleteItemAsync("userId");
          router.replace("/login");
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error("Erro ao verificar auth:", err);
        router.replace("/login");
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
        return <Feed />;
      case 1:
        return <Activity />;
      case 2:
        return <Events />;
      case 3:
        return <Events />;
      case 4:
        return <Perfil />;
      default:
        return <Perfil />;
    }
  };

  if (loading) {
    return <SafeAreaView><></></SafeAreaView>;
  }

  return (
    <SafeAreaView
      className={`w-full h-full items-center justify-center ${colors.background} `}
    >
      {renderContent()}
      <Menu selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} />

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
    </SafeAreaView>
  );
}
