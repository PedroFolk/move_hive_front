import { View, TouchableOpacity } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { colors } from "../styles/styles";

interface MenuProps {
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
}

const Menu: React.FC<MenuProps> = ({ selectedIndex, setSelectedIndex }) => {
  const buttons = [
    { name: "home", type: "AntDesign" },
    { name: "weight-lifter", type: "MaterialCommunityIcons" },
    { name: "podium-gold", type: "MaterialCommunityIcons" },
    { name: "Trophy", type: "AntDesign" },
    { name: "user", type: "AntDesign" },
  ];

  return (
    <View className="absolute bottom-10 flex-row gap-4 rounded-2xl p-2 bg-white">
      {buttons.map((btn, index) => {
        const ativo = index === selectedIndex;
        const IconComponent =
          btn.type === "MaterialCommunityIcons"
            ? MaterialCommunityIcons
            : AntDesign;

        return (
          <TouchableOpacity
            key={index}
            onPress={() => setSelectedIndex(index)}
            className={`rounded-2xl p-2 ${ativo ? colors.background : "bg-transparent"}`}
          >
            <IconComponent
              name={btn.name as any}
              size={36}
              color={ativo ? "white" : "black"}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default Menu;
