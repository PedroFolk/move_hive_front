import React from "react";
import { Text, View, TextInput, TextInputProps } from "react-native";
import { colors } from "../styles/styles";

interface TextFieldProps {
  marginTop: string;
  isPassword?: boolean;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label: string;
  keyboardType?: TextInputProps["keyboardType"];
}

const TextField: React.FC<TextFieldProps> = ({
  marginTop,
  isPassword = false,
  value,
  onChangeText,
  placeholder,
  label,
  keyboardType = "default",
}) => {
  return (
    <View className="w-full">
      <Text
        className={`mt-${marginTop} mb-1 text-xl ${colors.textPrimaryButton}`}
      >
        {label}
      </Text>
      <TextInput
        autoComplete={isPassword ? "password" : "email"}
        textContentType={isPassword ? "password" : "emailAddress"}
        secureTextEntry={isPassword}
        autoCapitalize="none"
        value={value}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="gray"
        className={`h-14 w-full rounded-2xl bg-white  dark:bg-neutral-600 px-2 pb-1 text-xl ${colors.textPrimaryButton}`}
      />
    </View>
  );
};

export default TextField;
