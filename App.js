import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importing your screens
import RegistrationScreen from './src/Screens/Registration';
import SignupScreen from './src/Screens/signup';
import BiometricScreen from './src/Screens/BiometricScreen';
import BiometricSuccessScreen from './src/Screens/BiometricSuccessScreen';
import HomeScreen from './src/Screens/HomeScreen';
import MyAccountScreen from './src/Screens/MyAccountScreen';
import TopUpWallet from './src/Screens/TopUpWallet';
import EnterPinScreen from './src/Screens/EnterPinScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [userData, setUserData] = useState(null);

  return (
    <SafeAreaProvider style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="onboarding"
          screenOptions={{ headerShown: false }}
        >
          {/* Onboarding Flow */}
          <Stack.Screen name="onboarding">
            {(props) => (
              <RegistrationScreen
                onFinish={() => props.navigation.replace('signup')}
              />
            )}
          </Stack.Screen>

          {/* Signup Flow */}
          <Stack.Screen name="signup">
            {(props) => (
              <SignupScreen
                onRegister={(data) => {
                  setUserData(data);
                  props.navigation.replace('biometrics');
                }}
              />
            )}
          </Stack.Screen>

          {/* Enable Biometrics Step */}
          <Stack.Screen name="biometrics">
            {(props) => (
              <BiometricScreen
                userData={userData}
                onEnable={(registeredUser) => {
                  setUserData(registeredUser);          // ✅ store backend user response
                  props.navigation.replace('biometricSuccess'); // ✅ go to success screen
                }}
              />
            )}
          </Stack.Screen>

          {/* Success Screen -> go to Home */}
          <Stack.Screen name="biometricSuccess">
            {(props) => (
              <BiometricSuccessScreen
                onAuthenticate={() => props.navigation.replace('home')}
              />
            )}
          </Stack.Screen>

          {/* Home */}
          <Stack.Screen name="home">
            {(props) => (
              <HomeScreen
                {...props} // ✅ gives navigation prop to HomeScreen
                userData={userData}
                onProfilePress={() => props.navigation.navigate('myAccount')}
              />
            )}
          </Stack.Screen>

          {/* My Account Screen */}
          <Stack.Screen name="myAccount">
            {(props) => (
              <MyAccountScreen
                userData={userData}
                onBack={() => props.navigation.goBack()}
                onLogout={() => {
                  setUserData(null);
                  props.navigation.replace('onboarding');
                }}
              />
            )}
          </Stack.Screen>

          {/* ✅ REQUIRED: Topupwallet route (this is what HomeScreen navigates to) */}
          <Stack.Screen name="Topupwallet" component={TopUpWallet} />

          {/* Topup Flow Next Step */}
          <Stack.Screen name="EnterPin" component={EnterPinScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});