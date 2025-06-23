import  React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

export default function NotificationPopup() {
  const { user } = useAuth();
  const { notifications } = useApp();
  const [showPopup, setShowPopup] = useState(false);
  const [currentNotification, setCurrentNotification] = useState<any>(null);

  useEffect(() => {
    if (!user?.notifications) return;

    const unreadNotifications = notifications.filter(n => 
      n.userId === user?.id && !n.read
    );

    if (unreadNotifications.length > 0) {
      const latestNotification = unreadNotifications[unreadNotifications.length - 1];
      setCurrentNotification(latestNotification);
      setShowPopup(true);

      setTimeout(() => {
        setShowPopup(false);
      }, 5000);
    }
  }, [notifications, user]);

  if (!showPopup || !currentNotification) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-50">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm mx-auto">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <span className="font-semibold text-sm">{currentNotification.title}</span>
          </div>
          <button onClick={() => setShowPopup(false)}>
            <X size={16} className="text-gray-400" />
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-1">{currentNotification.message}</p>
      </div>
    </div>
  );
}
 