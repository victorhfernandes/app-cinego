import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
  Image,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();
const cinema = "Cinemark Praiamar"; //Santos
//const cinema = "Cine flix Miramar"; //Santos
//const cinema = "Cine Roxy 5 Gonzaga"; //Santos
//const cinema = "Cine Roxy 6 Brisamar"; //São Vicente
//const cinema = "Cine Roxy 3 Parque Anilinas"; //Cubatão
//const cinema = "Cine 3 Ferry Boat's Plaza"; //Guarujá
//const cinema = "Espaço Itaú de Cinema - Augusta"; //São Paulo
//const cinema = "Petra Belas Artes"; //São Paulo

const MovieScreen = ({ filmes }) => {
  return (
    <FlatList
      data={filmes}
      renderItem={({ item }) => (
        <View style={styles.movieContainer}>
          <Image
            style={styles.moviePoster}
            source={{
              uri: item.poster,
            }}
          />
          <View style={styles.movieDetails}>
            <Text style={styles.movieTitle}>{item.nome}</Text>
            <FlatList
              data={item.sessoes}
              renderItem={({ item }) => (
                <View style={styles.showtimeContainer}>
                  <Text style={styles.showtimeText}>
                    {item.tecnologia} {item.linguagem}
                  </Text>
                  <FlatList
                    data={item.horarios}
                    horizontal
                    renderItem={({ item }) => (
                      <View style={styles.timeContainer}>
                        <Text style={styles.timeText}>{item}</Text>
                      </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                  />
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </View>
      )}
      keyExtractor={(item, index) => index.toString()}
    />
  );
};

const App = () => {
  const [isLoading, setLoading] = useState(true);
  const [dados, setDados] = useState([]);

  const getMovies = async () => {
    try {
      const response = await fetch(
        `https://api-cinema-87eh.onrender.com/api/sessoes/${cinema}`
      );
      const json = await response.json();
      setDados(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMovies();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#000" />
      </View>
      ) : (
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ color, size }) => {
                let iconName;
                if (route.name === "Home") {
                  iconName = "home-outline";
                } else if (route.name === "Profile") {
                  iconName = "person-outline";
                }

                return <Ionicons name={iconName} size={size} color={color} />;
              },
            })}
            tabBarOptions={{
              activeTintColor: "#1f88a7",
              inactiveTintColor: "#b4b4b4",
              labelStyle: { fontSize: 14, fontWeight: "bold" },
            }}
          >
            {dados.map((item, index) => (
              <Tab.Screen
                key={index}
                name={
                  item.data + " - " + cinema
                    ? item.data.toString() + " - " + cinema
                    : `Tab${index}`
                }
              >
                {() => <MovieScreen filmes={item.filmes} />}
              </Tab.Screen>
            ))}
          </Tab.Navigator>
        </NavigationContainer>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
  },
  movieContainer: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  moviePoster: {
    width: 100,
    height: 150,
    borderRadius: 8,
  },
  movieDetails: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "center",
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  showtimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  showtimeText: {
    fontSize: 12,
    marginRight: 8,
    color: "#666",
  },
  timeContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#1f88a7",
    borderRadius: 20,
    marginRight: 8,
  },
  timeText: {
    fontSize: 12,
    color: "#fff",
  },
});

export default App;
