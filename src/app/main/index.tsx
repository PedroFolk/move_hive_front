import { useState } from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Menu from "../components/menu";
import { colors } from "../styles/styles";
import Events from "../events";
import Perfil from "../perfil";

export default function Main() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const renderContent = () => {
    switch (selectedIndex) {
      case 0:
        return <Text className="text-white">Página Home</Text>;
      case 1:
        return <Text className="text-white">Página Peso</Text>;
      case 2:
        return <Text className="text-white">Página Google</Text>;
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
      className={`flex-1 items-center justify-center  ${colors.background} pt-5`}
    >
      {renderContent()}
      <Menu selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} />
    </SafeAreaView>
  );
}
