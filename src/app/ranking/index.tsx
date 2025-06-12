import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useColorScheme } from "react-native";
import { colors } from "../styles/styles";
import ModalNewCompetition from "../components/modalNewCompetition";
import styles from "../ranking/styles";

interface Competition {
  id: string;
  name: string;
}

interface Member {
  id: string;
  name: string;
  points: number;
}

export default function RankingScreen() {
  const theme = useColorScheme() === "dark" ? "dark" : "light";
  const [competitions, setCompetitions] = useState<Competition[]>([
    { id: "1", name: "Academia" },
    { id: "2", name: "Corrida" },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCompetition, setSelectedCompetition] =
    useState<Competition | null>(null);
  const [members, setMembers] = useState<Member[]>([]);

  const openCompetition = (c: Competition) => {
    setSelectedCompetition(c);
    setMembers([
      { id: "1", name: "Ana", points: 120 },
      { id: "2", name: "Bruno", points: 95 },
      { id: "3", name: "Carla", points: 150 },
    ]);
  };

  const goBack = () => {
    setSelectedCompetition(null);
    setMembers([]);
  };

  const sortedMembers = members.slice().sort((a, b) => b.points - a.points);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, width: "100%", padding: 16 }}>
        {!selectedCompetition ? (
          <>
            <View style={styles.header}>
              <Text style={styles.title}>Competições</Text>
              <TouchableOpacity
                className="bg-yellow-500 px-4 py-2 rounded"
                onPress={() => setModalVisible(true)}
              >
                <Text className="text-white font-bold">+ Nova Competição</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={competitions}
              contentContainerStyle={{ width: "100%" }}
              keyExtractor={(c) => c.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => openCompetition(item)}
                >
                  <Text style={styles.itemText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </>
        ) : (
          <>
            <View style={styles.header}>
              <TouchableOpacity onPress={goBack}>
                <Text style={styles.backText}>← Voltar</Text>
              </TouchableOpacity>
              <Text style={styles.title}>{selectedCompetition.name}</Text>
              <View style={{ width: 40 }} />
            </View>

            <ScrollView horizontal contentContainerStyle={{ minWidth: "100%" }}>
              <View style={{ width: "100%" }}>
                <View style={styles.rowHeader}>
                  <Text style={[styles.cell, styles.rankCol]}>#</Text>
                  <Text style={[styles.cell, styles.nameCol]}>Nome</Text>
                  <Text style={[styles.cell, styles.pointsCol]}>Pontos</Text>
                </View>
                {sortedMembers.map((m, i) => (
                  <View key={m.id} style={styles.row}>
                    <Text style={[styles.cell, styles.rankCol]}>{i + 1}</Text>
                    <Text style={[styles.cell, styles.nameCol]}>{m.name}</Text>
                    <Text style={[styles.cell, styles.pointsCol]}>
                      {m.points}
                    </Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </>
        )}

        <ModalNewCompetition
          visible={modalVisible}
          theme={theme}
          onCancel={() => setModalVisible(false)}
          onSave={(comp) => {
            setCompetitions((prev) => [...prev, comp]);
            setModalVisible(false);
          }}
        />
      </View>
    </SafeAreaView>
  );
}
