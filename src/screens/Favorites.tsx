import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  Dimensions,
  ListRenderItem,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { Character } from "../types/characters";
import { removeCharacter } from "../store/charactersSlice";

const { width } = Dimensions.get("window");

const CARD_WIDTH = width * 0.9;

export default function Favorites() {
  const dispatch = useDispatch();
  const addedCharacters = useSelector(
    (state: RootState) => state.characters.list
  );

  const handleDeletItem = (item: Character) => () => {
    dispatch(removeCharacter(item.id));
  };

  const renderItem: ListRenderItem<Character> = ({ item }) => {
    const isAdded = addedCharacters.some(
      (char: Character) => char.id === item.id
    );
    return (
      <View style={styles.card}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.cardContent}>
          <Text style={styles.name}>{item.name}</Text>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Estado:</Text>
            <View
              style={[
                styles.statusIndicator,
                {
                  backgroundColor:
                    item.status === "Alive"
                      ? "#55cc44"
                      : item.status === "Dead"
                      ? "#ff4444"
                      : "#ffaa33",
                },
              ]}
            />
            <Text style={styles.value}>
              {item.status === "Alive"
                ? "Vivo"
                : item.status === "Dead"
                ? "Muerto"
                : "Desconocido"}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Genero:</Text>
            <Text style={styles.value}>
              {item.gender === "Female"
                ? "Femenino"
                : item.gender === "Male"
                ? "Masculino"
                : item.gender === "Genderless"
                ? "Sin genero"
                : "Desconocido"}
            </Text>
          </View>

          {/* Botón Agregar */}
          <TouchableOpacity
            style={[styles.addButton, styles.addedButton]}
            onPress={handleDeletItem(item)}
          >
            <Text style={styles.addedButtonText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={addedCharacters}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  listContent: {
    paddingVertical: 20,
    alignItems: "center",
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: "white",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: CARD_WIDTH * 0.8,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cardContent: {
    padding: 15,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontWeight: "600",
    color: "#666",
    marginRight: 6,
    width: 70,
  },
  value: {
    flex: 1,
    color: "#444",
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  loader: {
    marginVertical: 20,
  },
  footerText: {
    textAlign: "center",
    padding: 20,
    color: "#888",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    padding: 20,
  },
  addButton: {
    marginTop: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: "green",
    borderRadius: 5,
    alignItems: "center",
  },
  addButtonText: {
    color: "green",
    fontWeight: "bold",
  },
  addedButton: {
    borderColor: "red",
    backgroundColor: "#f0f0f0",
  },
  addedButtonText: {
    color: "red",
    fontWeight: "bold",
  },
});
