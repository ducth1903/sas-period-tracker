import React from "react";
import Routes from "./Routes";
import { AuthProvider } from "./AuthProvider";
import { SettingsProvider } from "./SettingsProvider";
import { ResourceProvider } from "./ResourcesProvider";

const Providers = () => {
  return (
    <SettingsProvider>
      <AuthProvider>
        <ResourceProvider>
          <Routes />
        </ResourceProvider>
      </AuthProvider>
    </SettingsProvider>
  );
};

export default Providers;
