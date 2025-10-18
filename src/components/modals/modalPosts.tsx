import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
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
  post: { id: string; imagem: string; legenda?: string; curtidas?: any[]; contador_curtidas?: number } | null;
  onDelete?: (postId: string) => void;
  nome: string;
  foto_perfil: string;
  comentario?: string;
  token: string | null;
  onCurtir?: (postId: string) => void;
}

const PostModal: React.FC<PostModalProps> = ({
  visible,
  onClose,
  post,
  onDelete,
  nome,
  foto_perfil,
  comentario,
  token,
  onCurtir,
}) => {
  if (!post) return null;

  const usuarioCurtiu = post.curtidas?.some((c: any) => c.usuario_id === token);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-neutral-900 py-safe">
        <View className="flex-row justify-between ml-4 mb-4 items-center">
          <TouchableOpacity onPress={onClose}>
            <MaterialCommunityIcons name="arrow-left" size={28} color="white" />
          </TouchableOpacity>
          
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
              <View className="rounded-full w-10 h-10 border-2 border-yellow-500 items-center justify-center">
                <Text className="text-white">{nome?.[0]?.toUpperCase() || "U"}</Text>
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

        {/* Social Section */}
        <View className="flex-row items-center px-4 py-2 justify-between">
          <View className="flex-row">
            <TouchableOpacity
              className="flex-row items-center mr-4"
              onPress={() => onCurtir && onCurtir(post.id)}
            >
              <Ionicons
                name={usuarioCurtiu ? "heart" : "heart-outline"}
                size={24}
                color={usuarioCurtiu ? "red" : "white"}
              />
              <Text className="text-white ml-1 text-sm">
                {post.contador_curtidas || 0}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center mr-4">
              <Ionicons name="chatbubble-outline" size={24} color="white" />
              <Text className="text-white ml-1 text-sm">{comentario ? 1 : 0}</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center">
              <Ionicons name="share-social-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {comentario && (
          <View className="px-4 pb-2 flex-row mt-2">
            <Text className="font-bold text-white">{nome}:</Text>
            <Text className="text-white ml-2">{comentario}</Text>
          </View>
        )}
      </View>
    </Modal>
  );
};

export default PostModal;
