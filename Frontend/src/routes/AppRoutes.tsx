import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/common/Layout';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Courses from '../pages/Courses';
import Marks from '../pages/Marks';
import Fees from '../pages/Fees';
import Admin from '../pages/Admin';
import AllStudents from '../pages/AllStudents';
import AllFaculty from '../pages/AllFaculty';
import AdminRoute from '../components/common/AdminRoute';
import ProtectedRoute from '../components/common/ProtectedRoute';

const AppRoutes: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
  <Route path="/marks" element={<ProtectedRoute><Marks /></ProtectedRoute>} />
  <Route path="/fees" element={<ProtectedRoute><Fees /></ProtectedRoute>} />
  <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
  <Route path="/all-students" element={<AdminRoute><AllStudents /></AdminRoute>} />
  <Route path="/all-faculty" element={<AdminRoute><AllFaculty /></AdminRoute>} />
  <Route path="/all-students" element={<AdminRoute><AllStudents /></AdminRoute>} />
  <Route path="/all-faculty" element={<AdminRoute><AllFaculty /></AdminRoute>} />
      </Routes>
    </Layout>
  );
};

export default AppRoutes;