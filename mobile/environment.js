// import Constants from "expo-constants";
import { ENV_API_URL } from '@env';

// const ENV = {
//     dev: {
//         API_URL: LOCAL_DEV_IP,
//     },
//     staging: {
//         API_URL: STAGING_IP,
//         // Add other keys you want here
//     },
//     prod: {
//         API_URL: STAGING_IP,
//         // Add other keys you want here
//     }
// };

// const getEnvVars = (env = Constants.manifest.releaseChannel) => {
//     // What is __DEV__ ?
//     // This variable is set to true when react-native is running in Dev mode.
//     // __DEV__ is true when run locally, but false when published.
//     if (__DEV__) {
//         return ENV.dev;
//     } else if (env === 'staging-v1') {
//         // i.e. run the app via Apple TestFlight or an Android testing track
//         return ENV.staging;
//     } else if (env === 'prod') {
//         return ENV.prod;
//     }
// };

const getEnvVars = () => {
    return { API_URL: ENV_API_URL };
}

export default getEnvVars;