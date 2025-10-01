import React, { useState } from "react";
import { SafeAreaView, TouchableOpacity, Text, View, StyleSheet, Dimensions } from "react-native";
import { BlurView } from "expo-blur";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Entypo from "@expo/vector-icons/Entypo";


interface MenuProps {
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  onShowEventModal: () => void;
}

interface Button {
  name: string;
  type: string;
  size: number;
  button_name: string;
}


const RightMenuButton: React.FC<{ onPress: () => void, isOpened: boolean }> = ({ onPress, isOpened }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        height: '100%',
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12,
      }}
    >
      <Entypo
        name={isOpened ? "chevron-down" : "plus"}
        size={32}
        color="#a3a3a3"
      />
    </TouchableOpacity>
  );
};


const Menu: React.FC<MenuProps> = ({ selectedIndex, setSelectedIndex, onShowEventModal }) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const dropdownOptions = [
    { name: "Novo Treino", icon: "plus" },
    { name: "Novo Evento", icon: "plus" },
  ];

  const handleDropdownPress = (optionName: string) => {
    if (optionName === "Novo Treino") {
      alert(`Opção selecionada: ${optionName}`);
      setDropdownVisible(false);
    } else if (optionName === "Novo Evento") {

      onShowEventModal();
      setDropdownVisible(false);
    }
  };

  const buttons: Button[] = [
    { name: "trophy", type: "FontAwesome", size: 22, button_name: "Eventos" },
    { name: "dumbbell", type: "FontAwesome5", size: 22, button_name: "Treinos" },
    { name: "ranking-star", type: "FontAwesome6", size: 22, button_name: "Pódio" },
    { name: "person", type: "Ionicons", size: 22, button_name: "Perfil" },
  ];

  const getIconComponent = (type: Button["type"]) => {
    switch (type) {
      case "FontAwesome5": return FontAwesome5;
      case "FontAwesome6": return FontAwesome6;
      case "Ionicons": return Ionicons;
      case "FontAwesome": return FontAwesome;
      default: return AntDesign;
    }
  };

  const MENU_HEIGHT = 86;
  const DROPDOWN_WIDTH = 150;
  const DROPDOWN_BOTTOM_OFFSET = MENU_HEIGHT + 10;

  return (
    <SafeAreaView className="absolute bottom-4 w-full">
      <View className="flex-row justify-between items-end px-4">


        <BlurView
          className="flex-row flex-1 justify-around py-4 rounded-full overflow-hidden"
          intensity={60}
          tint="light"
          style={{
            backgroundColor: "rgba(0,0, 0, 0.10)",
            marginRight: 8,
            maxWidth: '80%',
            height: 70,
            borderRadius: 999,
          }}
        >
          {buttons.map((btn, index) => {
            const ativo = index === selectedIndex;
            const IconComponent = getIconComponent(btn.type);

            return (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedIndex(index)}
                style={{ flex: 1, alignItems: "center", justifyContent: 'center' }}
              >
                <IconComponent
                  name={btn.name as any}
                  size={btn.size}
                  color={ativo ? "#FFD700" : "#a3a3a3"}
                />
                <Text style={{ color: ativo ? "#FFD700" : "#a3a3a3", marginTop: 4, fontSize: 10 }}>
                  {btn.button_name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </BlurView>


        <BlurView
          className="rounded-full overflow-hidden"
          intensity={60}
          tint="light"
          style={{
            backgroundColor: "rgba(0,0, 0, 0.10)",
            height: 70,
            aspectRatio: 1,
            borderRadius: 999,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <RightMenuButton
            onPress={() => setDropdownVisible(!isDropdownVisible)}
            isOpened={isDropdownVisible}
          />
        </BlurView>


      </View>

      {isDropdownVisible && (
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={() => setDropdownVisible(false)}
        >
          <BlurView
            intensity={60}
            tint="light"
            style={{
              position: 'absolute',
              bottom: DROPDOWN_BOTTOM_OFFSET,
              right: 16,
              width: DROPDOWN_WIDTH,
              borderRadius: 12,
              overflow: 'hidden',
              backgroundColor: "rgba(0,0, 0, 0.10)",
              paddingVertical: 8,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
              elevation: 5,
            }}
          >
            {dropdownOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleDropdownPress(option.name)}
                className="rounded-full  justify-center py-4 px-2"
                style={{
                  flexDirection: 'row',

                  borderBottomWidth: index < dropdownOptions.length - 1 ? 1 : 0,
                  borderBottomColor: 'rgba(255, 255, 255, 0.2)',
                }}
              >
                <Text
                  className="text-lg font-bold color-neutral-400"
                >
                  {option.name}
                </Text>

              </TouchableOpacity>
            ))}
          </BlurView>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default Menu;