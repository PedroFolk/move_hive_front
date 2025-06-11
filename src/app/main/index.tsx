import { useState } from "react";
import { Text, SafeAreaView } from "react-native";
import Menu from "../components/menu";
import Events from "../events";
import Perfil from "../perfil";
import { colors } from "../styles/styles";
import Feed from "../feed";

export default function Main() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const renderContent = () => {
    switch (selectedIndex) {
      case 0:
        return <Feed />;
      case 1:
        return <Text className="text-white">Página Peso</Text>;
      case 2:
        return <Text className="text-white">token</Text>;
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
      className={`flex-1 items-center justify-center ${colors.background} pt-5`}
    >
      {renderContent()}
      <Menu selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} />
    </SafeAreaView>
  );
}
