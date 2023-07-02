import React, { useContext, useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Linking,
  Pressable,
  Platform,
  Image,
  Dimensions,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
// import { Calendar } from 'react-native-calendars';
import DateTimePicker from "@react-native-community/datetimepicker";
// import * as Animatable from 'react-native-animatable';

import { AuthContext } from "../../navigation/AuthProvider";
import FormInput from "../../components/FormInput";
import { styles as stylesFormInput } from "../../components/FormInput";
import FormButton from "../../components/FormButton";
import LanguagePicker from "../../components/LanguagePicker";
// import SocialButton from '../../components/SocialButton';
import i18n from "../../translations/i18n";

const SignupScreen = ({ navigation }) => {
  const initDob = `${i18n.t("authentication.dob")}*`;

  const { signup, authError, setAuthError } = useContext(AuthContext);
  const [inUserData, setInUserData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    dob: initDob,
    firstName: "",
    lastName: "",
    avgDaysPerPeriod: "",
    // isValidUser: true,
    isValidPassword: true,
  });

  const [date, setDate] = useState(new Date());
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const handleDobPicker = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    const currentDateString = JSON.stringify(currentDate)
      .slice(1)
      .split("T")[0]
      .split("-")
      .join("/");
    setInUserData({ ...inUserData, dob: currentDateString });
    setShowDateTimePicker(Platform.OS === "ios");
    setDate(currentDate);
  };

  const languages = [
    { label: "English", value: "English" },
    { label: "Kanada", value: "Kanada" },
  ];
  const [isOpen, setIsOpen] = useState(false);
  const [currentValue, setCurrentValue] = useState();

  const handleConfirmPassword = (inConfirmPassword) => {
    // let inConfirmPassword = inConfirmPasswordEvent.nativeEvent.text;
    let isEqual = false;
    if (inConfirmPassword !== inUserData.password) {
      // setSignupDisabled(true)
      isEqual = false;
    } else {
      isEqual = true;
    }
    setInUserData({
      ...inUserData,
      confirmPassword: inConfirmPassword,
      isValidPassword: isEqual,
    });
  };

  // const handleSignUpClicked = () => {
  //     if (inUserData.name==='') {
  //         setAuthError("Name cannot be empty")
  //         return
  //     }

  //     if (inUserData.email==='') {
  //         setAuthError("Email cannot be empty")
  //         return
  //     }
  //     if (inUserData.password==='') {
  //         setAuthError("Password cannot be empty")
  //         return
  //     }
  //     if (!inUserData.isValidPassword) {
  //         setAuthError("Password must be at least 6 characters long")
  //         return
  //     }

  //     signup(inUserData.email, inUserData.password, inUserData.firstName, inUserData.lastName, inUserData.dob, inUserData.avgDaysPerPeriod)
  // }

  const handleSignUpClicked = () => {
    if (inUserData.email === "") {
      setAuthError("Email cannot be empty");
      return;
    }
    if (inUserData.password === "" || inUserData.confirmPassword === "") {
      setAuthError("Password cannot be empty");
      return;
    }
    if (inUserData.firstName === "") {
      setAuthError("First Name cannot be empty");
      return;
    }
    if (inUserData.lastName === "") {
      setAuthError("Last Name cannot be empty");
      return;
    }
    if (inUserData.dob === initDob) {
      setAuthError("Date of Birth cannot be empty");
      return;
    }
    if (!inUserData.isValidPassword) {
      return;
    }

    signup(
      inUserData.email,
      inUserData.password,
      inUserData.firstName,
      inUserData.lastName,
      inUserData.dob,
      inUserData.avgDaysPerPeriod
    );
  };

  useEffect(() => {
    setAuthError("");
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Image
          source={require("../../assets/revised-logo.png")}
          style={styles.logo}
        />
      </View>

      <View style={styles.viewWelcome}>
        <Text style={styles.welcomeText}>Welcome!</Text>
      </View>

      <View styles={styles.footer}>
        <View style={styles.languagePickerContainer}>
          <LanguagePicker />
        </View>

        {/* <View style={{position: 'relative', zIndex: 1, paddingLeft: 25, paddingRight: 40}}>
                    <DropDownPicker
                        style={styles.pickerStyle}
                        placeholderStyle={{color: '#272727CC', fontSize: 16}}
                        dropDownContainerStyle={styles.dropDownStyle}
                        //dropDownMaxHeight={4}
                        items={languages}
                        open={isOpen}
                        setOpen={() => setIsOpen(!isOpen)}
                        value={currentValue}
                        placeholder={'Language'}
                    />              
                </View>  */}
        <View style={styles.formInputContainer}>
          <FormInput
            labelValue="First Name"
            placeholderText={i18n.t("authentication.firstName")}
            isRequired={true}
            iconType="user"
            color="black"
            value={inUserData.firstName}
            onChangeText={(inFirstName) => {
              setInUserData({ ...inUserData, firstName: inFirstName });
            }}
            onFocus={() => {
              setShowDateTimePicker(false);
            }}
          />
          <FormInput
            labelValue="Email"
            placeholderText={i18n.t("authentication.emailAddress")}
            isRequired={true}
            iconType="user"
            color="black"
            keyboardType="email-address"
            value={inUserData.email}
            onChangeText={(inEmail) => {
              setInUserData({ ...inUserData, email: inEmail });
            }}
            onFocus={() => {
              setShowDateTimePicker(false);
            }}
          />
          <FormInput
            labelValue="Password"
            placeholderText={i18n.t("authentication.password")}
            isRequired={true}
            iconType="lock"
            color="black"
            // isPassword={true}
            secureTextEntry={true}
            value={inUserData.password}
            onChangeText={(inPassword) => {
              setInUserData({ ...inUserData, password: inPassword });
            }}
            onFocus={() => {
              setShowDateTimePicker(false);
            }}
          />
          <FormButton
            btnTitle={i18n.t("authentication.signUp")}
            isHighlight={true}
            // disabled={inUserData.isValidPassword}
            onPress={handleSignUpClicked}
          />

          {authError ? (
            // <Animatable.View animation="fadeInLeft" duration={500}>
            <View>
              <Text style={[styles.centerItems, styles.errTextStyle]}>
                {typeof authError === "object"
                  ? JSON.stringify(authError)
                  : authError}
              </Text>
            </View>
          ) : // </Animatable.View>
          null}
        </View>
        <View style={styles.centerItems}>
          <Text style={{ fontSize: 16 }}>
            Already have an account?
            <Text
              style={{ fontSize: 16, fontWeight: "bold" }}
              onPress={() => {
                navigation.navigate("LoginScreen");
              }}
            >
              {" "}
              Sign in
            </Text>
          </Text>
        </View>

        {/* <FormInput
                    labelValue="Confirm Password"
                    placeholderText={i18n.t('authentication.confirmPassword')}
                    isRequired={true}
                    iconType="lock"
                    color="black"
                    // isPassword={true}
                    secureTextEntry={true}
                    value={inUserData.confirmPassword}
                    onChangeText={ handleConfirmPassword }
                    // onEndEditing={ handleConfirmPassword }
                    onFocus={()=>{ setShowDateTimePicker(false) }} /> */}
        {inUserData.isValidPassword ? null : (
          // <Animatable.View animation="fadeInLeft" duration={500}>
          <View>
            <Text style={[styles.centerItems, styles.errTextStyle]}>
              Password does not match
            </Text>
            {/* </Animatable.View> */}
          </View>
        )}

        {/* <FormInput
                    labelValue="Last Name"
                    placeholderText={i18n.t('authentication.lastName')}
                    isRequired={true}
                    iconType="user"
                    color="black"
                    value={inUserData.lastName}
                    onChangeText={(inLastName)=>{
                        setInUserData({...inUserData, lastName: inLastName})
                    }}
                    onFocus={()=>{ setShowDateTimePicker(false) }} /> */}
        {/* <Pressable style={stylesFormInput.parentViewStyle}
                    onPress={()=>{ setShowDateTimePicker(true) }} >
                    <View style={stylesFormInput.viewStyle}>
                        <Text style={inUserData.dob==initDob ? styles.dobInitTextStyle : styles.dobTextStyle} >
                            {inUserData.dob}
                        </Text>
                    </View>
                </Pressable>
                { showDateTimePicker ?
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display="spinner"
                        timeZoneOffsetInMinutes={-60*24}
                        maximumDate={new Date()}
                        onChange={handleDobPicker}
                    />
                : null } */}

        {/* <FormInput
                    labelValue=""
                    placeholderText={i18n.t('authentication.avgPeriodDays')}
                    value={ inUserData.avgDaysPerPeriod }
                    keyboardType={"number-pad"}
                    onChangeText={ (inAvgDaysPerPeriod) => {
                        setInUserData({...inUserData, avgDaysPerPeriod: inAvgDaysPerPeriod})
                    }}
                    onFocus={()=>{ setShowDateTimePicker(false) }} /> */}

        {/* <Text style={styles.centerItems}>
                    By signing up, you agree to our
                    <Text style={styles.underlineStyle} onPress={()=>Linking.openURL('https://google.com')}>Terms of Service</Text>
                    and
                    <Text style={styles.underlineStyle} onPress={()=>Linking.openURL('https://apple.com')}>Privacy Policy</Text>
                </Text> */}
      </View>
    </View>
  );
};

const { height } = Dimensions.get("screen");
const styles = StyleSheet.create({
  centerItems: {
    alignItems: "center",
    paddingBottom: 60,
  },
  underlineStyle: {
    textDecorationLine: "underline",
  },
  modalStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  dobInitTextStyle: {
    color: "#272727CC",
    paddingTop: 10,
  },
  dobTextStyle: {
    color: "black",
    paddingTop: 10,
  },
  errTextStyle: {
    color: "red",
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
  footer: {
    flex: 5,
    justifyContent: "center",
    alignItems: "center",
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
});

export default SignupScreen;
