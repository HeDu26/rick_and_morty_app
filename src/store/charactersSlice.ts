import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Character, CharactersState } from "../types/characters";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState: CharactersState = {
  list: [],
  maxItems: 5,
};

const STORAGE_KEY = "@characters_list";

const loadCharacters = async (): Promise<Character[]> => {
  try {
    const savedCharacters = await AsyncStorage.getItem(STORAGE_KEY);
    return savedCharacters ? JSON.parse(savedCharacters) : [];
  } catch (error) {
    console.error("Error al obtener asyncStorage:", error);
    return [];
  }
};

const saveCharacters = async (characters: Character[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(characters));
  } catch (error) {
    console.error("Error al guardar personajes en asyncStorage:", error);
  }
};

loadCharacters().then((loadedCharacters) => {
  initialState.list = loadedCharacters;
});

const charactersSlice = createSlice({
  name: "characters",
  initialState,
  reducers: {
    addCharacter: (state, action: PayloadAction<Character>) => {
      const exists = state.list.some((char) => char.id === action.payload.id);
      if (!exists) {
        const newList = [action.payload, ...state.list].slice(
          0,
          state.maxItems
        );
        state.list = newList;
        saveCharacters(newList);
      }
    },
    removeCharacter: (state, action: PayloadAction<string>) => {
      const newList = state.list.filter((char) => char.id !== action.payload);
      state.list = newList;
      saveCharacters(newList);
    },
    clearCharacters: (state) => {
      state.list = [];
      AsyncStorage.removeItem(STORAGE_KEY).catch((error) => {
        console.error("Error al limpiar storage:", error);
      });
    },
  },
});

export const { addCharacter, removeCharacter, clearCharacters } =
  charactersSlice.actions;
export default charactersSlice.reducer;
