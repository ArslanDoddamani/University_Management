import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/student/Dashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Subjects from './pages/admin/subjects';
import Students from './pages/admin/students';
import Allsubjects from './pages/admin/Allsubjects';
import FacultyLogin from './pages/FacultyLogin';
import AddFaculty from './pages/admin/addFaculty';
import FacultyDashboard from './pages/FacultyDashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/login" element={<Login />} />
          <Route path="/Facultylogin" element={<FacultyLogin />} />
          <Route path="/Faculty/dashboard" element={<FacultyDashboard/>} />
          <Route path="/register" element={<Register />} />
          <Route path="/adminlogin" element={<AdminLogin/>} />
          <Route path="/admin/subjects" element={<Subjects/>}></Route>
          <Route path="/admin/students" element={<Students/>}></Route>
          <Route path="/admin/allsubjects" element={<Allsubjects/>}></Route>
          <Route path="/admin/addFaculty" element={<AddFaculty/>}></Route>
          
          
          {/* Student Routes */}
          <Route path="/student/*" element={
            <ProtectedRoute role="student">
              <StudentDashboard />
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin/*" element={
              <AdminDashboard />
          } />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;