import React from 'react';
import { Image} from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import i18n from '../../translations/i18n';

function OnboardingScreen ({ navigation }) {
    return(
        <Onboarding
        onSkip={() => navigation.replace("LandingScreen")}
        onDone={() => navigation.replace("LandingScreen")}
        pages={[
            {
            backgroundColor: '#a6e4d0',
            image: <Image source={require('../../assets/onboarding-img1.png')} />,
            title: i18n.t('onboarding.stayHealthyWithYourCycle'),
            subtitle: '',
            },
            {
                backgroundColor: '#fdeb93',
                image: <Image source={require('../../assets/onboarding-img2.png')} />,
                title: i18n.t('onboarding.reminderOfUpcomingPeriod'),
                subtitle: '',
            },
            {
                backgroundColor: '#e9bcbe',
                image: <Image source={require('../../assets/onboarding-img3.png')} />,
                title: i18n.t('onboarding.dailyExercisesAndAdvice'),
                subtitle: '',
            },
        ]}
        />
    )
}

export default OnboardingScreen;