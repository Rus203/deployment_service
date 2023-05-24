import React from "react";

import { SettingsConsumer, SettingsProvider } from "./@core/context/settingsContext";
import BaseRouter from "./routes/BaseRouter";
import ThemeComponent from "./theme/ThemeComponent";

const App: React.FC = function () {
  return (
    <SettingsProvider>
      <SettingsConsumer>
        {({ settings }) => {
          return <ThemeComponent settings={settings}>{
            <BaseRouter />
          }
          </ThemeComponent>
        }}
      </SettingsConsumer>
    </SettingsProvider>
  );
};

export default App;
