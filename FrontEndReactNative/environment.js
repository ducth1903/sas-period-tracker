import Constants from "expo-constants";
// import { Platform } from "react-native";
import { LOCAL_DEV_IP, STAGING_IP } from '@env';

// const localhost = Platform.OS === "ios" ? "localhost:8080" : "10.0.2.2:8080";

const ENV = {
    dev: {
        API_URL: LOCAL_DEV_IP,
    },
    staging: {
        API_URL: STAGING_IP,
        // Add other keys you want here
    },
    prod: {
        API_URL: STAGING_IP,
        // Add other keys you want here
    }
};

const getEnvVars = (env = Constants.manifest.releaseChannel) => {
    // What is __DEV__ ?
    // This variable is set to true when react-native is running in Dev mode.
    // __DEV__ is true when run locally, but false when published.
    if (__DEV__) {
        return ENV.dev;
    } else if (env === 'staging-v1') {
        // i.e. run the app via Apple TestFlight or an Android testing track
        return ENV.staging;
    } else if (env === 'prod') {
        return ENV.prod;
    }
};

export default getEnvVars;