import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import EmailList from './components/EmailList.js'; // Ensure this path is correct
import AuthorizeNylas from './components/AuthorizeNylas.js';
import { Choice } from './components/Split.js';
import SendEmail from './components/SendEmail.js';
import "./App.css";


function App() {
  return (
    <Router>
      <Routes>
        {/* Define your routes here */}
        <Route path="/" element={<AuthorizeNylas />} />
        <Route path="/choice" element={<Choice />} />
        <Route path="/emails" element={<EmailList />} />
        <Route path="/send" element={<SendEmail />} />
        {/* Redirect to /emails after successful authentication, if needed */}
        <Route path="/auth/callback" element={<Navigate to="/choice" replace />} />
        {/* You can add more routes here as needed */}
      </Routes>
    </Router>
  );
}

export default App;

