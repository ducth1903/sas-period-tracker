import React, { useContext, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  Pressable,
} from "react-native";
import LanguagePicker from "../../components/LanguagePicker";

import { AuthContext } from "../../navigation/AuthProvider";
import { SettingsContext } from "../../navigation/SettingsProvider";
import FormInput from "../../components/FormInput";
import FormButton from "../../components/FormButton";
import SignInWithGoogle from "../../navigation/SignInWithGoogle";
import i18n from "../../translations/i18n";

import getEnvVars from "../../environment";
const { API_URL } = getEnvVars();

const LoginScreen = ({ navigation }) => {
  const { userId, login, loginWithGoogle, authError, setAuthError, setHasDoneSurvey } = useContext(AuthContext);
  const { selectedSettingsLanguage } = useContext(SettingsContext);
  const [hiddenPassword, setHiddenPassword] = useState(true);

  const [languagePickerOpen, setLanguagePickerOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  const [inUserData, setInUserData] = useState({
    email: "",
    password: ""
  });

  async function checkHasDoneSurvey() {
        try {
            let response = await fetch(`${API_URL}/users/${userId}`);
            let json = await response.json();
            setHasDoneSurvey(json.hasDoneSurvey);
        }
        catch (error) {
            setHasDoneSurvey(false);
            console.log(`[LoginScreen] checkHasDoneSurvey error: ${error}`);
        }
    }
    
  useEffect(() => {
    checkHasDoneSurvey();
    setAuthError("");
  }, []);

  const handleEmail = (inEmail) => {
    setInUserData({
      ...inUserData,
      email: inEmail,
    });
  };
  const handlePassword = (inPassword) => {
    setInUserData({
      ...inUserData,
      password: inPassword,
    });
  };
  const login_with_email = (inEmail, inPassword) => {
    login(inEmail, inPassword);
  };
  const handleEyeClicked = () => {
    setHiddenPassword(!hiddenPassword);
  };

  const errorToString = (error) => {
    if (error.toLowerCase().includes("auth/invalid-email")){
      return i18n.t('authentication.invalidEmail');
    }
    else if (error.toLowerCase().includes("auth/wrong-password")) {
      return i18n.t('authentication.invalidPassword');
    }
    else {
      console.log(`[LoginScreen] errorToString: error = ${error}`)
      return i18n.t('authentication.unrecognizedError');
    }
  }

  return (
    <ScrollView contentContainerStyle={{ backgroundColor: '#FEFFF4', paddingTop: 20 }}>
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <Image
            source={require("../../assets/revised-logo.png")}
            style={styles.logo}
          />
        </View>

        <View style={styles.viewWelcome}>
          <Text style={styles.welcomeText}>{i18n.t('authentication.welcomeBack')}</Text>
        </View>

        <View style={styles.body}>
          <View style={styles.formInputContainer}>
            <Pressable
              style={styles.languagePickerContainer}
              onPress={() => {setLanguagePickerOpen(!languagePickerOpen)}}
            >
              <LanguagePicker />
            </Pressable>
            <FormInput
              labelValue="Email"
              placeholderText={i18n.t("authentication.emailAddress")}
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
              secureTextEntry={hiddenPassword}
              value={inUserData.password}
              onChangeText={handlePassword}
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
            {authError ? (
              <View>
                <Text style={[styles.centerItems, styles.errorMsg]}>
                  {errorToString(authError)}
                </Text>
              </View>
            ) : null}
          </View>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate("ForgotPasswordScreen");
            }}
            style={styles.centerItems}
          >
            <Text style={[styles.signUpStyle, styles.bottomItems]}>
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
                {i18n.t("authentication.signUp")}
              </Text>
            </Text>
          </View>

          <View style={styles.formInputContainer}>
            <SignInWithGoogle successFn={loginWithGoogle} />
          </View>
        </View>
      </View>
    </ScrollView>
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
  body: {
    marginTop: 20,
  },
  centerItems: {
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
  },
  textStyle: {
    fontSize: 16,
  },
  bottomItems: {
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
    fontSize: 32
  },
  footer: {
    flex: 5,
    justifyContent: "center",
    paddingBottom: 35,
  },
  signIn: {
    paddingTop: 85,
  },
  languagePickerContainer: {
    paddingLeft: 25,
    paddingRight: 25,
    margin: 8,
    zIndex: 1
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
