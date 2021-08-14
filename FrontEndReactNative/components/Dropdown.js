// https://github.com/react-native-picker/picker#readme

import React, {useEffect, useState} from 'react';
import {Picker} from '@react-native-picker/picker';

export const Dropdown = ({inValues, ...restProps}) => {
    const [selectedLanguage, setSelectedLanguage] = useState(inValues[0]);

    useEffect(() => {
        restProps.onSelect(selectedLanguage)
    }, [selectedLanguage]);

    return (
        <Picker
        selectedValue={selectedLanguage}
        onValueChange={(itemValue, itemIndex) =>
            setSelectedLanguage(itemValue)            
        }>
            {inValues.map((ele, ele_index) => {
                return <Picker.Item key={ele_index} label={ele} value={ele}/>
            })}
        </Picker>
    );
};

export default Dropdown;