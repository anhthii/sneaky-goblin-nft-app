import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GoogleFontLoader from 'react-google-font-loader';

// Components
import EthersProvider from './store/EthersProvider';
import MessageNet from './store/MessageNet';
import HomePage from './components/pages/Home/Home';

// Styles & Fonts
import fontLists from './data/fonts/google/fontList';
import './styles/main.scss';

function App() {
    return (
        <MessageNet>
            <EthersProvider askOnLoad={false}>
                <GoogleFontLoader fonts={fontLists} />

                <Router>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                    </Routes>
                </Router>
            </EthersProvider>
        </MessageNet>
    );
}

export default App;
