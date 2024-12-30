import React from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet, ImageBackground, StatusBar} from 'react-native';


const WelcomePage = ({ navigation }) => {
  return (  
    <>
      <StatusBar backgroundColor="transparent" barStyle="light-content" translucent />
      <ImageBackground
        source={require('../assets/background.jpg')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <Text style={styles.welcomeText}>Welcome to Melodify!</Text>
          <Text style={styles.introText}>Discover and listen to music. Join us now for a great experience!</Text>
          <View style={styles.buttonContainer}>
            <Button title="Login" onPress={() => navigation.navigate('Login')} />
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerText}>
              Don't have an account? <Text style={styles.registerLink}>Register</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </>
  );
};

export default WelcomePage;

const styles = StyleSheet.create({
    background: {
      flex: 1,
      justifyContent: 'center', // Center content vertically
      alignItems: 'center',    // Center content horizontally
    },
    overlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional semi-transparent overlay for better contrast
    },
    welcomeText: {
      fontSize: 24,
      color: '#ffffff', // White text for readability on dark backgrounds
      marginBottom: 20,
      marginTop: 250,
      fontWeight: 'bold',
    },
    introText: {
      fontSize: 16,
      color: '#ffffff', // White text for readability on dark backgrounds
      textAlign: 'center',
      marginBottom: 100,
    },
    buttonContainer: {
      width: '80%',          // Set the width to 80% of the parent container
      marginTop: 100,         // Optional: space between the text and the button
      borderRadius: 5,       // Optional: rounded corners for the button
      overflow: 'hidden',    // Optional: to make the button's border radius effective
    },
    registerText: {
      fontSize: 14,
      color: '#ffffff', // White text for readability on dark backgrounds
      marginTop: 20,    // Space between the button and the register text
    },
    registerLink: {
      color: '#007BFF', // Green color for the "Register" word
      fontWeight: 'bold', // Make the "Register" text stand out more
    },
  });
  