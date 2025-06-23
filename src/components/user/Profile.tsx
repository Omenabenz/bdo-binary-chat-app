import  React, { useState } from 'react';
import { ArrowLeft, Camera, CreditCard, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);
  const [showLinkedAccount, setShowLinkedAccount] = useState(false);
  const [profileData, setProfileData] = useState({
    profilePhoto: user?.profilePhoto || '',
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });
  const [linkedAccount, setLinkedAccount] = useState(() => {
    const saved = localStorage.getItem(`linkedAccount_${user?.id}`);
    return saved ? JSON.parse(saved) : { bank: '', accountNumber: '', accountName: '' };
  });

  const handleProfileUpdate = () => {
    updateUser(profileData);
    alert('Profile updated successfully!');
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const photoUrl = e.target?.result as string;
        setProfileData({ ...profileData, profilePhoto: photoUrl });
        updateUser({ profilePhoto: photoUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLinkedAccountSave = () => {
    localStorage.setItem(`linkedAccount_${user?.id}`, JSON.stringify(linkedAccount));
    setShowLinkedAccount(false);
    alert('Linked account saved successfully!');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (showLinkedAccount) {
    return (
      <div className={`min-h-screen ${user?.darkMode ? 'bg-gray-900 text-white' : 'bg-white'} p-4 pb-20`}>
        <div className="flex items-center mb-6">
          <ArrowLeft size={24} onClick={() => setShowLinkedAccount(false)} className="cursor-pointer" />
          <h1 className="text-xl font-semibold ml-4">Linked Account</h1>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Bank/Wallet</label>
            <select
              value={linkedAccount.bank}
              onChange={(e) => setLinkedAccount({...linkedAccount, bank: e.target.value})}
              className={`w-full p-3 border rounded-lg ${user?.darkMode ? 'bg-gray-800 border-gray-600' : ''}`}
            >
              <option value="">Select bank/wallet</option>
              <option value="BDO">BDO</option>
              <option value="BPI">BPI</option>
              <option value="GCash">GCash</option>
              <option value="PayMaya">PayMaya</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Account Number</label>
            <input
              type="text"
              value={linkedAccount.accountNumber}
              onChange={(e) => setLinkedAccount({...linkedAccount, accountNumber: e.target.value})}
              className={`w-full p-3 border rounded-lg ${user?.darkMode ? 'bg-gray-800 border-gray-600' : ''}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Account Name</label>
            <input
              type="text"
              value={linkedAccount.accountName}
              onChange={(e) => setLinkedAccount({...linkedAccount, accountName: e.target.value})}
              className={`w-full p-3 border rounded-lg ${user?.darkMode ? 'bg-gray-800 border-gray-600' : ''}`}
            />
          </div>

          <button
            onClick={handleLinkedAccountSave}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold"
          >
            Save Linked Account
          </button>
        </div>
      </div>
    );
  }

  if (showSettings) {
    return (
      <div className={`min-h-screen ${user?.darkMode ? 'bg-gray-900 text-white' : 'bg-white'} p-4 pb-20`}>
        <div className="flex items-center mb-6">
          <ArrowLeft size={24} onClick={() => setShowSettings(false)} className="cursor-pointer" />
          <h1 className="text-xl font-semibold ml-4">Settings</h1>
        </div>

        <div className="space-y-4">
          <div className={`${user?.darkMode ? 'bg-gray-800' : 'bg-gray-50'} p-4 rounded-lg flex justify-between items-center`}>
            <span>Notifications</span>
            <button
              onClick={() => updateUser({ notifications: !user?.notifications })}
              className={`w-12 h-6 rounded-full ${user?.notifications ? 'bg-blue-600' : 'bg-gray-300'} relative`}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                user?.notifications ? 'translate-x-6' : 'translate-x-0.5'
              }`}></div>
            </button>
          </div>

          <div className={`${user?.darkMode ? 'bg-gray-800' : 'bg-gray-50'} p-4 rounded-lg flex justify-between items-center`}>
            <span>Dark Mode</span>
            <button
              onClick={() => updateUser({ darkMode: !user?.darkMode })}
              className={`w-12 h-6 rounded-full ${user?.darkMode ? 'bg-blue-600' : 'bg-gray-300'} relative`}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                user?.darkMode ? 'translate-x-6' : 'translate-x-0.5'
              }`}></div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${user?.darkMode ? 'bg-gray-900 text-white' : 'bg-white'} p-4 pb-20`}>
      <div className="bg-blue-600 text-white p-6 rounded-lg text-center mb-6">
        <div className="relative inline-block">
          <img
            src={profileData.profilePhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&crop=face'}
            className="w-20 h-20 rounded-full mx-auto mb-4"
            alt={user?.fullName}
          />
          <button
            onClick={() => document.getElementById('photo-upload')?.click()}
            className="absolute bottom-4 right-0 bg-white text-blue-600 p-2 rounded-full"
          >
            <Camera size={16} />
          </button>
          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />
        </div>
        <h2 className="text-xl font-semibold">{user?.fullName}</h2>
        <p className="text-sm opacity-75">{user?.tradingId}</p>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">Full Name</label>
          <input
            type="text"
            value={profileData.fullName}
            onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
            className={`w-full p-3 border rounded-lg ${user?.darkMode ? 'bg-gray-800 border-gray-600' : ''}`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            value={profileData.email}
            onChange={(e) => setProfileData({...profileData, email: e.target.value})}
            className={`w-full p-3 border rounded-lg ${user?.darkMode ? 'bg-gray-800 border-gray-600' : ''}`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Phone</label>
          <input
            type="tel"
            value={profileData.phone}
            onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
            className={`w-full p-3 border rounded-lg ${user?.darkMode ? 'bg-gray-800 border-gray-600' : ''}`}
          />
        </div>

        <button
          onClick={handleProfileUpdate}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold"
        >
          Update Profile
        </button>
      </div>

      <div className="space-y-3">
        <div className={`${user?.darkMode ? 'bg-gray-800' : 'bg-gray-50'} p-4 rounded-lg flex items-center justify-between cursor-pointer`}
             onClick={setShowLinkedAccount.bind(null, true)}>
          <div className="flex items-center space-x-3">
            <CreditCard size={20} />
            <span>Linked Account</span>
          </div>
          <span className="text-gray-400">›</span>
        </div>

        <div className={`${user?.darkMode ? 'bg-gray-800' : 'bg-gray-50'} p-4 rounded-lg flex items-center justify-between cursor-pointer`}
             onClick={() => navigate('/dashboard/wallet')}>
          <div className="flex items-center space-x-3">
            <CreditCard size={20} />
            <span>Wallet</span>
          </div>
          <span className="text-gray-400">›</span>
        </div>

        <div className={`${user?.darkMode ? 'bg-gray-800' : 'bg-gray-50'} p-4 rounded-lg flex items-center justify-between cursor-pointer`}
             onClick={setShowSettings.bind(null, true)}>
          <div className="flex items-center space-x-3">
            <Settings size={20} />
            <span>Settings</span>
          </div>
          <span className="text-gray-400">›</span>
        </div>

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
 