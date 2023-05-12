import { createStackNavigator } from '@react-navigation/stack';
import { Home } from '../pages/home';
import { Login } from '../pages/login';
import { SignUp } from '../pages/signUp';

const Stack = createStackNavigator();

export function StackRouter() {
  return (
    <Stack.Navigator 
    initialParams={'Login'}
    screenOptions={{ 
        headerShown: false, 
      }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Navigator>
  );
}