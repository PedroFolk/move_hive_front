import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

interface ModalNewCompetitionProps {
  visible: boolean;

  onCancel: () => void;
  onSave: (competition: { id: string; name: string }) => void;
}

export default function ModalNewCompetition({
  visible,

  onCancel,
  onSave,
}: ModalNewCompetitionProps) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (visible) {
      setName("");
    }
  }, [visible]);

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onSave({ id: Date.now().toString(), name: trimmed });
    onCancel();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      <View >
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <Text>
            Nova Competição
          </Text>
          <TextInput
            placeholder="Nome da competição"
            placeholderTextColor={"#888"}
            value={name}
            onChangeText={setName}
          />

          <View >
            <TouchableOpacity onPress={onCancel}>
              <Text>
                Cancelar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave}>
              <Text >Salvar</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
