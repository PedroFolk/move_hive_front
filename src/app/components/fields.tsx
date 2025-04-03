import React from 'react';
import { Text, View, TextInput, TextInputProps } from 'react-native';

interface TextFieldProps {
  marginTop: string;
  isPassword?: boolean;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label: string;
  keyboardType?: TextInputProps['keyboardType'];
}

const TextField: React.FC<TextFieldProps> = ({
  marginTop,
  isPassword = false,
  value,
  onChangeText,
  placeholder,
  label,
  keyboardType = 'default',
}) => {
  return (
    <View className="w-full">
      <Text className={`mt-${marginTop} mb-1 text-xl text-white`}>{label}</Text>
      <TextInput
        autoComplete={isPassword ? 'password' : 'email'}
        textContentType={isPassword ? 'password' : 'emailAddress'}
        secureTextEntry={isPassword}
        autoCapitalize="none"
        value={value}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="gray"
        className="h-14 w-full rounded-2xl bg-neutral-600 px-2 pb-1 text-xl text-white"
      />
    </View>
  );
};

export default TextField;
