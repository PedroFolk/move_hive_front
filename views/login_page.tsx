/* eslint-disable prettier/prettier */
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
} from 'react-native';

interface TextFieldProps {
  isPassword?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label: string;
}

const TextField = ({ isPassword, value, onChangeText, placeholder, label }: TextFieldProps) => {
  return (
    <View>
      <Text className="mb-1 mt-10 text-xl text-white">{label}</Text>
      <TextInput
        secureTextEntry={isPassword === 'true'}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        className="h-12  rounded-2xl border-2 border-neutral-100 bg-white px-2 text-xl text-black"
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

  return (
    <SafeAreaView className="flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20} // Ajuste fino para Android
        style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          keyboardShouldPersistTaps="handled" // Melhora interação com o teclado
        >
          <View className="w-96 rounded-2xl bg-blue-400 p-6  dark:bg-white">
            <Text className="mt-10 text-center text-5xl font-bold text-white">Login</Text>
            <TextField
              label="Usuario"
              value={username}
              onChangeText={setUsername}
              placeholder="Digite seu usuário"
            />
            <View>
              <TextField
                label="Senha"
                isPassword="true"
                value={password}
                onChangeText={setPassword}
                placeholder="Digite sua senha"
              />
              <Pressable onPress={handlePress}>
                <Text className="m-1 mt-2  text-white">Esqueceu sua senha?</Text>
              </Pressable>
            </View>
            <TouchableOpacity onPress={handleLogin} className="mt-10 rounded-2xl bg-white p-3">
              <Text className="text-center text-xl text-blue-400">Entrar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
