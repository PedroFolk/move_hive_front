/* eslint-disable prettier/prettier */

// Imports
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
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
  Pressable,
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
      <Text className="mb-1 mt-10 text-xl text-white dark:text-neutral-800">{label}</Text>
      <TextInput
        secureTextEntry={isPassword}
        value={value}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        placeholder={placeholder}
        className="h-14 rounded-2xl border-2 border-neutral-100 bg-white px-2 pb-1 text-xl text-neutral-600 placeholder:dark:text-neutral-300"
      />
    </View>
  );
};

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

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
          <View className="w-96 rounded-2xl bg-neutral-800 p-6 dark:bg-white">
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

            <Pressable onPress={handlePress}>
              <Text className="m-1 mt-2 text-white dark:text-neutral-800">Esqueceu sua senha?</Text>
            </Pressable>

            <TouchableOpacity
              onPress={handleLogin}
              className="mt-10 rounded-2xl bg-white p-3 dark:bg-neutral-800"
              accessibilityLabel="Botão de login"
              accessibilityRole="button">
              <Text className="text-center text-xl font-bold text-neutral-800 dark:text-white">
                Entrar
              </Text>
            </TouchableOpacity>

            <View className="mt-5 flex flex-row justify-center gap-10">
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
