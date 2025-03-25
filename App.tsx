import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import Navigation from "./src/navigation/Navigation";
import { ApolloProvider } from "@apollo/client";
import apolloClient from "./src/apolloClient/apolloClient";
import { Provider } from "react-redux";
import { store } from "./src/store";

export default function App() {
  return (
    <Provider store={store}>
      <ApolloProvider client={apolloClient}>
        <NavigationContainer>
          <Navigation />
        </NavigationContainer>
      </ApolloProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
