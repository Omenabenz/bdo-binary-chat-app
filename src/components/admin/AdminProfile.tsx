import  React, { useState } from 'react';
import { LogOut, Camera } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AdminProfile() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState(() => {
    const saved = localStorage.getItem('adminProfile');
    return saved ? JSON.parse(saved) : {
      managerName: 'John Smith',
      companyName: 'BDO Binary Trading',
      profilePhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face',
      darkMode: false,
      notifications: true
    };
  });

  const saveAdminData = () => {
    localStorage.setItem('adminProfile', JSON.stringify(adminData));
    alert('Profile updated successfully!');
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const photoUrl = e.target?.result as string;
        setAdminData({ ...adminData, profilePhoto: photoUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin-login');
  };

  return (
    <div className={`min-h-screen ${adminData.darkMode ? 'bg-gray-900 text-white' : 'bg-white'} p-4 pb-20`}>
      <div className="bg-blue-600 text-white p-6 rounded-lg text-center mb-6">
        <div className="relative inline-block">
          <img
            src={adminData.profilePhoto}
            className="w-20 h-20 rounded-full mx-auto mb-4"
            alt="Admin"
          />
          <button
            onClick={() => document.getElementById('admin-photo-upload')?.click()}
            className="absolute bottom-4 right-0 bg-white text-blue-600 p-2 rounded-full"
          >
            <Camera size={16} />
          </button>
          <input
            id="admin-photo-upload"
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />
        </div>
        <h2 className="text-xl font-semibold">{adminData.managerName}</h2>
        <p className="text-sm opacity-75">{adminData.companyName}</p>
      </div>

      <div className="space-y-6 mb-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Public Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Manager Name</label>
              <input
                type="text"
                value={adminData.managerName}
                onChange={(e) => setAdminData({...adminData, managerName: e.target.value})}
                className={`w-full p-3 border rounded-lg ${adminData.darkMode ? 'bg-gray-800 border-gray-600' : ''}`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Company Name</label>
              <input
                type="text"
                value={adminData.companyName}
                onChange={(e) => setAdminData({...adminData, companyName: e.target.value})}
                className={`w-full p-3 border rounded-lg ${adminData.darkMode ? 'bg-gray-800 border-gray-600' : ''}`}
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">System Settings</h3>
          <div className="space-y-4">
            <div className={`${adminData.darkMode ? 'bg-gray-800' : 'bg-gray-50'} p-4 rounded-lg flex justify-between items-center`}>
              <span>Dark Mode</span>
              <button
                onClick={() => setAdminData({...adminData, darkMode: !adminData.darkMode})}
                className={`w-12 h-6 rounded-full ${adminData.darkMode ? 'bg-blue-600' : 'bg-gray-300'} relative`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                  adminData.darkMode ? 'translate-x-6' : 'translate-x-0.5'
                }`}></div>
              </button>
            </div>

            <div className={`${adminData.darkMode ? 'bg-gray-800' : 'bg-gray-50'} p-4 rounded-lg flex justify-between items-center`}>
              <span>Notifications</span>
              <button
                onClick={() => setAdminData({...adminData, notifications: !adminData.notifications})}
                className={`w-12 h-6 rounded-full ${adminData.notifications ? 'bg-blue-600' : 'bg-gray-300'} relative`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                  adminData.notifications ? 'translate-x-6' : 'translate-x-0.5'
                }`}></div>
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={saveAdminData}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold"
        >
          Save Changes
        </button>

        <button
          onClick={handleLogout}
          className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
 