import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UploadPage from '@/pages/UploadPage';
import EditPage from '@/pages/EditPage';

const basename = import.meta.env.BASE_URL;

function App() {
    return (
        <Router basename={basename}>
            <Routes>
                <Route path="/" element={<UploadPage />} />
                <Route path="/edit" element={<EditPage />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;
