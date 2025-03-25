import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  StyleSheet,
  ListRenderItem,
  ActivityIndicator,
} from "react-native";
import { useQuery } from "@apollo/client";
import { CHARACTERS } from "../graphQl/queries/rick&MortyCharacters";

type CharacterInfo = {
  count: number;
  pages: number;
  next: number | null;
  prev: number | null;
};

type Character = {
  id: string;
  name: string;
  image: string;
};

type CharactersResponse = {
  characters: {
    info: CharacterInfo;
    results: Character[];
  };
};

export default function Characters() {
  const [page, setPage] = useState(1);
  const [allCharacters, setAllCharacters] = useState<Character[]>([]);
  const [hasMore, setHasMore] = useState(true);

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

        setAllCharacters((prevChars) => [...prevChars, ...newCharacters]);
        setPage(page + 1);
        setHasMore(newInfo.next !== null);

        return {
          characters: {
            info: newInfo,
            results: [...prev.characters.results, ...newCharacters],
          },
        };
      },
    });
  };

  const renderItem: ListRenderItem<Character> = ({ item }) => (
    <View style={styles.item}>
      <Text>{item.name}</Text>
    </View>
  );

  const renderFooter = () => {
    if (loading) {
      return <ActivityIndicator size="large" color="#0000ff" />;
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
  },
  listContent: {
    paddingBottom: 20,
  },
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  footerText: {
    textAlign: "center",
    padding: 10,
    color: "#888",
  },
});
