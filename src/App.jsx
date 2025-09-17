
import React from "react";
import AllRoutes from "./components/routes/AllRoutes";
import { PlayerProvider } from "./context/PlayerContext";
import { ThemeProvider } from "./context/ThemeContext";
import './utils/storageCleanup';


const App = () => {
    return (
        <ThemeProvider>
            <PlayerProvider>
                <AllRoutes />
            </PlayerProvider>
        </ThemeProvider>
    );
};

export default App;