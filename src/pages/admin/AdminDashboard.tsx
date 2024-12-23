import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-gray-900 min-h-screen p-6">
            <h1 className="text-4xl font-extrabold text-white mb-8 text-center">
                Admin Dashboard
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <button
                    onClick={() => navigate('/admin/subjects')}
                    className="p-6 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-300"
                >
                    <h2 className="text-2xl font-semibold">Add new Subject</h2>
                </button>
                <button
                    onClick={() => navigate('/admin/students')}
                    className="p-6 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 transform hover:scale-105 transition-all duration-300"
                >
                    <h2 className="text-2xl font-semibold">All Students</h2>
                </button>
                <button
                    onClick={() => navigate('/admin/payments')}
                    className="p-6 bg-yellow-600 text-white rounded-lg shadow-lg hover:bg-yellow-700 transform hover:scale-105 transition-all duration-300"
                >
                    <h2 className="text-2xl font-semibold">Manage Payments</h2>
                </button>
                <button
                    onClick={() => navigate('/admin/grades')}
                    className="p-6 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 transform hover:scale-105 transition-all duration-300"
                >
                    <h2 className="text-2xl font-semibold">Add Grades</h2>
                </button>
            </div>
        </div>
    );
};

export default AdminDashboard;
