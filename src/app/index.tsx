import { useEffect } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const verificarToken = async () => {
      const token = await AsyncStorage.getItem("token");

      if (token) {
        router.replace("/main");
      } else {
        router.replace("/login");
      }
    };

    verificarToken();
  }, []);

  return null;
}
