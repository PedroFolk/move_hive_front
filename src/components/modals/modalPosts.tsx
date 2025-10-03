import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
  Modal,
  View,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Text,
} from "react-native";

interface PostModalProps {
  visible: boolean;
  onClose: () => void;
  post: { id: string; imagem: string; legenda?: string } | null;
  onDelete?: (postId: string) => void;
  nome: string;
  foto_perfil: string;
  comentario: string;
}

const PostModal: React.FC<PostModalProps> = ({
  visible,
  onClose,
  post,
  onDelete,
  nome,
  foto_perfil,
  comentario
}) => {
  if (!post) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-neutral-900 py-safe">
        <View className="flex-row space-between ml-4 mb-4 items-center">
          <TouchableOpacity onPress={onClose}>
            <MaterialCommunityIcons name="arrow-left" size={28} color="white" />
          </TouchableOpacity>
          <Text className="text-white  text-2xl font-bold ml-2">
            Publicação
          </Text>
        </View>
    
        <View className="flex-row items-center justify-between px-4 py-2">
          <View className="flex-row items-center">

            {foto_perfil ? (
              <Image
                source={{ uri: foto_perfil }}
                resizeMode="cover"
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <View className="rounded-full w-10 h-10 border-2 border-yellow-500  items-center justify-center">
                <Text className="rounded-full text-white item">
                  {nome?.[0]?.toUpperCase() || "U"}
                </Text>
              </View>
            )}
            <Text className="ml-2 font-bold text-white">{nome}</Text>
          </View>
          {onDelete ? (
            <TouchableOpacity onPress={() => onDelete(post.id)}>
              <Text className="font-bold text-2xl text-white">⋯</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={onClose}>
              <Text className="font-bold text-2xl text-white">✕</Text>
            </TouchableOpacity>
          )}
        </View>
        <Image
          source={{ uri: post.imagem }}
          style={{ width: "100%", height: 400 }}
          resizeMode="cover"
        />
        {comentario && (
          <View className="px-4 pb-2 flex-row mt-2">
            <Text className="font-bold text-white">{nome}:</Text>
            <Text className="text-white ml-2">{comentario}</Text>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
};

export default PostModal;
