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
import styles, { darkStyles } from "../events/styles";

interface ModalNewCompetitionProps {
  visible: boolean;
  theme: "light" | "dark";
  onCancel: () => void;
  onSave: (competition: { id: string; name: string }) => void;
}

export default function ModalNewCompetition({
  visible,
  theme,
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
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={[
            {
              backgroundColor: theme === "dark" ? "#1F1F1F" : "#FFF",
              padding: 16,
              borderRadius: 8,
              width: "90%",
              alignSelf: "center",
            },
            theme === "dark" && darkStyles.pickerContainer,
          ]}
        >
          <Text
            style={[
              styles.fieldLabel,
              {
                marginBottom: 10,
                color: theme === "dark" ? "#EBEBEB" : "#1F1F1F",
                fontSize: 18,
                fontWeight: "600",
              },
            ]}
          >
            Nova Competição
          </Text>

          <TextInput
            placeholder="Nome da competição"
            placeholderTextColor={theme === "dark" ? "#AAA" : "#888"}
            value={name}
            onChangeText={setName}
            style={[
              styles.input,
              theme === "dark"
                ? {
                    borderColor: "#444",
                    backgroundColor: "#333",
                    color: "#FFF",
                  }
                : {
                    borderColor: "#CCC",
                    backgroundColor: "#FFF",
                    color: "#000",
                  },
              { marginBottom: 16 },
            ]}
          />

          <View style={styles.modalActions}>
            <TouchableOpacity
              onPress={onCancel}
              style={[
                styles.modalBtnCancel,
                { backgroundColor: theme === "dark" ? "#444" : "#DDD" },
              ]}
            >
              <Text style={{ color: theme === "dark" ? "#FFF" : "#000" }}>
                Cancelar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              style={[
                styles.modalBtnSave,
                { backgroundColor: theme === "dark" ? "#FFD700" : "#FFA500" },
              ]}
            >
              <Text style={{ color: "#FFF" }}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
