import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SectionList,
  Text,
  View,
  StatusBar,
  Image,
} from "react-native";

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
    <View style={{ flex: 1, padding: 24 }}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <View>
          <FlatList
            data={dados}
            renderItem={({ item }) => (
              <View>
                <Text>{item.data}</Text>
                <FlatList
                  data={item.filmes}
                  renderItem={({ item }) => (
                    <View style={{ flexDirection: "row", padding: 10 }}>
                      <Image
                        style={{ width: 100, height: 150 }}
                        source={{
                          uri: item.poster,
                        }}
                      />
                      <View style={{ marginLeft: 5 }}>
                        <Text>{item.nome}</Text>
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
                                    <View>
                                      <Text> {item} </Text>
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
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
};

export default App;
