import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Menu, User, BookOpen, GraduationCap, CreditCard, LogOut } from 'lucide-react';
import Profile from './Profile';
import Semester from './Semester';
import Subjects from '../student/Subjects/index.jsx';
import Results from './Results';
import PaymentHistory from './PaymentHistory';

const Dashboard = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <GraduationCap className="h-8 w-8 text-indigo-600" />
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link to="" className="nav-link">
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </Link>
                <Link to="semester" className="nav-link">
                  <BookOpen className="h-5 w-5" />
                  <span>Semester</span>
                </Link>
                <Link to="subjects" className="nav-link">
                  <Menu className="h-5 w-5" />
                  <span>Subjects</span>
                </Link>
                <Link to="results" className="nav-link">
                  <GraduationCap className="h-5 w-5" />
                  <span>Results</span>
                </Link>
                
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Routes>
          <Route path="" element={<Profile />} />
          <Route path="semester" element={<Semester />} />
          <Route path="subjects" element={<Subjects />} />
          <Route path="results" element={<Results />} />
          <Route path="payments" element={<PaymentHistory />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;