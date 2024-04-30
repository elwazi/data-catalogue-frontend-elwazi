import React from "react";
import ReactDOM from "react-dom/client";
import {App} from "./App";
import ReactGA from "react-ga4";
import {DC_GA_MEASUREMENT_ID} from "./constants";

ReactGA.initialize(DC_GA_MEASUREMENT_ID);

ReactDOM.createRoot(document.getElementById("root")!)
    .render(
        <React.StrictMode>
            <App/>
        </React.StrictMode>
    );
