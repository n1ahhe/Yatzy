import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7B500',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 10,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 20,
    margin: 10,
    fontWeight: 'bold',
  },
  actionButton: {
    margin: 30,
    padding: 10,
    backgroundColor: '#D92304',
    width: 150,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
  },
  diceContainer: {
    padding: 10,
    width: 70,
    height: 70,
    margin: 5,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointText: {
    fontSize: 20,
    color: '#0F72E4',
    textAlign: 'center',
    marginLeft: 15,
    
    
  },
  pointButton: {
    padding: 5,
    width: 70,
    height: 70,
    //margin: 5,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  header: {
    marginTop: 30,
    marginBottom: 15,
    backgroundColor: '#F7B500',
    
  },
  footer: {
    marginTop: 20,
    backgroundColor: '#F7B500',
    flexDirection: 'row',
  },
  author: {
    backgroundColor: '#F7B500', 
    fontWeight: 'bold',
    flex: 1,
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },

  input: {
    backgroundColor: '#D92304',
    color: 'black',
    width: '80%',
    height: 40,
    borderRadius: 5,
    margin: 10,
    padding: 5,
    fontSize: 20, 
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  
});

export default styles;
