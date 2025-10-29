import { useRef, useState } from "react";
import { View, Text, Image, TouchableOpacity, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface PostItemProps {
    item: any;
    token: string | null;
    curtirPost: (postId: string) => void;
    irParaPerfil: (usuario_id: string) => void;
    setPostSelecionado: (item: any) => void;
    setModalComentariosVisible: (visible: boolean) => void;
}

export default function PostItem({
    item,
    token,
    curtirPost,
    irParaPerfil,
    setPostSelecionado,
    setModalComentariosVisible,
}: PostItemProps) {
    const usuarioCurtiu = item.postagem?.curtidas?.some(
        (c: any) => c.usuario_id === token
    );

    const [showHeart, setShowHeart] = useState(false);
    const scaleAnim = useRef(new Animated.Value(0)).current;

    const handleDoubleTap = () => {
        const now = Date.now();
        if (item.lastTap && now - item.lastTap < 300) {
            curtirPost(item.postagem.id);

            setShowHeart(true);
            scaleAnim.setValue(0);
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 3,
                useNativeDriver: true,
            }).start(() => setTimeout(() => setShowHeart(false), 800));
        } else {
            item.lastTap = now;
        }
    };

    return (
        <View className="mb-4 w-full bg-neutral-800 rounded-xl overflow-hidden">
            <TouchableOpacity
                activeOpacity={1}
                className="flex-row items-center px-3 py-2"
                onPress={() => item.usuario?.id && irParaPerfil(item.usuario.id)}
            >
                {item.usuario?.foto_perfil ? (
                    <Image
                        source={{ uri: item.usuario.foto_perfil }}
                        className="w-10 h-10 mr-3 rounded-full"
                    />
                ) : (
                    <View className="w-10 h-10 mr-3 bg-neutral-600 justify-center items-center rounded-full">
                        <Text className="text-white font-bold text-base">
                            {item.usuario?.username?.[0]?.toUpperCase() || "U"}
                        </Text>
                    </View>
                )}
                <Text className="font-bold text-sm text-white">
                    @{item.usuario?.username || "usuario"}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={1} onPress={handleDoubleTap}>
                <View style={{ position: "relative" }}>
                    {item.postagem?.imagem && (
                        <Image
                            source={{ uri: item.postagem.imagem }}
                            style={{ width: "100%", aspectRatio: 1 }}
                            resizeMode="cover"
                        />
                    )}
                    {showHeart && (
                        <Animated.View
                            style={{
                                position: "absolute",
                                top: "40%",
                                left: "40%",
                                transform: [{ scale: scaleAnim }],
                            }}
                        >
                            <Ionicons name="heart" size={100} color="white" />
                        </Animated.View>
                    )}
                </View>
            </TouchableOpacity>


            <View className="flex-row items-center px-3 py-2 justify-between">
                <View className="flex-row">
                    <TouchableOpacity
                        className="flex-row items-center mr-4"
                        onPress={() => curtirPost(item.postagem.id)}
                    >
                        <Ionicons
                            name={usuarioCurtiu ? "heart" : "heart-outline"}
                            size={24}
                            color={usuarioCurtiu ? "red" : "white"}
                        />
                        <Text className="text-white ml-1 text-sm">
                            {item.postagem.contador_curtidas || 0}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="flex-row items-center mr-4"
                        onPress={() => {
                            setPostSelecionado(item);
                            setModalComentariosVisible(true);
                        }}
                    >
                        <Ionicons name="chatbubble-outline" size={24} color="white" />
                        <Text className="text-white ml-1 text-sm">
                            {item.postagem?.contador_comentarios || 0}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="flex-row items-center">
                        <Ionicons name="share-social-outline" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

            <View className="px-3 pb-3 flex-row flex">
                <Text className="font-bold text-sm text-white">
                    {item.usuario?.username}:
                </Text>
                <Text className="text-sm text-white ml-1">
                    {item.postagem?.descricao}
                </Text>
            </View>
        </View>
    );
}
