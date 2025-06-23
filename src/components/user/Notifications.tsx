import  React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

export default function Notifications() {
  const { user } = useAuth();
  const { notifications, markNotificationRead } = useApp();

  const userNotifications = notifications
    .filter(n => n.userId === user?.id)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const handleNotificationClick = (notification: any) => {
    if (!notification.read) {
      markNotificationRead(notification.id);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'balance': return '💰';
      case 'withdrawal': return '💸';
      case 'message': return '💬';
      case 'login': return '🔐';
      default: return '📢';
    }
  };

  return (
    <div className={`min-h-screen ${user?.darkMode ? 'bg-gray-900 text-white' : 'bg-white'} p-4 pb-20`}>
      <div className="bg-blue-600 text-white p-4 rounded-lg mb-6">
        <h1 className="text-xl font-semibold">Notifications</h1>
        <div className="text-sm opacity-75 mt-1">
          {userNotifications.filter(n => !n.read).length} unread notifications
        </div>
      </div>

      <div className="space-y-3">
        {userNotifications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No notifications yet
          </div>
        ) : (
          userNotifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className={`p-4 rounded-lg border cursor-pointer ${
                notification.read 
                  ? user?.darkMode ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-200'
                  : user?.darkMode ? 'bg-blue-900 border-blue-700' : 'bg-blue-50 border-blue-200'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="text-2xl">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold">{notification.title}</h3>
                    <div className="text-xs text-gray-500">
                      {new Date(notification.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
 