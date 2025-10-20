import { useEffect } from "react";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { GestureHandlerRootView } from "react-native-gesture-handler"; // <- import necessário
import { View } from "react-native"; // apenas para o container

function decodeToken(token: string) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return String(payload.user_id);
  } catch (e) {
    console.error("Erro ao decodificar o token:", e);
    return null;
  }
}

export default function App() {
  const router = useRouter();

  useEffect(() => {
    const verificarToken = async () => {
      const token = await SecureStore.getItemAsync("token");

      if (token) {
        const decodedUserId = decodeToken(token);
        
        if (decodedUserId) {
          await SecureStore.setItemAsync("userId", decodedUserId);
          router.push("/main");
        } else {
          router.replace("/login");
        }
      } else {
        router.replace("/login");
      }
    };

    verificarToken();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }} />
    </GestureHandlerRootView>
  );
}
