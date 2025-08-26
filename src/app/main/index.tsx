import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import Menu from "../components/menu";
import Events from "../events";
import Perfil from "../profile";
import Activity from "../activities";
import Feed from "../feed";
import { colors } from "../../styles/styles";
import ModalFirstTime from "../components/modalFirstTime";
import { PreencherDadosModal } from "~/api/user";
import "../../../global.css";




export default function Main() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const params = useLocalSearchParams();

  useEffect(() => {
    if (params.novoCadastro === "true") {
      setModalVisible(true);
    }
  }, []);
  const renderContent = () => {
    switch (selectedIndex) {
      case 0:
        // return <Perfil />;
      return <Feed />
      // return <Events />;
// return <Login/>;
      case 1:
        return <Activity />;
      case 2:
      // return <RankingScreen />;
      case 3:
        return <Events />;
      case 4:
        return <Perfil />;
      default:
        return <Perfil />;
    }
  };

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
       
          if (result) {
          } else {
            alert("Erro ao atualizar perfil.");
          }
        }}
      />
    </SafeAreaView>
  );
}
