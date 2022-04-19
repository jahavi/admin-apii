import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./screens/login";

import Signup from "./screens/signup";

import Dashboard from "./screens/dashboard";

import Profile from "./screens/profile";
import Splashscreen from "./screens/splashscreen";
import Changepassword from "./screens/checkpass";
import Updatepassword from "./screens/updatepass";
import Forgotpasscheckemail from "./screens/fogotpasscheckemail";
import Updatepasswordforforgotpass from "./screens/updatepassforforgotpass";
import Authen from "./screens/authentication";
//import ForgotPassword from "./screens/forgotPassword";
const Stack = createNativeStackNavigator();
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splashscreen"
        screenOptions={{ headerShown: true }}
      >
        <Stack.Screen
          component={Login}
          name="Login"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          component={Splashscreen}
          name="Splashscreen"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          component={Signup}
          name="Signup"
          options={{ headerShown: true }}
        />
        <Stack.Screen
          component={Dashboard}
          name="Dashboard"
          options={{ headerShown: true }}
        />
        <Stack.Screen
          component={Profile}
          name="Profile"
          options={{ headerShown: true }}
        />

        <Stack.Screen
          component={Changepassword}
          name="Changepassword"
          options={{ headerShown: true }}
        />
        <Stack.Screen
          component={Forgotpasscheckemail}
          name="Forgotpasscheckemail"
          options={{ headerShown: true }}
        />
        <Stack.Screen
          component={Updatepasswordforforgotpass}
          name="Updatepasswordforforgotpass"
          options={{ headerShown: true }}
        />
        <Stack.Screen
          component={Authen}
          name="Authen"
          options={{ headerShown: true }}
        />
        <Stack.Screen
          component={Updatepassword}
          name="Updatepassword"
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default App;
