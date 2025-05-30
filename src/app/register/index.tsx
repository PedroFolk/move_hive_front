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
import TextField from '../components/fields';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const theme = useColorScheme() || 'light';

  const handleRegister = () => {
    console.log('Register:', { username, password, confirmPassword });
  };

  return (
    <SafeAreaView className={`flex-1  ${colors.background}`}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1 justify-center px-6">
          <View className={`w-full max-w-md rounded-2xl ${colors.background} self-center p-6`}>
            <Text className={`text-center text-5xl font-bold text-white`}>MOVE</Text>
            <Text className={`text-center text-5xl font-bold ${colors.primary}`}>HIVE</Text>

            <TextField
              marginTop="10"
              label="Usuário"
              value={username}
              onChangeText={setUsername}
              placeholder="Digite seu usuário"
              keyboardType="email-address"
            />
            <TextField
              marginTop="10"
              label="Senha"
              isPassword
              value={password}
              onChangeText={setPassword}
              placeholder="Digite sua senha"
              keyboardType="default"
            />
            <TextField
              marginTop="5"
              label="Confirme sua senha"
              isPassword
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirme sua senha"
              keyboardType="default"
            />

            <TouchableOpacity
              onPress={handleRegister}
              className={`mt-10 rounded-2xl ${colors.button} p-3`}>
              <Text className={`text-center text-xl font-bold ${colors.textSecondaryButton}`}>
                Cadastrar-se
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('../login')}
              className={`mt-5 rounded-2xl border-2 ${colors.border} p-3`}>
              <Text className="text-center text-xl font-bold text-white">Voltar</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
