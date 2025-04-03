import { View, Text, useColorScheme, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from 'tailwind.config';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function Main() {
  const theme = useColorScheme() || 'light'; // Garante um valor padrão
  return (
    <SafeAreaView className="flex-1 items-center bg-neutral-800 pt-5">
      <Text className="font-bold text-white ">Page </Text>
      <View className="absolute bottom-10 flex-1 flex-row gap-10 rounded-2xl bg-white">
        <TouchableOpacity>
          <AntDesign
            name="google"
            size={48}
            color={theme === 'dark' ? 'white' : 'black'}
            className="p-2"
          />
        </TouchableOpacity>
        <TouchableOpacity className="rounded-2xl bg-green-500">
          <AntDesign
            className="p-2"
            name="google"
            size={48}
            color={theme === 'dark' ? 'white' : 'black'}
          />
        </TouchableOpacity>
        <TouchableOpacity className="rounded-2xl  ">
          <AntDesign
            className="p-2"
            name="google"
            size={48}
            color={theme === 'dark' ? 'white' : 'black'}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
