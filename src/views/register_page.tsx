/* eslint-disable prettier/prettier */

// Imports
import AntDesign from '@expo/vector-icons/AntDesign';
import { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
  Linking,
  KeyboardType,
  useColorScheme,
} from 'react-native';

// Props of TextField
interface TextFieldProps {
  isPassword?: boolean;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label: string;
  keyboardType: KeyboardType;
}

// Text Field
const TextField = ({
  isPassword = false,
  value,
  onChangeText,
  placeholder,
  label,
  keyboardType,
}: TextFieldProps) => {
  return (
    <View>
      <Text className="mb-1 mt-10 text-xl text-white dark:text-neutral-800 ">{label}</Text>
      <TextInput
        autoComplete={isPassword ? 'password' : 'email'} // 🔹 Autocomplete para e-mail e senha
        textContentType={isPassword ? 'none' : 'emailAddress'} // 🔹 Remove a barrinha no iOS
        secureTextEntry={isPassword}
        value={value}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        placeholder={placeholder}
        className="h-14 rounded-2xl  border-2 border-neutral-300 bg-white px-2 pb-1 text-xl text-neutral-600 focus:border-neutral-400 placeholder:dark:text-neutral-300"
      />
    </View>
  );
};

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleLogin = () => {
    console.log('Login:', { username, password });
  };
  const handlePress = () => {
    Linking.openURL('https://www.google.com');
  };

  const theme = useColorScheme() || 'light'; // Garante um valor padrão

  return (
    <SafeAreaView className="flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
          keyboardShouldPersistTaps="handled">
          <View className="w-96 rounded-2xl bg-neutral-800 p-6 dark:bg-white ">
            <Text className="mt-10 text-center text-5xl font-bold text-neutral-500">MOVE</Text>
            <Text className="mt-2 text-center text-5xl font-bold text-yellow-500">HIVE</Text>

            <TextField
              label="Usuário"
              value={username}
              onChangeText={setUsername}
              placeholder="Digite seu usuário"
              keyboardType="email-address"
            />
            <TextField
              label="Senha"
              isPassword
              value={password}
              onChangeText={setPassword}
              placeholder="Digite sua senha"
              keyboardType="default"
            />
            <TextField
              label="Confirme sua senha"
              isPassword
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirme sua senha"
              keyboardType="default"
            />

            <TouchableOpacity
              onPress={handleLogin}
              className="mt-10 rounded-2xl bg-neutral-800 p-3  "
              accessibilityLabel="Botão de login"
              accessibilityRole="button">
              <Text className="text-center text-xl font-bold text-white ">Cadastrar-se</Text>
            </TouchableOpacity>

            <View className="mt-10 flex flex-row justify-center gap-10">
              <TouchableOpacity
                className="rounded-2xl bg-white p-2 dark:bg-neutral-800"
                accessibilityLabel="Login com Google"
                accessibilityRole="button">
                <AntDesign name="google" size={48} color={theme === 'dark' ? 'white' : 'black'} />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
