import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-gray-900 min-h-screen p-8 flex flex-col items-center">
            <h1 className="text-5xl font-extrabold text-white mb-12 text-center">
                Admin Dashboard
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl">
                <button
                    onClick={() => navigate('/admin/subjects')}
                    className="p-8 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg shadow-2xl hover:from-blue-600 hover:to-blue-800 transform hover:scale-105 transition-all duration-300"
                >
                    <h2 className="text-2xl font-semibold">Add New Subject</h2>
                </button>
                <button
                    onClick={() => navigate('/admin/addFaculty')}
                    className="p-8 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-lg shadow-2xl hover:from-purple-600 hover:to-purple-800 transform hover:scale-105 transition-all duration-300"
                >
                    <h2 className="text-2xl font-semibold">Add Faculty</h2>
                </button>
                <button
                    onClick={() => navigate('/admin/students')}
                    className="p-8 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg shadow-2xl hover:from-green-600 hover:to-green-800 transform hover:scale-105 transition-all duration-300"
                >
                    <h2 className="text-2xl font-semibold">All Students</h2>
                </button>
                <button
                    onClick={() => navigate('/admin/allsubjects')}
                    className="p-8 bg-gradient-to-r from-red-500 to-red-700 text-white rounded-lg shadow-2xl hover:from-red-600 hover:to-red-800 transform hover:scale-105 transition-all duration-300"
                >
                    <h2 className="text-2xl font-semibold">All Subjects</h2>
                </button>
                <button
                    onClick={() => navigate('/admin/allFaculty')}
                    className="p-8 bg-gradient-to-r from-yellow-500 to-yellow-700 text-white rounded-lg shadow-2xl hover:from-yellow-600 hover:to-yellow-800 transform hover:scale-105 transition-all duration-300"
                >
                    <h2 className="text-2xl font-semibold">All Faculty</h2>
                </button>
            </div>
        </div>
    );
};

export default AdminDashboard;
