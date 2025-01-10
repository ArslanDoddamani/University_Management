import React, { useEffect, useState } from 'react';
import { student } from '../../services/api';
import { User } from 'lucide-react';

interface StudentProfile {
  name: string;
  usn: string;
  department: string;
  email: string;
  phone: string;
  currentSemester: number;
  dateOfBirth: string;
}

const Profile = () => {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await student.getProfile();
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div className="flex justify-center">Loading...</div>;
  }

  if (!profile) {
    return <div>Error loading profile</div>;
  }

  return (
    <div className="max-w-3xl mx-auto bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="bg-indigo-100 p-3 rounded-full">
            <User className="h-8 w-8 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoField label="USN" value={profile.usn} />
          <InfoField label="Department" value={profile.department} />
          <InfoField label="Email" value={profile.email} />
          <InfoField label="Phone" value={profile.phone} />
          <InfoField label="Current Semester" value={profile.currentSemester.toString()} />
          <InfoField label="Date of Birth" value={new Date(profile.dateOfBirth).toLocaleDateString()} />
        </div>
      </div>
    </div>
  );
};

const InfoField = ({ label, value }: { label: string; value: string }) => (
  <div>
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 text-lg text-gray-900">{value}</dd>
  </div>
);

export default Profile;