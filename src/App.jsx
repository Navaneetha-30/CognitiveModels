import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LearnerProvider } from './context/LearnerContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import DashboardLayout from './components/DashboardLayout';

// Pages
import Login from './pages/Login';
import Assistant from './pages/Assistant';
import Overview from './pages/Overview';
import TrainingCenter from './pages/TrainingCenter';
import NeuralRoadmap from './pages/NeuralRoadmap';
import Analytics from './pages/Analytics';
import RLPlayground from './pages/RLPlayground';
import Simulator from './pages/Simulator';

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Login */}
      <Route path="/" element={!isAuthenticated ? <Login /> : <DashboardLayout><Assistant /></DashboardLayout>} />
      <Route path="/login" element={!isAuthenticated ? <Login /> : <DashboardLayout><Assistant /></DashboardLayout>} />

      {/* Protected Student Routes */}
      <Route path="/assistant" element={
        isAuthenticated ? (
          <DashboardLayout><Assistant /></DashboardLayout>
        ) : <Login />
      } />
      <Route path="/overview" element={
        isAuthenticated ? (
          <DashboardLayout><Overview /></DashboardLayout>
        ) : <Login />
      } />
      <Route path="/training" element={
        isAuthenticated ? (
          <DashboardLayout><TrainingCenter /></DashboardLayout>
        ) : <Login />
      } />
      <Route path="/roadmap" element={
        isAuthenticated ? (
          <DashboardLayout><NeuralRoadmap /></DashboardLayout>
        ) : <Login />
      } />
      <Route path="/analytics" element={
        isAuthenticated ? (
          <DashboardLayout><Analytics /></DashboardLayout>
        ) : <Login />
      } />
      <Route path="/rl-playground" element={
        isAuthenticated ? (
          <DashboardLayout><RLPlayground /></DashboardLayout>
        ) : <Login />
      } />
      <Route path="/simulator" element={
        isAuthenticated ? (
          <DashboardLayout><Simulator /></DashboardLayout>
        ) : <Login />
      } />

      {/* Fallback */}
      <Route path="*" element={!isAuthenticated ? <Login /> : <DashboardLayout><Assistant /></DashboardLayout>} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <LearnerProvider>
        <Router>
          <AppRoutes />
        </Router>
      </LearnerProvider>
    </AuthProvider>
  );
}

export default App;
