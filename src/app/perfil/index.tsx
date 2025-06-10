import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../events/styles"; // ajuste o caminho conforme seu projeto
export default function Perfil() {
  return (
    <SafeAreaView className="flex-1">
      <ScrollView contentContainerStyle={{ alignItems: "center" }}>
        <Image
          source={require("./Perfil.png")}
          resizeMode="cover"
          className="rounded-full w-24 h-24"
        />

        <Text className="text-white text-lg font-bold mt-3">`@usuario`</Text>

        <View className="flex-row w-full px-4 mt-6 justify-around ">
          <TouchableOpacity className=" rounded-md flex-1 py-2 items-center bg-yellow-500">
            <Text className="text-neutral-800 font-semibold">Compartilhar</Text>
          </TouchableOpacity>
          <Text></Text>
          <TouchableOpacity className=" border-white flex-1 border-2 rounded-md py-2 items-center ">
            <Text className="text-white">Editar Perfil</Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row flex-wrap mt-6 justify-center">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <Image
                className="p-2 rounded-sm"
                key={i}
                source={require("./Perfil.png")}
                style={{ width: (360 - 4) / 3, height: (360 - 4) / 3 }}
              />
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
