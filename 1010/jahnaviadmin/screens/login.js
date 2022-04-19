import React, { useState } from "react";
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
  Pressable,
  Redirect,
} from "native-base";
import { ImageBackground } from "react-native";

import { useForm } from "react-hook-form";
import Signup from "./signup";
import AsyncStorage from "@react-native-async-storage/async-storage";
const image = {
  uri: "https://www.keralarealestate.com/image/xl/property/property/2020/11/05/092223291/images/slider.jpg",
};
export default function Login({ navigation }) {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const [Details, setDetails] = useState({});
  const [conf, setConf] = React.useState(false);
  const onSubmit = async (data) => {
    try {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      console.log(data);
      var raw = JSON.stringify({
        firstname: data.FirstName,
        lastname: data.LastName,
        email: data.email,
        password: data.password,
        //confirmpassword: dataconfir,
      });

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const response = await fetch(
        "http://localhost:8080/login",
        requestOptions
      );

      if (response.ok) {
        const data = await response.json();
        AsyncStorage.setItem("userfor", JSON.stringify(data));
        console.log(data);

        // if (token == null) {
        //   return <Redirect to={Routes.Login} />;
        // }
        navigation.navigate("Dashboard");
      }
    } catch (err) {
      console.log(err);
      // setConf(true)
    }
  };

  const navSignin = () => {
    navigation.navigate("Signup");
  };
  const forgotPass = () => {
    navigation.navigate("Forgotpasscheckemail");
  };
  return (
    <NativeBaseProvider>
      <Box flex={1}>
        <ImageBackground
          source={image}
          resizeMode="cover"
          width="100%"
          height="100%"
        >
          <Center mt="60">
            <Heading
              size="lg"
              fontWeight="600"
              color="coo<NativeBaseProvider>lGray.800"
              _dark={{
                color: "warmGray.50",
              }}
            >
              Welcome
            </Heading>
          </Center>
          <Center mt="10">
            <Image
              source={require("../assets/shadowproperties.png")}
              alt="logo"
              h="150"
              w="200"
            />
          </Center>
          <Center mt="8">
            <form onSubmit={handleSubmit(onSubmit)}>
              <VStack>
                <Box mt="5" w="300" h="9">
                  <FormControl>
                    <FormControl.Label>
                      {" "}
                      <Text color="black" bold fontSize="lg">
                        EMAIL{" "}
                      </Text>
                    </FormControl.Label>
                    <input
                      p="6"
                      {...register("email", {
                        required: true,
                        pattern:
                          /^[a-z0-9](\.?[a-z0-9]){5,}@g(oogle)?mail\.com$/i,
                      })}
                      placeholder="email"
                    />
                    {errors.email?.type === "required" && "email is required"}
                  </FormControl>
                </Box>
                <Box mt="5" mb="5" pt="6">
                  <FormControl>
                    <FormControl.Label>
                      {" "}
                      <Text color="black" bold fontSize="lg">
                        PASSWORD{" "}
                      </Text>
                    </FormControl.Label>
                    <input
                      {...register("password", {
                        required: true,
                        pattern:
                          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/i,
                      })}
                      placeholder="password"
                    />
                    {errors.password?.type === "required" &&
                      "password is required"}
                    {/* {conf ? <Text color="black" bold >ENTER VALIDE PASSWORD</Text> : null} */}
                  </FormControl>
                  <Text fontSize={"xs"}>
                    Min 8 char and 1 uppercase and 1 number.
                  </Text>
                </Box>
                <input color="black" type="submit" />
                {/* <Button onPress={onSubmit}>click</Button> */}
              </VStack>
            </form>
            <Center m="5">
              <Pressable onPress={forgotPass}>
                <Text bold fontSize="md">
                  Forgot password
                </Text>
              </Pressable>
            </Center>

            <Box m="3" mt="3">
              <Button mt="2" onPress={navSignin}>
                Registration
              </Button>
            </Box>
          </Center>
        </ImageBackground>
      </Box>
    </NativeBaseProvider>
  );
}
