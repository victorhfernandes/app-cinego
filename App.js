import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
  Image,
  StyleSheet,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";

const Tab = createBottomTabNavigator();

const MovieScreen = ({ filmes }) => (
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
              <View>
                <Text>
                  {item.tecnologia} {item.linguagem}
                </Text>
                <View>
                  <FlatList
                    data={item.horarios}
                    horizontal
                    renderItem={({ item }) => (
                      <View style={styles.showtimeContainer}>
                        <Text style={styles.showtimeText}>{item}</Text>
                      </View>
                    )}
                  />
                </View>
              </View>
            )}
          />
        </View>
      </View>
    )}
  />
);

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
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <NavigationContainer>
          <Tab.Navigator>
            {dados.map((item, index) => (
              <Tab.Screen
                key={index}
                name={item.data ? item.data.toString() : `Tab${index}`}
                component={() => <MovieScreen filmes={item.filmes} />}
              />
            ))}
          </Tab.Navigator>
        </NavigationContainer>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  movieContainer: {
    flexDirection: "row",
    padding: 10,
  },
  moviePoster: {
    width: 100,
    height: 150,
  },
  movieDetails: {
    marginLeft: 5,
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  showtimeContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    marginRight: 8,
  },
  showtimeText: {
    fontSize: 12,
  },
});

export default App;
