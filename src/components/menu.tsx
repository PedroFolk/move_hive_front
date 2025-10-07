import React, { useState } from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { BlurView } from "expo-blur";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";

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
    { name: "dumbbell", type: "FontAwesome5", size: 22, button_name: "Treinos" },
    { isHive: true, button_name: "Hive" }, // botão flutuante central
    { name: "users", type: "FontAwesome", size: 22, button_name: "Social" },
    { name: "person", type: "Ionicons", size: 22, button_name: "Perfil" },
  ];

  const getIconComponent = (type: Button["type"]) => {
    switch (type) {
      case "FontAwesome5": return FontAwesome5;
      case "Ionicons": return Ionicons;
      case "FontAwesome": return FontAwesome;
      default: return AntDesign;
    }
  };

  return (
    <View
      className="absolute py-safe w-full bottom-0  items-center justify-center "
    >
      <BlurView
        intensity={30}
        tint="light"
        className="flex-1 mx-5 h-[80px] rounded-full  flex-row justify-around items-center px-4 overflow-hidden"
        style={{
          borderRadius: 35,
        }}
      >
        {buttons.map((btn, index) => {
          if (btn.isHive) {
            return (
              <TouchableOpacity
                className=" w-20 h-20 rounded-full bg-yellow-500  items-center justify-center "
                key={index}
                onPress={() => alert("Hive clicado!")}

           
              >
                <Text 
                className="text-neutral-800 text-2xl font-bold">
                  {btn.button_name}
                </Text>
              </TouchableOpacity>
            );
          }

          const ativo = index === selectedIndex;
          const IconComponent = getIconComponent(btn.type);

          return (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedIndex(index)}
              style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
              activeOpacity={0.9}
            >
              <IconComponent
                name={btn.name as any}
                size={btn.size}
                color={ativo ? "#facc15" : "#a3a3a3"}
              />
              <Text
                style={{
                  color: ativo ? "#facc15" : "#a3a3a3",
                  marginTop: 4,
                  fontSize: 10,
                }}
              >
                {btn.button_name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </BlurView>
    </View>
  );
};

export default Menu;
