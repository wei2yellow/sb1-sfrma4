import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Layout from '../components/Layout';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import ServiceSchedule from '../pages/ServiceSchedule';
import Announcements from '../pages/Announcements';
import AccountManagement from '../pages/AccountManagement';
import UsageStatistics from '../pages/UsageStatistics';
import Evaluation from '../pages/Evaluation';
import NewStaffTraining from '../pages/NewStaffTraining';
import RolePermissions from '../pages/RolePermissions';
import ServiceSituations from '../pages/ServiceSituations';
import Inventory from '../pages/Inventory';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <Layout>{children}</Layout> : <Navigate to="/login" />;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />

        <Route path="/service-schedule" element={
          <PrivateRoute>
            <ServiceSchedule />
          </PrivateRoute>
        } />

        <Route path="/accounts" element={
          <PrivateRoute>
            <AccountManagement />
          </PrivateRoute>
        } />

        <Route path="/statistics" element={
          <PrivateRoute>
            <UsageStatistics />
          </PrivateRoute>
        } />

        <Route path="/evaluation" element={
          <PrivateRoute>
            <Evaluation />
          </PrivateRoute>
        } />

        <Route path="/announcements" element={
          <PrivateRoute>
            <Announcements />
          </PrivateRoute>
        } />

        <Route path="/new-staff-training" element={
          <PrivateRoute>
            <NewStaffTraining />
          </PrivateRoute>
        } />

        <Route path="/role-permissions" element={
          <PrivateRoute>
            <RolePermissions />
          </PrivateRoute>
        } />

        <Route path="/situations" element={
          <PrivateRoute>
            <ServiceSituations />
          </PrivateRoute>
        } />

        <Route path="/inventory" element={
          <PrivateRoute>
            <Inventory />
          </PrivateRoute>
        } />

        <Route path="*" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}