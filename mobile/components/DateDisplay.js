import React from "react";
import { Text, View } from 'react-native';

const dateArr = (t, a = [{day: 'numeric'}, {month: 'short'}, {year: 'numeric'}]) => {
    function format(m) {
       let f = new Intl.DateTimeFormat('en', m);
       return f.format(t);
    }
    return a.map(format);
}
let s = dateArr(new Date);

export default DateDisplay = () => {
    return (
    <View>
        <View className="flex flex-row justify-around bg-offwhite py-2 opacity-20">
            <Text className="text-base font-semibold min-w-[50px]"></Text>
            <Text className="text-base font-semibold min-w-[50px]"></Text>
            <Text className="text-base font-semibold min-w-[50px]">1999</Text>
        </View>
        <View className="flex flex-row justify-around bg-dullwhite py-2">
            <Text className="text-base font-semibold min-w-[50px]">01</Text>
            <Text className="text-base font-semibold min-w-[50px]">Jan</Text>
            <Text className="text-base font-semibold min-w-[50px]">2000</Text>
        </View>
        <View className="flex flex-row justify-around bg-offwhite py-2 opacity-20">
            <Text className="text-base font-semibold min-w-[50px]"></Text>
            <Text className="text-base font-semibold min-w-[50px]">Feb</Text>
            <Text className="text-base font-semibold min-w-[50px]">2001</Text>
        </View>
    </View>);
}