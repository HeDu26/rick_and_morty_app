import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Character, CharactersState } from "../types/characters";

const initialState: CharactersState = {
  list: [],
  maxItems: 5,
};

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
      }
    },
    removeCharacter: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter((char) => char.id !== action.payload);
    },
    clearCharacters: (state) => {
      state.list = [];
    },
  },
});

export const { addCharacter, removeCharacter, clearCharacters } =
  charactersSlice.actions;
export default charactersSlice.reducer;
