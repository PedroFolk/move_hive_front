import React, { useState } from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { BlurView } from "expo-blur";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

interface MenuProps {
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
}

interface Button {
  name?: string;
  type?: string;
  size?: number;
  button_name: string;
  isHive?: boolean;
}

const Menu: React.FC<MenuProps> = ({ selectedIndex, setSelectedIndex }) => {
  const buttons: Button[] = [
    { name: "trophy", type: "FontAwesome", size: 22, button_name: "Eventos" },
    { name: "users", type: "FontAwesome5", size: 22, button_name: "Social" },
    { isHive: true, button_name: "Hive" }, // botão flutuante central
    { name: "ranking-star", type: "FontAwesome6", size: 22, button_name: "Ranking" },
    { name: "person", type: "Ionicons", size: 22, button_name: "Perfil" },
  ];

  const getIconComponent = (type: Button["type"]) => {
    switch (type) {
      case "FontAwesome5": return FontAwesome5;
      case "Ionicons": return Ionicons;
      case "FontAwesome": return FontAwesome;
      case "FontAwesome6": return FontAwesome6;

      default: return AntDesign;

    }
  };

  return (
    <View
      className="absolute py-safe w-full bottom-0  items-center justify-center "
    >
      <View

        className="flex-1 mx-5 h-20 rounded-full bg-neutral-900 shadow-md flex-row justify-around items-center px-4 "

      >
        {buttons.map((btn, index) => {
          if (btn.isHive) {
            return (
              <View
                key={index}
                className="justify-center items-center flex-1"

              >
                <View
                  className="bottom-4 shadow-md shadow-neutral-700"

                >
                  <TouchableOpacity
                    className="w-20 h-20 rounded-full bg-yellow-500 items-center justify-center"
                    activeOpacity={0.8}
                    onPress={() => setSelectedIndex(2)}
                  >
                    <Text className="text-neutral-800 text-xl font-bold">HIVE</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }

          const ativo = index === selectedIndex;
          const IconComponent = getIconComponent(btn.type);

          return (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedIndex(index)}
              className="flex-1 items-center justify-center"
              activeOpacity={0.9}
            >
              <IconComponent
                name={btn.name as any}
                size={btn.size}
                color={ativo ? "#eab308" : "#a3a3a3"}
              />
              <Text
                style={{
                  color: ativo ? "#eab308" : "#a3a3a3",
                  marginTop: 4,
                  fontSize: 10,
                }}
              >
                {btn.button_name}
              </Text>
            </TouchableOpacity>
          );
        })}

      </View>
    </View>
  );
};

export default Menu;
