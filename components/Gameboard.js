import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Header from './Header';
import Footer from './Footer';
import { NBR_OF_DICES, 
    NBR_OF_THROWS, MIN_SPOT, MAX_SPOT, BONUS_POINTS_LIMIT, BONUS_POINTS, SCOREBOARD_KEY } from '../constants/Game';
import styles from '../style/style';
import { Container, Row, Col } from 'react-native-flex-grid';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AsyncStorage from "@react-native-async-storage/async-storage";
let board = [];

export default Gameboard = ({ navigation, route }) => {

    const [playerName, setPlayerName] = useState("");
  const [nbrOfThrowsLeft, setNbrOfThrowsLeft] = useState(NBR_OF_THROWS);
  const [status, setStatus] = useState("Throw dices");
  const [gameEndStatus, setGameEndStatus] = useState(false);
  const [selectedDices, setSelectedDices] = useState(
    new Array(NBR_OF_DICES).fill(false)
  );
  const [diceSpots, setDiceSpots] = useState(new Array(NBR_OF_DICES).fill(0));
  const [selectedDicePoints, setSelectedDicePoints] = useState(
    new Array(MAX_SPOT).fill(false)
  );
  const [dicePointsTotal, setDicePointsTotal] = useState(
    new Array(MAX_SPOT).fill(0)
  );
  const [scores, setScores] = useState([]);

  useEffect(() => {
    if (playerName === "" && route.params?.player) {
      setPlayerName(route.params.player);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getScoreboardData();
    });
    return unsubscribe;
  }, [navigation]);

  

  const dicesRow = [];
  for (let dice = 0; dice < NBR_OF_DICES; dice++) {
    dicesRow.push(
      <Col key={"dice" + dice}>
        <Pressable
          key={"dice" + dice}
          onPress={() => selectDice(dice)}
          style={[
            styles.diceContainer,
            { backgroundColor: getDiceColor(dice) },
          ]}
        >
          <MaterialCommunityIcons
            name={board[dice]}
            key={"dice" + dice}
            size={50}
            color="white"
          />
        </Pressable>
      </Col>
    );
  }

  const pointsRow = [];
  for (let spot = 0; spot < MAX_SPOT; spot++) {
    pointsRow.push(
      <Col key={"pointsRow" + spot}>
        <Text key={"pointsRow" + spot} style={styles.pointText}>
          {getSpotTotal(spot)}
        </Text>
      </Col>
    );
  }

  const pointsToSelectRow = [];
  for (let diceButton = 0; diceButton < MAX_SPOT; diceButton++) {
    pointsToSelectRow.push(
      <Col key={"buttonsRow" + diceButton}>
        <Pressable
          key={"buttonsRow" + diceButton}
          onPress={() => selectDicePoints(diceButton)}
          style={[
            styles.pointButton,
            { backgroundColor: getDicePointsColor(diceButton) },
          ]}
        >
          <MaterialCommunityIcons
            name={"numeric-" + (diceButton + 1) + "-circle"}
            key={"buttonsRow" + diceButton}
            size={35}
            color="white"
          />
        </Pressable>
      </Col>
    );
  }

    const selectDicePoints = (i) => {
        if (nbrOfThrowsLeft === 0) {
            let selectedPoints = [...selectedDicePoints];
            let points = [...dicePointsTotal];
            if (!selectedPoints[i]) {
            selectedPoints[i] = true;
            let nbrOfDices = diceSpots.reduce((total, x) => (x === (i + 1) ? total + 1 : total), 0);
            points[i] = nbrOfDices * (i + 1);
            }
            else {
                setStatus('You already selected points for ' + (i + 1));
                return points[i];
        }

        setDicePointsTotal(points);
        setSelectedDicePoints(selectedPoints);
        return points[i];
    }
    else {
        setStatus('Throw ' + NBR_OF_THROWS + ' times before setting points');
    }
    }
    const savePlayerPoints = async() => {
        const newKey = scores.length + 1;
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        const hours = String(currentDate.getHours()).padStart(2, '0');
        const minutes = String(currentDate.getMinutes()).padStart(2, '0');
        const seconds = String(currentDate.getSeconds()).padStart(2, '0');
        const formattedTime = `${hours}:${minutes}:${seconds}`;

        const totalPoints = selectedDicePoints.reduce(
          (total, isSelected, index) => {
            if (isSelected) {
              
              total += (index + 1) * diceSpots.filter((spot) => spot === (index + 1)).length;
            }
            return total;
          },
          
        );

        const playerPoints = {
            key: newKey,
            name: playerName,
            date: formattedDate, //päivämäärä tänne funktiolla
            time: formattedTime, //kellonaika tänne funktiolla 
            points: totalPoints  // yhteispisteet (mahdollinen bonus mukaan)
        }
        try {
            const newScore = [...scores, playerPoints];
            newScore.sort((a, b) => b.points - a.points);
            const jsonValue = JSON.stringify(newScore);
            await AsyncStorage.setItem(SCOREBOARD_KEY, jsonValue);
        }
        catch (e) {
            console.log('Save error: ' + e);
        }
    }

    const getScoreboardData = async() => {
        try {
            const jsonValue = await AsyncStorage.getItem(SCOREBOARD_KEY);
            if (jsonValue !== null) {
                let tmpScores = JSON.parse(jsonValue);
                setScores(tmpScores);
            }
        }
        catch(e) {
            console.log('Read error: ' + e);
        }
    }

    const throwDices = () => {
      
      if (nbrOfThrowsLeft === 0 || gameEndStatus) {
        
        setSelectedDices(new Array(NBR_OF_DICES).fill(false));
        setDiceSpots(new Array(NBR_OF_DICES).fill(0));
        setSelectedDicePoints(new Array(MAX_SPOT).fill(false));
        setDicePointsTotal(new Array(MAX_SPOT).fill(0));
        setNbrOfThrowsLeft(NBR_OF_THROWS);
        setGameEndStatus(false);
        setStatus('Throw dices');
      } else {
        
        let spots = [...diceSpots];
        for (let i = 0; i < NBR_OF_DICES; i++) {
          if (!selectedDices[i]) {
            let randomNumber = Math.floor(Math.random() * 6 + 1);
            board[i] = 'dice-' + randomNumber;
            spots[i] = randomNumber;
          }
        }
        setNbrOfThrowsLeft(nbrOfThrowsLeft - 1);
        setDiceSpots(spots);
        setStatus('Select and throw dices again');
      }
    };
    
      

        function getSpotTotal(i) {
            return dicePointsTotal[i];
        }

        const selectDice = (i) => {
            if (nbrOfThrowsLeft < NBR_OF_THROWS && !gameEndStatus) {
                let dices = [...selectedDices];
                dices[i] = selectedDices[i] ? false : true;
                setSelectedDices(dices);
            }
            else {
                setStatus('You have to throw dices first.');
            }
        }

        function getDiceColor(i) {
            return selectedDices[i] ? '#0F72E4' : 'black';
        }

        function getDicePointsColor(i) {
            return (selectedDicePoints[i] && !gameEndStatus) ? '#0F72E4' : 'black';
        }



    
        return (
            <>
              <Header />
              <View style={styles.container}>
                <Text style={styles.title}>Gameboard</Text>
                <Container fluid>
                  <Row>{dicesRow}</Row>
                </Container>
                <Text style={styles.infoText}>Throws left: {nbrOfThrowsLeft}</Text>
                <Text style={styles.infoText}>{status}</Text>
                <Pressable
                  onPress={() => throwDices()}
                  style={styles.actionButton}
                >
                  <Text style={styles.buttonText}>THROW DICES</Text>
                </Pressable>
                <Container fluid>
                  <Row>{pointsRow}</Row>
                </Container>
                <Container fluid>
                  <Row>{pointsToSelectRow}</Row>
                </Container>
                <Pressable
                  onPress={() => savePlayerPoints()}
                  style={styles.actionButton}
                >
                  <Text style={styles.buttonText}>SAVE POINTS</Text>
                </Pressable>
                <Text style={styles.infoText}>Player: {playerName}</Text>
              </View>
              <Footer />
            </>
          );
        };
        
          
    