export type CharacterInfo = {
  count: number;
  pages: number;
  next: number | null;
  prev: number | null;
};

export type Character = {
  id: string;
  name: string;
  image: string;
  status: string;
  gender: string;
};

export type CharactersResponse = {
  characters: {
    info: CharacterInfo;
    results: Character[];
  };
};

export type CharactersState = {
  list: Character[];
  maxItems: number;
};
