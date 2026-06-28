import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import CustomTabBar from '../components/CustomTabBar';
import GlobalFocusBar from '../components/GlobalFocusBar';
import HomeScreen from '../screens/HomeScreen';
import LearnScreen from '../screens/LearnScreen';
import MainsScreen from '../screens/MainsScreen';
import TestScreen from '../screens/TestScreen';
import SubjectDetailScreen from '../screens/SubjectDetailScreen';
import FocusModeScreen from '../screens/FocusModeScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { TimerProvider } from '../context/TimerContext';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Learn" component={LearnScreen} />
      <Tab.Screen name="Mains" component={MainsScreen} />
      <Tab.Screen name="Test" component={TestScreen} />
      <Tab.Screen name="Focus" component={FocusModeScreen} />
    </Tab.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

function AppStack() {
  return (
    <TimerProvider>
      <View style={{ flex: 1 }}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="SubjectDetail" component={SubjectDetailScreen} />
        </Stack.Navigator>
        <GlobalFocusBar />
      </View>
    </TimerProvider>
  );
}

function RootSwitch() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg }}>
        <ActivityIndicator size="large" color={colors.primaryBlue} />
      </View>
    );
  }

  if (!user) return <AuthStack />;
  if (!profile?.onboardingComplete) return <OnboardingScreen />;
  return <AppStack />;
}

export default function RootNavigator() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <RootSwitch />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
