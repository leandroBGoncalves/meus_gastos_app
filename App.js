import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StackRouter } from './src/configs/routes';
import { ContextProvider } from './src/context/contextProvider';

export default function App() {
  return (
    <ContextProvider>
      <NavigationContainer>
        <StackRouter />
      </NavigationContainer>
      <StatusBar style="auto" />
    </ContextProvider>
  );
}

