import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  StyleSheet,
  ListRenderItem,
  ActivityIndicator,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import { useQuery } from "@apollo/client";
import { CHARACTERS } from "../graphQl/queries/rick&MortyCharacters";
import { Character, CharactersResponse } from "../types/characters";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { addCharacter, removeCharacter } from "../store/charactersSlice";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.9;

export default function Characters() {
  const [page, setPage] = useState(1);
  const [allCharacters, setAllCharacters] = useState<Character[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const dispatch = useDispatch<AppDispatch>();
  const characters = useSelector(
    (state: { characters: { list: Character[] } }) => state.characters.list
  );

  const { loading, error, data, fetchMore } = useQuery<CharactersResponse>(
    CHARACTERS,
    {
      variables: { page: 1 },
      onCompleted: (data) => {
        if (data.characters.results) {
          setAllCharacters(data.characters.results);
        }
      },
    }
  );

  const loadMoreCharacters = () => {
    if (!hasMore || loading) return;

    fetchMore({
      variables: {
        page: page + 1,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;

        const newCharacters = fetchMoreResult.characters.results;
        const newInfo = fetchMoreResult.characters.info;

        const existingIds = new Set(prev.characters.results.map((c) => c.id));
        const uniqueNewCharacters = newCharacters.filter(
          (char) => !existingIds.has(char.id)
        );

        setAllCharacters((prevChars) => [...prevChars, ...uniqueNewCharacters]);
        setPage((prevPage) => prevPage + 1);
        setHasMore(newInfo.next !== null);

        return {
          characters: {
            info: newInfo,
            results: [...prev.characters.results, ...uniqueNewCharacters],
          },
        };
      },
    });
  };

  const handleAddItem = (item: Character) => () => {
    dispatch(addCharacter(item));
  };

  const handleDeletItem = (item: Character) => () => {
    dispatch(removeCharacter(item.id));
  };

  const addedCharacters = useSelector(
    (state: RootState) => state.characters.list
  );

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
            style={[styles.addButton, isAdded ? styles.addedButton : null]}
            onPress={!isAdded ? handleAddItem(item) : handleDeletItem(item)}
            // disabled={isAdded}
          >
            <Text
              style={isAdded ? styles.addedButtonText : styles.addButtonText}
            >
              {isAdded ? "Eliminar" : "Agregar"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderFooter = () => {
    if (loading) {
      return <ActivityIndicator size="large" color="#0000ff" />;
    }
    if (error) {
      return <Text style={styles.footerText}>Error de solicitud.</Text>;
    }
    if (!hasMore) {
      return <Text style={styles.footerText}>No hay más personajes.</Text>;
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={allCharacters}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onEndReached={loadMoreCharacters}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
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
