import { View, Text } from 'react-native';
import { useContext } from 'react';
import { SettingsContext } from '../navigation/SettingsProvider';
import i18n from '../translations/i18n';

const StaticNote = ({ date, data }) => {
    const weekDays = [i18n.t('days.long.sunday'), i18n.t('days.long.monday'), i18n.t('days.long.tuesday'), i18n.t('days.long.wednesday'), i18n.t('days.long.thursday'), i18n.t('days.long.friday'), i18n.t('days.long.saturday')];
    const { selectedSettingsLanguage } = useContext(SettingsContext);

    // TODO: make async and actually fetch
    function fetchNoteForDate(date) {
        return "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit";
    }

    return (
        <View>
            <Text className="text-[18px] text-greydark font-bold mt-4">
                {`${weekDays[date.getDay()]}, ${date.toLocaleString(selectedSettingsLanguage, { month: 'long' })} ${date.getDate()}`}
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
