import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from 'expo-router';
import '../../../global.css';
import { colors } from '../styles/styles.js';

import { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Linking,
  Keyboard,
  TouchableWithoutFeedback,
  useColorScheme,
  KeyboardType,
} from 'react-native';

interface TextFieldProps {
  isPassword?: boolean;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label: string;
  keyboardType: KeyboardType;
}

const TextField = ({
  isPassword = false,
  value,
  onChangeText,
  placeholder,
  label,
  keyboardType,
}: TextFieldProps) => {
  return (
    <View className="w-full">
      <Text className={`mb-1 mt-10 text-xl ${colors.textPrimaryButton}`}>{label}</Text>
      <TextInput
        autoComplete={isPassword ? 'password' : 'email'}
        textContentType={isPassword ? 'none' : 'emailAddress'}
        secureTextEntry={isPassword}
        autoCapitalize="characters"
        value={value}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="gray"
        className={`h-14 w-full rounded-2xl bg-neutral-600  px-2 pb-1  text-xl  text-white  `}
      />
    </View>
  );
};

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const theme = useColorScheme() || 'light';

  const handleLogin = () => {
    console.log('Login:', { username, password });
    router.push('../main');
  };

  return (
    <SafeAreaView className={`flex-1 ${colors.background}  `}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1 justify-center px-6">
          <View className={`w-full max-w-md rounded-2xl ${colors.background} self-center p-6`}>
            <Text className={`text-center text-5xl font-bold text-white `}>MOVE</Text>
            <Text className={`text-center text-5xl font-bold ${colors.primary}`}>HIVE</Text>

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

            <TouchableOpacity onPress={() => Linking.openURL('https://www.google.com')}>
              <Text className="mt-2 text-white">Esqueceu sua senha?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleLogin}
              className={`mt-10 rounded-2xl ${colors.button} p-3`}>
              <Text className={`text-center text-xl font-bold ${colors.textSecondaryButton}`}>
                Entrar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('../register')}
              className={`mt-5 rounded-2xl border-2 ${colors.border} p-3`}>
              <Text className="text-center text-xl font-bold text-white">Cadastrar-se</Text>
            </TouchableOpacity>

            <View className="mt-10 flex flex-row items-center gap-10">
              <View className={`h-1 flex-1 rounded-full ${colors.separator} `} />
              <TouchableOpacity className={`rounded-2xl bg-neutral-600 p-2 `}>
                <AntDesign name="google" size={48} color="white" />
              </TouchableOpacity>
              <View className={`h-1 flex-1 rounded-full ${colors.separator}`} />
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
