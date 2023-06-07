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

const Tab = createBottomTabNavigator();

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
        "https://api-cinema-87eh.onrender.com/api/sessoes/Cinemark%20Praiamar"
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
        <ActivityIndicator />
      ) : (
        <NavigationContainer>
          <Tab.Navigator
            tabBarOptions={{
              activeTintColor: "#1f88a7",
              inactiveTintColor: "#b4b4b4",
              labelStyle: { fontSize: 14, fontWeight: "bold" },
            }}
          >
            {dados.map((item, index) => (
              <Tab.Screen
                key={index}
                name={item.data ? item.data.toString() : `Tab${index}`}
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
