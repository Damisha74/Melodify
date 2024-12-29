import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Audio } from 'expo-av';
import WelcomePage from './screens/WelcomePage';
import LoginPage from './screens/LoginPage';
import RegisterPage from './screens/RegisterPage';
import HomePage from './screens/HomePage';
import { ClickCountProvider } from './contexts/ClickCountContext';

const Stack = createNativeStackNavigator();

// Audio configuration function
const configureAudio = async () => {
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false
    });
  } catch (error) {
    console.error('Error configuring audio:', error);
  }
};

const App = () => {
  useEffect(() => {
    configureAudio();
  }, []);

  return (
    <ClickCountProvider>
<NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen
          name="Welcome"
          component={WelcomePage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginPage}
          options={{  headerShown: false, }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterPage}
          options={{  headerShown: false, }}
        />
       
        <Stack.Screen
          name="Home"
          component={HomePage}
          options={{ 
            headerShown: false,
            // title: 'Home',
            // Prevent going back to login/register
            // headerBackVisible: false,
            // gestureEnabled: false
          }}
        />

       
      </Stack.Navigator>
    </NavigationContainer>
    </ClickCountProvider>
    
  );
};

export default App;