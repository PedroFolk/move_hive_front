import React from 'react';
import { Modal, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Perfil from '~/app/(tabs)/profile';

type ProfileModalProps = {
  visible: boolean;
  onClose: () => void;
  userId: string | null;
  meuUserId: string; // O ID do usuário logado (precisa ser fornecido pelo pai)
};

export default function ProfileModal({
  visible,
  onClose,
  userId,
  meuUserId,
}: ProfileModalProps) {
  if (!userId) return null; // Não renderiza se não houver userId

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className='flex-1 py-safe bg-neutral-800'>
        <View style={{ flex: 1 }}>
          {/* Botão de Fechar no topo do modal */}
          <TouchableOpacity
            onPress={onClose}
           className='px-4 absolute z-10 top-10 left-0 flex start-0'

          >
            <MaterialCommunityIcons name="close" size={30} color="white" />
          </TouchableOpacity>

          {/* O componente Perfil é renderizado aqui */}
          <Perfil 
            userId={userId} 
            meuUserId={meuUserId} 
          />
        </View>
      </View>
    </Modal>
  );
}