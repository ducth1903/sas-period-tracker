import React, { useContext, useEffect, useState, useCallback } from "react";
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import Modal from 'react-native-modal';

import { AuthContext } from "../../navigation/AuthProvider";
import { SettingsContext } from "../../navigation/SettingsProvider";
import FormInput from "../../components/FormInput";
import FormButton from "../../components/FormButton";
import LanguagePicker from "../../components/LanguagePicker";
import ScrollPicker from "../../components/ScrollPicker";
import i18n from "../../translations/i18n";
import EditIcon from '../../assets/edit_icon.svg'

import getEnvVars from "../../environment";
const { API_URL } = getEnvVars();

const SignupScreen = ({ navigation }) => {
  const { userId, signup, authError, setAuthError, setFirstName, setHasDoneSurvey } = useContext(AuthContext);
  const { selectedSettingsLanguage } = useContext(SettingsContext);

  const [birthYear, setBirthYear] = useState(new Date().getFullYear());
  const [birthMonth, setBirthMonth] = useState(new Date().getMonth() + 1);

  const [dobModalVisible, setDobModalVisible] = useState(false);

  const scrollPickerItemHeight = 46;

  const [inUserData, setInUserData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    dob: "",
    firstName: "",
    lastName: "",
    avgDaysPerPeriod: "",
    isValidPassword: true,
  });

  const [showDateTimePicker, setShowDateTimePicker] = useState(false);

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

  useEffect(() => {
    setInUserData({...inUserData, dob: `${birthMonth < 10 ? '0' : ''}${birthMonth}/${birthYear}`});
  }, [birthYear, birthMonth]);

  const handleViewableItemsChangedMonth = useCallback(({viewableItems, changed}) => {
    if (!viewableItems[1]) return;
    let centerViewable = viewableItems[1].item.id;
    setBirthMonth(centerViewable + 1);
  }, []);

  const handleViewableItemsChangedYear = useCallback(({viewableItems, changed}) => {
    if (!viewableItems[1]) return;
    let centerViewable = viewableItems[1].item.id;
    setBirthYear(centerViewable);
  }, []);

  const handleSignUpClicked = () => {
    if (inUserData.email === "") {
      setAuthError(i18n.t('authentication.emailCannotBeEmpty'));
      return;
    }
    if (inUserData.password === "" || inUserData.confirmPassword === "") {
      setAuthError(i18n.t('authentication.passwordCannotBeEmpty'));
      return;
    }
    if (inUserData.password !== inUserData.confirmPassword) {
      setAuthError(i18n.t('authentication.passwordsDoNotMatch'));
      return;
    }
    if (!(inUserData.password.length >= 6)) {
      setAuthError(i18n.t('authentication.weakPassword'));
      return;
    }
    if (inUserData.firstName === "") {
      setAuthError(i18n.t('authentication.firstNameCannotBeEmpty'));
      return;
    }
    if (inUserData.lastName === "") {
      setAuthError(i18n.t('authentication.lastNameCannotBeEmpty'));
      return;
    }
    if (!inUserData.isValidPassword) {
      return;
    }

    setFirstName(inUserData.firstName);
    setHasDoneSurvey(false);
    signup(
      inUserData.email,
      inUserData.password,
      inUserData.firstName,
      inUserData.lastName,
      inUserData.dob,
      inUserData.avgDaysPerPeriod
    ).catch(error => {console.log(`[SignupScreen] signup error: ${error}`)});
  };

  async function checkHasDoneSurvey() {
    try {
        let response = await fetch(`${API_URL}/users/${userId}`);
        let json = await response.json();
        console.log(`[LoginScreen] checkHasDoneSurvey: ${JSON.stringify(json)}`);
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
          <Text style={styles.welcomeText}>{i18n.t('authentication.welcome')}</Text>
        </View>

        <View styles={styles.footer}>
          <View style={styles.languagePickerContainer}>
            <LanguagePicker />
          </View>

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
              labelValue="Last Name"
              placeholderText={i18n.t('authentication.lastName')}
              isRequired={true}
              iconType="user"
              color="black"
              value={inUserData.lastName}
              onChangeText={(inLastName)=>{
                  setInUserData({...inUserData, lastName: inLastName})
              }}
              onFocus={()=>{ setShowDateTimePicker(false) }}
            />

            <View className="flex-row">
              <Text style={styles.dobText}>
                {i18n.t('survey.dateOfBirth.whatIsYourDateOfBirth')}
              </Text>
              <View className={`absolute bottom-1 right-0 ${dobModalVisible?"bg-gray p-1 rounded-full":""}`} >
                <EditIcon onPress={()=>setDobModalVisible(!dobModalVisible)}/>
              </View>
            </View>

            <FormInput
              editable={false}
              labelValue="DOB"
              placeholderText={`${birthMonth < 10 ? '0' : ''}${birthMonth}/${birthYear}`}
              isRequired={true}
              iconType="user"
              color="black"
              keyboardType="email-address"
              value={inUserData.dob}
              onChangeText={(dob) => {}} // logic handled in ScrollPickers
              onFocus={() => {}}
            />
            
            <Modal
              animationIn={"slideInUp"}
              animationOut={"slideOutUp"}
              animationTiming={500}
              backdropOpacity={0.5}
              isVisible={dobModalVisible}
              onBackdropPress={() => {
                  setDobModalVisible(!dobModalVisible);
              }}
              onRequestClose={() => {
                setDobModalVisible(!dobModalVisible);
              }}
              className="mx-2"
            >
              <View className="flex flex-row">
                <ScrollPicker
                    data={[...Array(12).keys()].map((monthIndex) => {
                        return {title: new Date(2021, monthIndex, 1).toLocaleString(selectedSettingsLanguage, {month: 'short'}), id: monthIndex}
                    })}
                    initialScrollIndex={(new Date()).getMonth()}
                    onViewableItemsChanged={handleViewableItemsChangedMonth}
                    itemHeight={scrollPickerItemHeight}
                    keyPrefix="month"
                    roundLeft={true}
                />
                <ScrollPicker
                  data={[...Array((new Date()).getFullYear()).keys()].map((yearIndex) => {
                      return {title: yearIndex + 1, id: yearIndex}
                  })}
                  initialScrollIndex={(new Date()).getFullYear() - 1}
                  onViewableItemsChanged={handleViewableItemsChangedYear}
                  itemHeight={scrollPickerItemHeight}
                  keyPrefix="year"
                  roundRight={true}
                />
              </View>
            </Modal>
            

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

            <FormInput
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
              onFocus={()=>{ setShowDateTimePicker(false) }}
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
              {i18n.t('authentication.alreadyHaveAnAccountSignIn')}
              <Text
                style={{ fontSize: 16, fontWeight: "bold" }}
                onPress={() => {
                  navigation.navigate("LoginScreen");
                }}
              >
                {" "}
                {i18n.t('authentication.signIn')}
              </Text>
            </Text>
          </View>

          {inUserData.isValidPassword ? null : (
            <View>
              <Text style={[styles.centerItems, styles.errTextStyle]}>
                {i18n.t('authentication.passwordsDoNotMatch')}
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
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
  dobText: {
    fontWeight: 600,
    fontSize: 18,
    marginLeft: 15
  },
  languagePickerContainer: {
    paddingLeft: 50,
    paddingRight: 50,
    margin: 8,
    zIndex: 1
  },
  formInputContainer: {
    paddingLeft: 25,
    paddingRight: 25
  },
});

export default SignupScreen;
