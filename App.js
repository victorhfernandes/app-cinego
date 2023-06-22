import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  Text,
  View,
  Image,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { SelectList } from "react-native-dropdown-select-list";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();
//const cinemas = "Cinemark Praiamar"; //Santos
//const cinemas = "Cine flix Miramar"; //Santos
//const cinemas = "Cine Roxy 5 Gonzaga"; //Santos
//const cinemas = "Cine Roxy 6 Brisamar"; //São Vicente
//const cinemas = "Cine Roxy 3 Parque Anilinas"; //Cubatão
//const cinemas = "Cine 3 Ferry Boat's Plaza"; //Guarujá
//const cinemas = "Espaço Itaú de Cinema - Augusta"; //São Paulo
//const cinemas = "Petra Belas Artes"; //São Paulo

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
  const [cinema, setCinema] = useState("Cinemark Praiamar");
  const [data, setData] = useState([]);

  const getMovies = async () => {
    try {
      const resCine = await fetch(
        "https://api-cinema-87eh.onrender.com/api/cinemas"
      );
      const jsonCine = await resCine.json();
      setData(jsonCine);

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
    setLoading(true);
    getMovies();
  }, [cinema]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ paddingTop: StatusBar.currentHeight }} />
      {isLoading ? (
        <View style={styles.loading}>
          <Image
            style={styles.tinyLogo}
            source={require("./assets/adaptive-icon.png")}
          />
          <ActivityIndicator size="large" color="#6554AF" />
        </View>
      ) : (
        <NavigationContainer
          theme={{
            colors: {
              background: "#2B2730",
            },
          }}
        >
          <SelectList
            setSelected={setCinema}
            data={data}
            placeholder={cinema}
            search={false}
            inputStyles={{ color: "#F0EEED", fontWeight: "bold" }}
            dropdownTextStyles={{ color: "#F0EEED" }}
          />
          <Tab.Navigator
            screenOptions={{
              tabBarIcon: ({ color, size }) => {
                let iconName;
                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: "#6554AF",
              tabBarInactiveTintColor: "#F0EEED",
              tabBarLabelStyle: {
                fontSize: 14,
                fontWeight: "bold",
              },
              tabBarStyle: [
                {
                  display: "flex",
                  backgroundColor: "#2B2730",
                },
                null,
              ],
              headerShown: false,
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
    backgroundColor: "#2B2730",
  },
  loading: {
    backgroundColor: "#2B2730",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tinyLogo: {
    width: 125,
    height: 125,
    marginBottom: 15,
  },
  movieContainer: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#2B2730",
    backgroundColor: "#2B2730",
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
    color: "#F0EEED",
  },
  cinemaTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  showtimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  showtimeText: {
    fontSize: 12,
    marginRight: 8,
    color: "#f0eeedd8",
  },
  timeContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#6554AF",
    borderRadius: 20,
    marginRight: 8,
  },
  timeText: {
    fontSize: 12,
    color: "#F0EEED",
  },
});

export default App;
