import React from "react";
import {
  View,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import { colors } from "../../styles/styles";

interface MenuProps {
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
}

interface Button {
  name: string;
  type: string;
  size: number;
}
const Menu: React.FC<MenuProps> = ({ selectedIndex, setSelectedIndex }) => {
  const buttons: Button[] = [
    { name: "home", type: "Entypo", size: 24 },
    { name: "dumbbell", type: "FontAwesome5", size: 24 },
    { name: "ranking-star", type: "FontAwesome6", size: 24 },
    { name: "trophy", type: "FontAwesome", size: 24 },
    { name: "person", type: "Ionicons", size: 24 },
  ];

  const getIconComponent = (type: Button["type"]) => {
    switch (type) {
      case "Entypo":
        return Entypo;
      case "FontAwesome5":
        return FontAwesome5;
      case "FontAwesome":
        return FontAwesome;

      case "FontAwesome6":
        return FontAwesome6;
      case "Ionicons":
        return Ionicons;
      case "MaterialCommunityIcons":
        return MaterialCommunityIcons;
      default:
        return AntDesign;
    }
  };

  return (
    <SafeAreaView className="absolute bottom-0 flex-row justify-around  bg-yellow-500 w-full pb-safe  ">
      {buttons.map((btn, index) => {
        const ativo = index === selectedIndex;
        const IconComponent = getIconComponent(btn.type);

        return (
          <TouchableOpacity
            key={index}
            onPress={() => setSelectedIndex(index)}
            className={`rounded-xl py-3 px-3 mt-2 ${ativo ? `${colors.background}` : "bg-transparent"}`}
          >
            <IconComponent
              name={btn.name as any}
              size={btn.size}
              color={ativo ? "white" : "black"}
            />
          </TouchableOpacity>
        );
      })}
    </SafeAreaView>
  );
};

export default Menu;
