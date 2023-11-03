import { useState } from 'react';
import { TextInput, Text, View, Pressable, Keyboard } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Header from './Header';
import Footer from './Footer';
import { NBR_OF_DICES, 
    NBR_OF_THROWS, MIN_SPOT, MAX_SPOT, BONUS_POINTS_LIMIT, BONUS_POINTS } from '../constants/Game';
    import styles from '../style/style';

export default Home = ({ navigation }) => {

    const [playerName, setPlayerName] = useState('');
    const [hasPlayerName, setHasPlayerName] = useState(false);

    const handlePlayerName = (value) => {
        if (value.trim().length > 0 ) {
            setHasPlayerName(true);
            Keyboard.dismiss();
        }
    };

return(
    <>
         <Header />
      <View style={styles.container}>
        <MaterialCommunityIcons name="information" size={90} color="#FF6700" />
        {!hasPlayerName ? (
          <>
            <Text style={styles.title}>Welcome to Mini-Yahtzee!</Text>
            <Text style={styles.infoText}>Enter your name to start the game:</Text>
            <TextInput
              style={styles.input}
              onChangeText={setPlayerName}
              autoFocus={true}
            />
            <Pressable
              style={styles.actionButton}
              onPress={() => handlePlayerName(playerName)}
            >
              <Text style={styles.buttonText}>Start</Text>
            </Pressable>
          </>
        ) : (
          <>
            <Text style={styles.title}>Rules of the Game</Text>
            <Text style={styles.infoText}>
              The game is based on the upper section of the classic Yahtzee
              dice game. You have {NBR_OF_DICES} dice and {NBR_OF_THROWS} rolls
              to score as many points as possible.
            </Text>
            <Text style={styles.infoText}>
              After each roll, you can select dice to keep and try to achieve
              high scores for the different categories, which range from{' '}
              {MIN_SPOT} to {MAX_SPOT}.
            </Text>
            <Text style={styles.infoText}>
              Your goal is to earn as many points as possible. If you score at
              least {BONUS_POINTS_LIMIT} points, you'll receive a bonus of{' '}
              {BONUS_POINTS} points.
            </Text>
            <Text style={styles.infoText}>
              Good luck, {playerName}! Press "Play" to start the game.
            </Text>
            <Pressable
              style={styles.actionButton}
              onPress={() => navigation.navigate('Gameboard', { player: playerName })}
            >
              <Text style={styles.buttonText}>Play</Text>
            </Pressable>
          </>
        )}
      </View>
      <Footer />
    </>
  );
};