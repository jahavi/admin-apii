import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Heading,
  VStack,
  FormControl,
  Input,
  Link,
  Button,
  HStack,
  Center,
  NativeBaseProvider,
  Image,
  Menu,
  Divider,
  Pressable,
  Avatar,
} from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Dashboard = ({ navigation }) => {
  const [imagess, setImage] = useState(null);
  const [refresh, setrefresh] = useState("");
  useEffect(() => {
    getImage();
    refreshPage;
  }, []);

  const navprofile = () => {
    navigation.navigate("Profile");
  };
  const Changepassword = async () => {
    navigation.navigate("Changepassword");
  };

  const logout = async () => {
    try {
      let user = await AsyncStorage.getItem("userfor");
      let parsed = JSON.parse(user);

      console.log(parsed.token);
      console.log(parsed.token, "nooo");
      await AsyncStorage.removeItem("userfor", parsed.token);
     
      console.log(parsed.email, "yess");
    } catch (e) {
      navigation.navigate("Login");
    }
  };
  // const addImage = async () => {
  //   let images = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //     allowsEditing: false,
  //     //   aspect: [4,3],
  //     quality: 1,
  //   });
  //   console.log(images);
  //   console.log(images.cancelled);
  //   AsyncStorage.setItem("userImage", JSON.stringify(images));
  //   setImage(images.uri);
  // };

  const getImage = async () => {
    let user = await AsyncStorage.getItem("userImage");
    let parsed = JSON.parse(user);

    console.log(parsed, "ddddddddddd");

    setImage(parsed.uri);
  };
  const refreshPage = () => {
    window.location.reload(false);
  };
  return (
    <NativeBaseProvider>
      <Box h="90%" w="100%" alignItems="flex-end">
        <Menu
          w="300"
          closeOnSelect={false}
          // onOpen={() => console.log("opened")}
          // onClose={() => console.log("closed")}
          trigger={(triggerProps) => {
            return (
              <Pressable {...triggerProps}>
                <Avatar
                  bg="white.900"
                  source={{
                    // uri: imagess,
                   uri: setImage   ? imagess : <Avatar
                        bg="green.500"
                        mr="1"
                        source={{
                          uri: "https://bit.ly/broken-link",
                        }}
                      >
                        RS
                      </Avatar> 
                
                  }}
                >
                  NB
                </Avatar>
                {/* <Avatar
                        bg="green.500"
                        mr="1"
                        source={{
                          uri: "https://bit.ly/broken-link",
                        }}
                      >
                        RS
                      </Avatar> */}
              </Pressable>
            );
          }}
        >
          <Menu.Item onPress={navprofile}>profile</Menu.Item>
          <Menu.Item onPress={Changepassword}>changepassword</Menu.Item>
          <Menu.Item onPress={logout}>logout</Menu.Item>
        </Menu>

        <Divider w="100%" mt="4" thickness="2" bg="black" />
        {/* <Button onPress={navprofile}> click </Button> */}
      </Box>
    </NativeBaseProvider>
  );
};
export default Dashboard;
