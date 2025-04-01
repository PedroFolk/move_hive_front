/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */

import './global.css';
import { useColorScheme } from "nativewind";
import { View } from 'react-native';
import LoginPage from 'views/login_page';


export default function App() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  
  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-neutral-800">
      <LoginPage />
      
    </View>
  );
}