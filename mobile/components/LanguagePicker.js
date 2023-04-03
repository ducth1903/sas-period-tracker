import { View, StyleSheet, Image } from 'react-native';
import React, { useState } from 'react';
import DropDownPicker from "react-native-dropdown-picker";

const languages = [
    { label: "English", value: "English" },
    { label: "Kannada", value: "Kannada" },
    { label: "Vietnamese", value: "Vietnamese" },
    { label: "Hindi", value: "Hindi" },
  ];

const LanguagePicker = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState("English");

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