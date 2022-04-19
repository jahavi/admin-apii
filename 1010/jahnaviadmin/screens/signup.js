import * as React from "react";
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
} from "native-base";
import { ImageBackground } from "react-native";
const image = {
  uri: "https://img.gtsstatic.net/reno/imagereader.aspx?imageurl=https%3A%2F%2Fsir.azureedge.net%2F1253i215%2F07xva8b2wvx8map1p0fegpwhx2i215&option=N&h=472&permitphotoenlargement=false",
};

import { InputAccessoryView } from "react-native";
import { useForm } from "react-hook-form";

export default function Signin({ navigation }) {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const [data, setValue] = React.useState("");
  const [conf, setConf] = React.useState(false);

  //   const [datapass, setValuepass] = React.useState("");
  //   const [dataconfir, setValueconfir] = React.useState("");
  //   const [datafirstname, setValuefstname] = React.useState("");
  //   const [datalastname, setValuelstname] = React.useState("");
  //   const handleChange = async () => {
  //     //console.log(data);
  //   }
  const [confirm, setValueconfirm] = React.useState("");
  //  const checkconfimpass =(data)=>{
  //    console.log(data)
  //    password= data.password,
  //    confirmpassword= data.confirmpassword
  //    if(data.confirmpassword != data.password){
  //      setValueconfirm("password does not match ")
  //  }}

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
        confirmpassword: data.confirmpassword,
      });

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const response = await fetch(
        "http://localhost:8080/signin",
        requestOptions
      );
      if (data.password == data.confirmpassword) {
        if (response.ok) {
          const data = await response.json();
          console.log(data);

          navigation.navigate("Login");
        }
      } else if (data.password != data.confirmpassword) {
        setConf(true);
      }
    } catch (err) {
      console.log(err);
    }
  };
  // React.useEffect(()=>{
  //   checkconfimpass()
  // });

  return (
    <NativeBaseProvider>
      <Box flex={1}>
        <ImageBackground
          source={image}
          resizeMode="cover"
          width="100%"
          height="100%"
        >
          <Center>
            <Heading
              size="lg"
              fontWeight="600"
              color="coolGray.800"
              _dark={{
                color: "warmGray.50",
              }}
            >
              SignUp
            </Heading>

            <Center>
              <form onSubmit={handleSubmit(onSubmit)}>
                <VStack pb="100%">
                  <Box mt="5">
                    <FormControl>
                      <FormControl.Label>
                        {" "}
                        <Text color="black" bold fontSize="lg">
                          FirstName{" "}
                        </Text>
                      </FormControl.Label>
                      <input
                        {...register("FirstName", {
                          required: true,
                          pattern: /^[a-zA-Z]{2,}$/i,
                        })}
                        placeholder="First Name"
                        //   onChangeText={(text) => {
                        //     setValuefstname(text);
                        //   }}
                        //   onChangeText={(value) =>
                        //     setValue({ ...data,
                        //     firstname: value })
                        //   }
                      />
                      {errors.FirstName?.type === "required" &&
                        "FirstName is required"}
                    </FormControl>
                  </Box>
                  <Box mt="5">
                    <FormControl>
                      <FormControl.Label>
                        <Text color="black" bold fontSize="lg">
                          LastName{" "}
                        </Text>
                      </FormControl.Label>
                      <input
                        {...register("LastName", {
                          required: true,
                          pattern: /^[a-zA-Z]{2,}$/i,
                        })}
                        placeholder="Last Name"
                        //   onChangeText={(text) => {
                        //     setValuelstname(text);
                        //   }}
                      />
                      {errors.LastName?.type === "required" &&
                        "LastName is required"}
                    </FormControl>
                  </Box>
                  <Box mt="5">
                    <FormControl>
                      <FormControl.Label>
                        <Text color="black" bold fontSize="lg">
                          Email{" "}
                        </Text>
                      </FormControl.Label>
                      <input
                        {...register("email", {
                          required: true,
                          pattern:
                            /^[a-z0-9](\.?[a-z0-9]){5,}@g(oogle)?mail\.com$/i,
                        })}
                        placeholder="email"
                        //   onChangeText={(text) => {
                        //     setValue(text);
                        //   }}
                      />
                      {errors.email?.type === "required" && "email is required"}
                    </FormControl>
                  </Box>
                  <Box mt="5">
                    <FormControl>
                      <FormControl.Label>
                        <Text color="black" bold fontSize="lg">
                          Password{" "}
                        </Text>
                      </FormControl.Label>
                      <input
                        {...register("password", {
                          required: true,
                          pattern:
                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/i,
                        })}
                        placeholder="password"
                        //   onChangeText={(text) => {
                        //     setValuepass(text);
                        //   }}
                      />
                      {errors.password?.type === "required" &&
                        "password is required"}
                    </FormControl>
                    <Text fontSize={"xs"} color="black">
                      Min 8 char and 1 uppercase and 1 number.
                    </Text>
                  </Box>
                  <Box pb="10">
                    <FormControl>
                      <FormControl.Label>
                        <Text color="black" bold fontSize="lg">
                          Confirm Password{" "}
                        </Text>
                      </FormControl.Label>
                      <input
                        {...register("confirmpassword", {
                          required: true,
                          pattern:
                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/i,
                        })}
                        placeholder="password"
                      />
                      {errors.password?.type === "required" &&
                        "password is required"}
                      {conf ? (
                        <Text color="black" bold>
                          ENTER VALIDE PASSWORD
                        </Text>
                      ) : null}
                    </FormControl>
                  </Box>
                  <input type="submit" />
                  
                </VStack>
              </form>
            </Center>
          </Center>
        </ImageBackground>
      </Box>
    </NativeBaseProvider>
  );
}
