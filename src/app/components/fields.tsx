import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  TextInputProps,
  TouchableOpacity,
} from "react-native";
import { colors } from "../../styles/styles";
import { Ionicons } from "@expo/vector-icons";

interface TextFieldProps {
  marginTop: string;
  isPassword?: boolean;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label: string;
  keyboardType?: TextInputProps["keyboardType"];
  disabled?: boolean;
}

const TextField: React.FC<TextFieldProps> = ({
  marginTop,
  isPassword = false,
  value,
  onChangeText,
  placeholder,
  label,
  keyboardType = "default",
  disabled = false,
}) => {
  const [mostrarSenha, setMostrarSenha] = useState(false);

  return (
    <View className="w-full">
      <Text
        className={`mt-${marginTop} mb-1 text-xl ${colors.textPrimaryButton}`}
      >
        {label}
      </Text>

      <View className="relative">
        <TextInput
          autoComplete={isPassword ? "password" : "off"}
          textContentType={isPassword ? "password" : "none"}
          secureTextEntry={isPassword && !mostrarSenha}
          autoCapitalize="none"
          value={value}
          keyboardType={keyboardType}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="gray"
          editable={!disabled}
          className={`h-14 w-full rounded-2xl px-4 pr-12 pb-1 text-xl ${colors.textPrimaryButton} 
            ${disabled ? "bg-neutral-900 text-gray-500" : "bg-neutral-600"}`}
        />

        {isPassword && (
          <TouchableOpacity
            onPress={() => setMostrarSenha((prev) => !prev)}
            className="absolute right-4 top-4"
          >
            <Ionicons
              name={mostrarSenha ? "eye-off" : "eye"}
              size={22}
              color="white"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default TextField;
