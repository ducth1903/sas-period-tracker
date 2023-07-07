import { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { SettingsContext } from './SettingsProvider';
import i18n from '../translations/i18n';

import SurveyScreen from '../screens/Authentication/SurveyScreen';

const Stack = createStackNavigator();

const SurveyStack = () => {
    const { selectedSettingsLanguage } = useContext(SettingsContext);

    return (
        <Stack.Navigator>
            <Stack.Screen name={i18n.t('settings.accountInfo.survey.title')} header={() => null} component={SurveyScreen} />
        </Stack.Navigator>
    );
}

export default SurveyStack;