import { contributors } from "../../components/ContributorsData";
import { Text, View, SafeAreaView, ScrollView } from 'react-native';

export default Contributors = () => {
    return (<SafeAreaView className="flex-1 bg-[#FEFFF4]">
    <ScrollView>
        <View className="p-9">
            {/* <Text className="font-light text-base">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </Text> */}
            <View className="items-center my-10">
                <Text className="text-xl font-semibold">
                    Fiona J. Almeida
                </Text>
                <Text className="p-1 font-light">
                    Founder of Small Acts for Sustainability
                </Text>
            </View>
        {contributorsComponent()}
        </View>
    </ScrollView>
    </SafeAreaView>);
}

const contributorsComponent = () => {
    let retComponent = [];
    for(const content of contributors){
        const {title, contributors} = content;
        retComponent.push(
            <View className="items-center mb-10">
                <Text className="text-xl font-semibold my-1">{title}</Text>
                {
                    getPerson(contributors)
                }
            </View>
        )
    }
    return retComponent;
}

const getPerson = (contributors) => {
    let ret = [];
    for(const person of contributors){
        ret.push(
        <View className="items-center my-1.5">
            <Text className="font-semibold">{person.name}</Text>
            {(person.role)?<Text className="font-light">{person.role}</Text>:<></>}
            {(person.org)?<Text className="font-light">{person.org}</Text>:<></>}
        </View>);
    }
    return ret;
}