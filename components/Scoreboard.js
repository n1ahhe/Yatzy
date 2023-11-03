import { useState, useEffect } from "react";
import { Text, View, Pressable } from "react-native";
import { DataTable } from "react-native-paper";
import Header from './Header';
import Footer from './Footer';
import { NBR_OF_SCOREBOARD_ROWS, SCOREBOARD_KEY } from "../constants/Game";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from '../style/style';

export default Scoreboard = ({ navigation }) => {
    const [scores, setScores] = useState([]);
  
    useEffect(() => {
      const unsubscribe = navigation.addListener("focus", () => {
        getScoreboardData();
      });
      return unsubscribe;
    }, [navigation]);
  
    const getScoreboardData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem(SCOREBOARD_KEY);
        if (jsonValue !== null) {
          let tmpScores = JSON.parse(jsonValue);
          setScores(tmpScores);
        }
      } catch (e) {
        console.log("Read error: " + e);
      }
    };
  
    const clearScoreBoard = async () => {
      try {
        await AsyncStorage.clear();
        setScores([]);
      } catch (e) {
        console.log("Clear error: " + e);
      }
    };
  
    return (
      <>
        <Header />
        <View style={styles.container}>
          <Text style={styles.title}>Scoreboard</Text>
          {scores.length === 0 ? (
            <Text style={styles.infoText}>Scoreboard is empty</Text>
          ) : (
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>No.</DataTable.Title>
                <DataTable.Title>Name</DataTable.Title>
                <DataTable.Title>Date</DataTable.Title>
                <DataTable.Title>Time</DataTable.Title>
                <DataTable.Title>Points</DataTable.Title>
              </DataTable.Header>
              {scores.map((player, index) =>
                index < NBR_OF_SCOREBOARD_ROWS ? (
                  <DataTable.Row key={player.key}>
                    <DataTable.Cell>{index + 1}.</DataTable.Cell>
                    <DataTable.Cell>{player.name}</DataTable.Cell>
                    <DataTable.Cell>{player.date}</DataTable.Cell>
                    <DataTable.Cell>{player.time}</DataTable.Cell>
                    <DataTable.Cell>{player.points}</DataTable.Cell>
                  </DataTable.Row>
                ) : null
              )}
            </DataTable>
          )}
          <Pressable
            style={styles.actionButton}
            onPress={() => clearScoreBoard()}
          >
            <Text style={styles.buttonText}>CLEAR SCOREBOARD</Text>
          </Pressable>
        </View>
        <Footer />
      </>
    );
  };