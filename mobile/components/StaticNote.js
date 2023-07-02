import { View, Text } from 'react-native';

const StaticNote = ({ date, data }) => {
    const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // TODO: make async and actually fetch
    function fetchNoteForDate(date) {
        return "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit";
    }

    return (
        <View>
            <Text className="text-[18px] text-greydark font-bold mt-4">
                {`${weekDays[date.getDay()]}, ${date.toLocaleString('default', { month: 'long' })} ${date.getDate()}`}
            </Text>
            <View className="items-center justify-center border-2 min-h-[112px] border-turquoise rounded-xl mt-1.5 px-4 py-8">
                <Text className="text-teal">
                    {fetchNoteForDate()}
                </Text>
            </View>
        </View>
    );
}

export default StaticNote;
