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
        "http://192.168.15.182:3000/api/sessoes/Cinemark%20Praiamar"
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
                    <View style={{ flexDirection: "row" }}>
                      <Image
                        style={{ width: 100, height: 150 }}
                        source={{
                          uri: item.poster,
                        }}
                      />
                      <View>
                        <Text>{item.nome}</Text>
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
