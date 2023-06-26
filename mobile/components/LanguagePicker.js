import { View, StyleSheet, Image } from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import DropDownPicker from "react-native-dropdown-picker";
import { SettingsContext } from '../navigation/SettingsProvider';

const languages = [
  { label: "English", value: "English" },
  { label: "Kannada", value: "Kannada" },
  // { label: "Vietnamese", value: "Vietnamese" },
  { label: "Hindi", value: "Hindi" },
];

const LanguagePicker = () => {
  const { setLanguage, getLanguage } = useContext(SettingsContext);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  // translate language to short form stored in AsyncStorage (e.g., "English" --> "en")
  const langLongToShort = (longLang) => {
    let settingsLang = undefined;
    switch (longLang) {
      case "English":
        settingsLang = "en";
        break;
      case "Kannada":
        settingsLang = "kn";
        break;
      case "Hindi":
        settingsLang = "hi";
        break;
      default:
        throw new TypeError(`Language ${longLang} not supported`);
    }

    return settingsLang;
  }

  const langShortToLong = (shortLang) => {
    let settingsLang = undefined;
    switch (shortLang) {
      case "en":
        settingsLang = "English";
        break;
      case "kn":
        settingsLang = "Kannada";
        break;
      case "hi":
        settingsLang = "Hindi";
        break;
      default:
        throw new TypeError(`Language ${shortLang} not supported`);
    }

    return settingsLang;
  }

  useEffect(() => {
    // can't directly pass an async function to useEffect() https://devtrium.com/posts/async-functions-useeffect
    const getLanguageWrapper = async () => {
        let language = await getLanguage();
        return langShortToLong(language);
    }
    
    getLanguageWrapper().then((language) => {
      setSelectedLanguage(language);
    }).catch((error) => {
      console.log(`[LanguagePicker] getLanguageWrapper() failed: ${error}`);
    });
  }, []);

  const setLanguageFromDropdownSelection = (language) => {
    setLanguage(langLongToShort(language));
  }

  return (
    <View style={styles.rowLayout}>
      <Image
        source={require("../../mobile/assets/language.png")}
        style={styles.languageLogo}
      />
      <DropDownPicker
        ArrowDownIconComponent={() => <Image
          source={require("../../mobile/assets/arrow_drop_down.png")}
        />}
        ArrowUpIconComponent={() => <Image
          source={require("../../mobile/assets/arrow_up.png")}
        />}
        textStyle={styles.dropDownPickerText}
        style={styles.pickerStyle}
        dropDownContainerStyle={styles.dropDownStyle}
        selectedItemContainerStyle={styles.selectedItemContainer}
        selectedItemLabelStyle={styles.selectedItemLabel}
        listItemLabelStyle={styles.listItemLabel}
        items={languages}
        showTickIcon={false}
        open={isOpen}
        setOpen={() => setIsOpen(!isOpen)}
        value={selectedLanguage}
        setValue={setSelectedLanguage}
        onChangeValue={setLanguageFromDropdownSelection}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  rowLayout: {
    flexDirection: "row",
  },
  languageLogo: {
    marginTop: 20,
    marginLeft: 20,
    width: "10%",
    zIndex: 1,
    position: "absolute",
  },
  pickerStyle: {
    height: 70,
    borderColor: "#EDEEE0",
    backgroundColor: "#EDEEE0",
    borderRadius: 50,
    paddingLeft: 35,
  },
  dropDownPickerText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: 700,
    color: "#00394E",
  },
  dropDownStyle: {
    marginTop: 20,
    borderColor: "#EDEEE0",
    backgroundColor: "#EDEEE0",
    borderRadius: 30,
    paddingBottom: 22
  },
  selectedItemContainer: {
    backgroundColor: "#005C6A",
  },
  selectedItemLabel: {
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
  },
  listItemLabel: {
    color: "#00394E",
    fontSize: 16,
    fontWeight: 700,
    textAlign: "center",
  },
})

export default LanguagePicker;