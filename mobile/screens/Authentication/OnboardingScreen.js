import React from 'react';
import { Image} from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';

function OnboardingScreen ({ navigation }) {
    return(
        <Onboarding
        onSkip={() => navigation.replace("LandingScreen")}
        onDone={() => navigation.replace("LandingScreen")}
        pages={[
            {
            backgroundColor: '#a6e4d0',
            image: <Image source={require('../../assets/onboarding-img1.png')} />,
            title: 'Stay healthy with your cycle',
            subtitle: '',
            },
            {
                backgroundColor: '#fdeb93',
                image: <Image source={require('../../assets/onboarding-img2.png')} />,
                title: 'Reminder of upcoming period',
                subtitle: '',
            },
            {
                backgroundColor: '#e9bcbe',
                image: <Image source={require('../../assets/onboarding-img3.png')} />,
                title: 'Daily exercises and advices',
                subtitle: '',
            },
        ]}
        />
    )
}

export default OnboardingScreen;