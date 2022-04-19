import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Box, Button, Center, NativeBaseProvider,fontSize } from "native-base";
import { parse } from "react-native-svg";

const Splashscreen = ({ navigation }) => {
  // const [Details, setDetails] = useState();

  const splashscreen = async () => {
    try {
      let user = await AsyncStorage.getItem("userfor");
      let parsed = JSON.parse(user);
      console.log(user);
      //  setDetails(obj);
      console.log(parsed.token);
      
      if (parsed.token) {
        navigation.navigate("Dashboard");
      } 
    
    }
     catch(e) {
      navigation.navigate("Login")
    }
  };       
  useEffect(() => {
    splashscreen();
  });

  return (
    <NativeBaseProvider>
      <Center>
      <Box flex="1" alignItems="center">
      {/* <Text fontSize="x3l"> */}
           
          ADMIN PANEL
             {/* </Text> 
         <Text> */}
           
         LOADING
        PLEASE WAIT
           {/* </Text>  */}
       
        
        </Box>
        </Center>
    </NativeBaseProvider>
  );
};
export default Splashscreen;
