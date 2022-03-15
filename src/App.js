import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Components
import EthersProvider from './store/EthersProvider';
import MessageNet from './store/MessageNet';
import HomePage from './components/pages/Home/Home';

// Styles
import './styles/main.scss';

function App() {
    return (
        <MessageNet>
            <EthersProvider askOnLoad={false}>
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
