import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Modal,
    TextInput,
    TouchableOpacity,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ModalNewPostProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (descricao: string, imagem: any) => void;
    loading?: boolean;
    imagem: any | null;
    setImagem: React.Dispatch<React.SetStateAction<any | null>>;
    descricao: string;
    setDescricao: React.Dispatch<React.SetStateAction<string>>;
    abrirGaleria: () => void;
}

const ModalNewPost: React.FC<ModalNewPostProps> = ({
    visible,
    onClose,
    onSubmit,
    loading = false,
    imagem,
    setImagem,
    descricao,
    setDescricao,
    abrirGaleria,
}) => {
    return (
        <Modal animationType="fade" transparent={true} visible={visible}>
            <View className="flex-1 bg-black bg-opacity-50 justify-center items-center">
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    keyboardVerticalOffset={60}
                    className="w-full items-center"
                >
                    <ScrollView
                        contentContainerStyle={{
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View className="bg-neutral-800 w-11/12 rounded-2xl p-5 shadow-2xl">
                            <View className="flex-row w-full justify-between items-center mb-4">
                                <TouchableOpacity
                                    onPress={() => {
                                        onClose();
                                        setDescricao("");
                                        setImagem(null);
                                    }}
                                >
                                    <Ionicons
                                        name="close"
                                        size={27}
                                        color="white"
                                        className="bg-transparent p-2 rounded-lg"
                                    />
                                </TouchableOpacity>

                                <Text className="text-white text-lg font-bold text-center flex-1">
                                    Nova postagem
                                </Text>

                                <TouchableOpacity onPress={() => onSubmit(descricao, imagem)} disabled={loading}>
                                    <Ionicons
                                        name={loading ? "time-outline" : "checkmark"}
                                        size={27}
                                        className="bg-yellow-500 p-2 rounded-lg mb-4"
                                        color="white"
                                    />
                                </TouchableOpacity>
                            </View>

                            {imagem ? (
                                <TouchableOpacity
                                    onPress={abrirGaleria}
                                    style={{
                                        width: "100%",
                                        height: 300,
                                        borderRadius: 12,
                                        marginBottom: 16,
                                        overflow: "hidden",
                                    }}
                                >
                                    <Image
                                        source={{ uri: imagem.uri }}
                                        style={{ width: "100%", height: "100%" }}
                                        resizeMode="contain"
                                    />
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity
                                    className="bg-neutral-600 w-full h-48 rounded-xl justify-center items-center mb-4"
                                    onPress={abrirGaleria}
                                >
                                    <Ionicons name="image" size={48} color="#ccc" />
                                    <Text className="text-gray-300 mt-2">Selecionar imagem</Text>
                                </TouchableOpacity>
                            )}


                            <TextInput
                                placeholder="Escreva uma legenda..."
                                placeholderTextColor="#aaa"
                                value={descricao}
                                onChangeText={setDescricao}
                                multiline
                                className="text-white border border-neutral-600 rounded-2xl px-3 py-4 mt-4"
                                style={{ minHeight: 60, textAlignVertical: "top" }}
                            />
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
};

export default ModalNewPost;
