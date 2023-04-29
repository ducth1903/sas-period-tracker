import React, { useContext, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import LanguagePicker from "../../components/LanguagePicker";
// import * as Animatable from 'react-native-animatable';

import { AuthContext } from "../../navigation/AuthProvider";
import FormInput from "../../components/FormInput";
import FormButton from "../../components/FormButton";
import SignInWithGoogle from "../../navigation/SignInWithGoogle";
// import SocialButton from '../../components/SocialButton';
import i18n from "../../translations/i18n";

const LoginScreen = ({ navigation }) => {
  const { login, loginWithGoogle, authError, setAuthError } = useContext(AuthContext);
  const [hiddenPassword, setHiddenPassword] = useState(true);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  const [inUserData, setInUserData] = useState({
    email: "",
    password: "",
    // isValidUser: true,
    // isValidPassword: true
  });

  useEffect(() => {
    setAuthError("");
  }, []);

  handleEmail = (inEmail) => {
    setInUserData({
      ...inUserData,
      email: inEmail,
    });
  };
  handlePassword = (inPassword) => {
    setInUserData({
      ...inUserData,
      password: inPassword,
    });
  };
  login_with_email = (inEmail, inPassword) => {
    login(inEmail, inPassword);
  };
  handleEyeClicked = () => {
    setHiddenPassword(!hiddenPassword);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Image
          source={require("../../assets/revised-logo.png")}
          style={styles.logo}
        />
      </View>

      <View style={styles.viewWelcome}>
        <Text style={styles.welcomeText}>Welcome back!</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.formInputContainer}>
          <LanguagePicker />
          <FormInput
            labelValue="Email"
            placeholderText={i18n.t("authentication.email")}
            iconType="user"
            color="black"
            keyboardType="email-address"
            value={inUserData.email}
            onChangeText={handleEmail}
          />
          <FormInput
            labelValue="Password"
            placeholderText={i18n.t("authentication.password")}
            iconType="lock"
            color="black"
            //isPassword={true}
            secureTextEntry={hiddenPassword}
            value={inUserData.password}
            onChangeText={handlePassword}
          //onPressEyeBtn={handleEyeClicked}
          />
          <View>
            <FormButton
              btnTitle={i18n.t("authentication.signIn")}
              isHighlight={true}
              onPress={() =>
                login_with_email(inUserData.email, inUserData.password)
              }
            />
          </View>
        </View>

        {authError ? (
          // <Animatable.View animation="fadeInLeft" duration={500}>
          <View>
            <Text style={[styles.centerItems, styles.errorMsg]}>
              {authError}
            </Text>
          </View>
        ) : null}

        {/* <SocialButton 
                    btnTitle="Sign In With Google"
                    btnType="google"
                    btnColor="#de4d41" 
                    bgColor="#f5e5ea"
                    onPress={ () => console.log("gmail") } /> */}
        {/* <SocialButton 
                    btnTitle="Sign In With Facebook"
                    btnType="facebook-square"
                    btnColor="#4867aa" 
                    bgColor="#e6eaf4"
                    onPress={ () => console.log("facebook") } /> */}
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("ForgotPasswordScreen");
          }}
          style={styles.centerItems}
        >
          <Text style={[styles.textStyle, styles.bottomItems]}>
            {i18n.t("authentication.forgotPassword")}
          </Text>
        </TouchableOpacity>

        <View style={styles.centerItems}>
          <Text style={{ fontSize: 16 }}>
            {i18n.t("authentication.noAccount")}
            <Text
              style={styles.signUpStyle}
              onPress={() => {
                navigation.navigate("SignupScreen");
              }}
            >
              {" "}
              {i18n.t("authentication.noAccountSignUp")}
            </Text>
          </Text>
        </View>

        <View style={styles.formInputContainer}>
          <SignInWithGoogle successFn={loginWithGoogle} />
        </View>
      </View>
    </View>
  );
};

const { height } = Dimensions.get("screen");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F6F6",
    justifyContent: "flex-start",
    alignItems: "stretch",
  },
  // footer: {
  //     flex: 1,
  //     backgroundColor: '#F6F6F6',
  //     alignItems: 'center',
  //     // justifyContent: 'flex-start',
  //     borderTopLeftRadius: 30,
  //     borderTopRightRadius: 30,
  //     paddingVertical: 50,
  //     paddingHorizontal: 30,

  //     flexDirection: 'row',
  //     flexWrap: 'wrap',
  //     // alignItems: 'flex-start'
  // },

  centerItems: {
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
  },
  textStyle: {
    fontSize: 16,
    //color: "#AC3632",
  },
  // textUnderlineStyle: {
  //   textDecorationLine: "underline",
  // },
  bottomItems: {
    // flex: 1,
    justifyContent: "flex-end",
  },
  errorMsg: {
    color: "#FF0000",
    fontSize: 14,
  },
  header: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: height * 0.17,
    height: height * 0.17,
    resizeMode: "stretch",
  },
  viewWelcome: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeText: {
    textAlign: "center",
    fontWeight: 700,
    fontSize: 32,
    lineHeight: 43,
  },
  footer: {
    flex: 5,
    justifyContent: "center",
    paddingBottom: 35,
  },
  signIn: {
    paddingTop: 85,
    //paddingBottom: 30
  },
  languagePickerContainer: {
    paddingLeft: 25,
    paddingRight: 25,
    margin: 8,
    zIndex: 1,
  },
  formInputContainer: {
    paddingLeft: 25,
    paddingRight: 25,
  },
  signUpStyle: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default LoginScreen;
