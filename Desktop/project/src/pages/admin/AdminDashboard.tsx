import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <button
                    onClick={() => navigate('/admin/subjects')}
                    className="p-4 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
                >
                    Add new Subject
                </button>
                <button
                    onClick={() => navigate('/admin/students')}
                    className="p-4 bg-green-500 text-white rounded shadow hover:bg-green-600"
                >
                    All Students
                </button>
                <button
                    onClick={() => navigate('/admin/payments')}
                    className="p-4 bg-yellow-500 text-white rounded shadow hover:bg-yellow-600"
                >
                    Manage Subjects
                </button>
                <button
                    onClick={() => navigate('/admin/grades')}
                    className="p-4 bg-red-500 text-white rounded shadow hover:bg-red-600"
                >
                    Add Grades
                </button>
            </div>
        </div>
    );
};

export default AdminDashboard;
