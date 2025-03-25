import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import Favorites from "../screens/Favorites";
import Characters from "../screens/Characters";

const Tab = createBottomTabNavigator();

type TabIconProps = {
  focused: boolean;
  color: string;
  size: number;
};

type RouteProps = {
  route: {
    name: string;
  };
};

export default function Navigation() {
  return (
    <Tab.Navigator
      screenOptions={({ route }: RouteProps) => ({
        tabBarIcon: ({ focused, color, size }: TabIconProps) => {
          let iconName: string = "";

          if (route.name === "Personajes") {
            iconName = focused ? "people" : "people-outline";
          } else if (route.name === "Favoritos") {
            iconName = focused ? "heart" : "heart-outline";
          }

          // Puedes devolver cualquier componente aquí
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "blue",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "white",
        },
        tabBarItemStyle: {
          paddingVertical: 5,
        },
      })}
    >
      <Tab.Screen name="Personajes" component={Characters} />
      <Tab.Screen name="Favoritos" component={Favorites} />
    </Tab.Navigator>
  );
}
