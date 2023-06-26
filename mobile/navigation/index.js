import React from 'react';
import Routes from './Routes';
import { AuthProvider } from './AuthProvider';
import { SettingsProvider } from './SettingsProvider';

const Providers = () => {
    return (
        <SettingsProvider>
            <AuthProvider>
                <Routes/>
            </AuthProvider>
        </SettingsProvider> 
    )
}

export default Providers;