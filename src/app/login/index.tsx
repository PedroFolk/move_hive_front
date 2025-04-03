import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from 'expo-router';
import '../../../global.css';
import { colors } from '../styles/styles.js';
import TextField from '../components/fields'; // Ajuste o caminho conforme necessário

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

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const theme = useColorScheme() || 'light';

  const handleLogin = () => {
    console.log('Login:', { email, password });
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
              label="E-mail"
              value={email}
              onChangeText={setEmail}
              placeholder="E-mail"
              keyboardType="email-address"
              marginTop={'10'}
            />
            <TextField
              label="Senha"
              isPassword
              value={password}
              onChangeText={setPassword}
              placeholder="Digite sua senha"
              keyboardType="default"
              marginTop={'10'}
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

            <View className="mt-10 flex flex-row items-center gap-5">
              <View className={`h-1 flex-1 rounded-full ${colors.separator} `} />
              <Text className="text-2xl text-white ">ou</Text>
              <View className={`h-1 flex-1 rounded-full ${colors.separator}`} />
            </View>

            <TouchableOpacity
              className={`mt-10 flex flex-row items-center gap-5 rounded-2xl bg-neutral-600 p-2 `}>
              <AntDesign name="google" size={48} color="white" />
              <Text className=" text-2xl font-bold text-white">Entrar com Google</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
