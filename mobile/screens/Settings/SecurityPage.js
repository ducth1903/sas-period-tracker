import { useState, useContext, useEffect } from 'react';
import { Text, View, SafeAreaView, TouchableOpacity, TouchableHighlight } from 'react-native';

import Modal from 'react-native-modal';
import Toast from 'react-native-toast-message';

import { AuthContext } from '../../navigation/AuthProvider';
import { SettingsContext } from '../../navigation/SettingsProvider';
import i18n from '../../translations/i18n';
import FormInput from '../../components/FormInput';

export default SecurityPage = () => {
    const { authError, setAuthError } = useContext(AuthContext);
    const { selectedSettingsLanguage } = useContext(SettingsContext);
    const [passwordModalVisible, setPasswordModalVisible] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    useEffect(() => {
        setAuthError("");
    }, [])

    const handlePressSaveChanges = async () => {
        try {
            if (newPassword !== confirmNewPassword) {
                setAuthError(i18n.t('authentication.passwordsDoNotMatch'))
                throw new Error("Passwords do not match")
            }
            else if (newPassword.length < 6) {
                setAuthError(i18n.t('authentication.weakPassword'))
                throw new Error("Weak Password")
            }
        
            // changePassword(currentPassword, newPassword)

            setPasswordModalVisible(false);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
            Toast.show({
                type: 'success',
                text1: i18n.t('settings.accountInfo.changesSavedSuccessfully')
            });
        }
        catch (error) {
            console.log(`[SecurityPage] handlePressSaveChanges error: ${error}`);
            Toast.show({
                type: 'error',
                text1: i18n.t('settings.accountInfo.errorSavingChanges')
            });
        }
    }
    
    return (
        <SafeAreaView className="flex-1 bg-[#FEFFF4]">
            <View className="p-9 items-center h-screen">
                {/* <TouchableOpacity
                    className="rounded-full bg-dullwhite w-full p-6 my-2"
                    onPress={() => setPasswordModalVisible(true)}
                >
                    <Text className="text-center">
                        {i18n.t('settings.security.editPassword')}
                    </Text>
                </TouchableOpacity> */}
                <TouchableOpacity
                    className="rounded-full border-2 border-salmon w-full p-6 my-2"
                >
                    <Text className="text-center text-salmon ">{i18n.t('settings.security.deleteAccount')}</Text>
                </TouchableOpacity>
            </View>

            {/* Update Password Modal */}
            <Modal
                animationIn={"slideInUp"}
                animationOut={"slideOutUp"}
                animationTiming={500}
                backdropOpacity={0.5}
                isVisible={passwordModalVisible}
                onBackdropPress={() => {
                    setPasswordModalVisible(!passwordModalVisible);
                }}
                onRequestClose={() => {
                    setPasswordModalVisible(!passwordModalVisible);
                }}
                className="mx-2"
            >
                <View className="bg-offwhite rounded-[20px] border-[3px] border-seafoam mx-6 py-4 px-6">
                    {/* recent period start date scroll pickers */}
                    <Text className="text-greydark text-[18px] font-bold my-2">
                        {i18n.t("settings.security.currentPassword")}
                    </Text>
                    <FormInput
                        labelValue="Current Password"
                        placeholderText={i18n.t("settings.security.currentPassword")}
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                        secureTextEntry={true}
                    />
                    <Text className="text-greydark text-[18px] font-bold my-2">
                        {i18n.t("settings.security.newPassword")}
                    </Text>
                    <FormInput
                        labelValue="New Password"
                        placeholderText={i18n.t("settings.security.newPassword")}
                        value={newPassword}
                        onChangeText={setNewPassword}
                        secureTextEntry={true}
                    />
                    <Text className="text-greydark text-[18px] font-bold my-2">
                        {i18n.t("settings.security.newPasswordAgain")}
                    </Text>
                    <FormInput
                        labelValue="Confirm New Password"
                        placeholderText={i18n.t("settings.security.newPasswordAgain")}
                        value={confirmNewPassword}
                        onChangeText={setConfirmNewPassword}
                        secureTextEntry={true}
                    />

                    {authError ? (
                    <View>
                        <Text className="text-red-600 text-[14px]">
                        {typeof authError === "object"
                            ? JSON.stringify(authError)
                            : authError}
                        </Text>
                    </View>
                    ) :
                    null}                   

                    <TouchableHighlight
                        className="flex rounded-[50px] items-center justify-center bg-turquoise px-3 py-3 mt-4"
                        onPress={() => {
                            handlePressSaveChanges();
                        }}
                        underlayColor="#5B9F8F"
                    >
                        <View className="flex-row items-center">
                            <Text className="text-offwhite text-[22px] font-bold py-1">
                                {i18n.t('settings.security.saveChanges')}
                            </Text>
                        </View>
                    </TouchableHighlight>
                </View>
            </Modal>
        </SafeAreaView>
    );
}