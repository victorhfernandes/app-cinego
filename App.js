import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  SectionList,
  StatusBar,
} from 'react-native';

const getSessoes = async () => {
  const res = await fetch('http://127.0.0.1:3000/api/sessoes/Cinemark%20Praiamar');
  const json = await res.json();
  return json;
}

const DATA = getSessoes();

const App = async () => (
  <View style={styles.container}>
    <SectionList
      sections={DATA}
      keyExtractor={(item, index) => item + index}
      renderItem={({item}) => (
        <View style={styles.item}>
          <Text style={styles.title}>{item}</Text>
        </View>
      )}
      renderSectionHeader={({section: {data}}) => (
        <Text style={styles.header}>{data}</Text>
      )}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;