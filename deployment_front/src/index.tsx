import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import GlobalStyles from "./global.styles";

import { Provider } from "react-redux";
// import store, { persistor } from "./store";
import store, { persistor } from "./store";
import { PersistGate } from "redux-persist/integration/react";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Provider store={store}>
    <PersistGate persistor={persistor} loading={null}>
      <React.StrictMode>
        <GlobalStyles />
        <App />
      </React.StrictMode>
    </PersistGate>
  </Provider>
);
