import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UploadPage from './pages/UploadPage';
import EditPage from './pages/EditPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<UploadPage />} />
                <Route path="/edit" element={<EditPage />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;
