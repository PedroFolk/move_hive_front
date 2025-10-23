import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, Image } from "react-native";

const slides = [
    {
        key: "1",
        title: "Bem-Vindo(a)!",
        description:
            "O MOVE HIVE conecta você a pessoas para praticar esportes em grupo e compartilhar suas aventuras.",
        image: require("../../images/ciclismo.png"),
    },
    {
        key: "2",
        title: "Encontre Eventos",
        description:
            "Descubra eventos esportivos próximos e participe de competições saudáveis.",
        image: require("../../images/medalha.png"),
    },
    {
        key: "3",
        title: "Conecte-se com Amigos",
        description:
            "Siga amigos, acompanhe suas atividades e compartilhe suas conquistas com a comunidade.",
        image: require("../../images/ciclistas_1.png"),
    },
];

interface ModalWelcomeProps {
    visible: boolean;
    onClose: () => void;
}

export default function ModalWelcome({ visible, onClose }: ModalWelcomeProps) {
    const [step, setStep] = useState(0);

    const handleNext = () => {
        if (step < slides.length - 1) {
            setStep(step + 1);
        } else {
            onClose();
            setStep(0);
        }
    };

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View className="flex-1 bg-black/80 justify-center items-center ">
                <View className="bg-neutral-800 flex-1 py-10 px-4 rounded-2xl justify-center items-center">
                    <View className="items-center ">
                        <Image
                            source={slides[step].image}
                            className="w-64 h-64 mb-5"
                            resizeMode="contain"
                        />
                        <Text className="text-2xl font-bold text-neutral-100 text-center mb-2">
                            {slides[step].title}
                        </Text>
                        <Text className="text-base text-center text-neutral-300">
                            {slides[step].description}
                        </Text>
                    </View>

                    <View className="flex-row mt-5">
                        {slides.map((_, index) => (
                            <View
                                key={index}
                                className={`w-2 h-2 mt-4 rounded-full bg-yellow-500 mx-1 ${index === step ? "opacity-100" : "opacity-30"
                                    }`}
                            />
                        ))}
                    </View>

                    <TouchableOpacity
                        className="bg-yellow-500 py-3 px-10 rounded-full mt-8"
                        activeOpacity={1}
                        onPress={handleNext}
                    >
                        <Text className="text-neutral-900 text-lg font-bold text-center">
                            {step === slides.length - 1 ? "Começar" : "Próximo"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}
