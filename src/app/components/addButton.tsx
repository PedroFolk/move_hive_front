import React from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface AddButtonProps {
  onPress: () => void;
}

const AddButton: React.FC<AddButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
        className="absolute bottom-[88px] right-4 p-4 rounded-full justify-center items-center shadow-md bg-neutral-900 z-50 "
    >
      <Ionicons name="add" size={28} color="#fff" />
    </TouchableOpacity>
  );
};

export default AddButton;
