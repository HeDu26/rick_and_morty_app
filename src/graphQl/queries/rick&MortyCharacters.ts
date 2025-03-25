import { gql } from "@apollo/client";

export const CHARACTERS = gql`
  query GetCharacters($page: Int!) {
    characters(page: $page) {
      info {
        count
        next
      }
      results {
        id
        name
        gender
        status
        image
      }
    }
  }
`;
