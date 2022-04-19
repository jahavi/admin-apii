import { Box, NativeBaseProvider, Avatar, Text } from "native-base";
import {
  Image,
  View,
  Platform,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

export default function Profile() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");

  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);

  const getdetails = async () => {
    let user = await AsyncStorage.getItem("userfor");
    let parsed = JSON.parse(user);

    console.log(parsed.token);
    let firstname = parsed.firstname;
    setFirstname(firstname);
    let lastname = parsed.lastname;
    setLastname(lastname);
    let email = parsed.email;
    setEmail(email);
  };

  const addImage = async () => {
    let images = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      //   aspect: [4,3],
      quality: 1,
    });
    console.log(images);
    //console.log(images.cancelled);
    AsyncStorage.setItem("userImage", JSON.stringify(images));
    setImage(images.uri);
  };

  const getImage = async () => {
    let users = await AsyncStorage.getItem("userImage");
    let parsed = JSON.parse(users);

    console.log(parsed, "ddddddddddd");

    setImage(parsed.uri);
  };

  useEffect(() => {
    getdetails();
     getImage();
  }) 
  return (
    <NativeBaseProvider>
      <Box>
        <Box h="80%" w="90%" alignItems="Center">
          {/* <Avatar
            alignSelf="center"
            size="2xl"
            bg="white.900"
            // source={{
            //   uri: "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
            // }}
            {...image && (
                <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
              )}
              
             
              <TouchableOpacity
                onPress={addImage}
                style={imageUploaderStyles.uploadBtn}
              >
                <Text>{image ? "Edit" : "Upload"} Image</Text>
                <AntDesign name="camera" size={20} color="black" />
              </TouchableOpacity>
            
          >
            NB

          </Avatar> */}

          <View style={imageUploaderStyles.container}>
            {image && (
              <Image
                source={{ uri: image }}
                style={{ width: 200, height: 200 }}
              />
            )}

            <View style={imageUploaderStyles.uploadBtnContainer}>
              <TouchableOpacity
                onPress={addImage}
                style={imageUploaderStyles.uploadBtn}
              >
                <Text>{image ? "Edit" : "Upload"} Image</Text>
                <AntDesign name="camera" size={20} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        </Box>
        <Box pt="6" h="70%" w="90%" alignItems="Center">
          <p bold fontSize="xl" bg="coolgray.800" px="9">
            FIRSTNAME : {firstname}
          </p>
          <p pt="5" bold fontSize="xl" bg="coolgray.800" px="9">
            LASTNAME : {lastname}
          </p>
          <p pt="5" bold fontSize="xl" bg="coolgray.800" px="9">
            EMAIL : {email}
          </p>
        </Box>
      </Box>
    </NativeBaseProvider>
  );
}
const imageUploaderStyles = StyleSheet.create({
  container: {
    elevation: 2,
    height: 200,
    width: 200,
    backgroundColor: "#efefef",
    position: "relative",
    borderRadius: 999,
    overflow: "hidden",
  },
  uploadBtnContainer: {
    opacity: 0.7,
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "lightgrey",
    width: "100%",
    height: "25%",
  },
  uploadBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});
