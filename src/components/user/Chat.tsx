import  React, { useState, useEffect, useRef } from 'react';
import { Send, Camera, Paperclip, Mic, Play } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Message } from '../../types';

export default function Chat() {
  const { user } = useAuth();
  const { messages, addMessage } = useApp();
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [adminTyping, setAdminTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const userMessages = messages.filter(m => 
    (m.senderId === user?.id && m.receiverId === 'admin') ||
    (m.senderId === 'admin' && m.receiverId === user?.id)
  ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  useEffect(() => {
    if (userMessages.length === 0 && user) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        senderId: 'admin',
        receiverId: user.id,
        content: 'Welcome to our company! How may we assist you?',
        type: 'text',
        timestamp: new Date(),
        read: false
      };
      addMessage(welcomeMessage);
    }
  }, [user, userMessages.length, addMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [userMessages]);

  useEffect(() => {
    const checkAdminTyping = () => {
      const adminTypingStatus = localStorage.getItem('adminTyping');
      if (adminTypingStatus && user) {
        const typingData = JSON.parse(adminTypingStatus);
        setAdminTyping(typingData.isTyping && typingData.userId === user.id);
      } else {
        setAdminTyping(false);
      }
    };

    const interval = setInterval(checkAdminTyping, 500);
    return () => clearInterval(interval);
  }, [user]);

  const handleTyping = (value: string) => {
    setNewMessage(value);
    
    if (!isTyping && value.trim() && user) {
      setIsTyping(true);
      localStorage.setItem('userTyping', JSON.stringify({
        userId: user.id,
        isTyping: true,
        timestamp: Date.now()
      }));
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      localStorage.removeItem('userTyping');
    }, 2000);
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !user) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: user.id,
      receiverId: 'admin',
      content: newMessage,
      type: 'text',
      timestamp: new Date(),
      read: false
    };

    addMessage(message);
    setNewMessage('');
  };

  const sendPhoto = (file: File) => {
    if (!user) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const message: Message = {
        id: Date.now().toString(),
        senderId: user.id,
        receiverId: 'admin',
        content: e.target?.result as string,
        type: 'photo',
        timestamp: new Date(),
        read: false
      };
      addMessage(message);
    };
    reader.readAsDataURL(file);
  };

  const sendFile = (file: File) => {
    if (!user) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const message: Message = {
        id: Date.now().toString(),
        senderId: user.id,
        receiverId: 'admin',
        content: JSON.stringify({
          name: file.name,
          size: file.size,
          type: file.type,
          data: e.target?.result as string
        }),
        type: 'file',
        timestamp: new Date(),
        read: false
      };
      addMessage(message);
    };
    reader.readAsDataURL(file);
  };

  const sendVoiceMessage = () => {
    if (!user) return;
    
    const message: Message = {
      id: Date.now().toString(),
      senderId: user.id,
      receiverId: 'admin',
      content: '🎤 Voice message',
      type: 'voice',
      timestamp: new Date(),
      read: false
    };
    addMessage(message);
  };

  const playVoiceMessage = (content: string) => {
    alert('🎤 Playing voice message: ' + content);
  };

  const downloadFile = (message: Message) => {
    try {
      const fileData = JSON.parse(message.content);
      const link = document.createElement('a');
      link.href = fileData.data;
      link.download = fileData.name;
      link.click();
    } catch (e) {
      console.error('Error downloading file:', e);
    }
  };

  return (
    <div className={`min-h-screen ${user?.darkMode ? 'bg-gray-900' : 'bg-white'} pb-20`}>
      <div className="bg-blue-600 text-white p-4 flex items-center space-x-3">
        <img
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
          className="w-10 h-10 rounded-full"
          alt="Company Manager"
        />
        <div className="flex-1">
          <div className="font-semibold flex items-center">
            Company Manager
            <span className="text-blue-300 ml-1">✓</span>
          </div>
          <div className="text-xs opacity-75">BDO Binary Trading</div>
        </div>
      </div>

      <div className="flex-1 p-4 h-screen overflow-y-auto pb-32">
        {userMessages.map((message) => (
          <div
            key={message.id}
            className={`flex mb-4 ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                message.senderId === user?.id
                  ? 'bg-blue-600 text-white'
                  : user?.darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'
              }`}
            >
              {message.type === 'voice' ? (
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => playVoiceMessage(message.content)}
                    className="flex items-center space-x-1 hover:opacity-80"
                  >
                    <Play size={16} />
                    <span>Voice Message</span>
                  </button>
                </div>
              ) : message.type === 'photo' ? (
                <div>
                  <img 
                    src={message.content} 
                    alt="Shared photo" 
                    className="max-w-48 max-h-48 rounded cursor-pointer"
                    onClick={() => window.open(message.content, '_blank')}
                  />
                  <button 
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = message.content;
                      link.download = 'photo.jpg';
                      link.click();
                    }}
                    className="text-xs underline mt-1 block"
                  >
                    Download
                  </button>
                </div>
              ) : message.type === 'file' ? (
                <div className="flex items-center space-x-2">
                  <Paperclip size={16} />
                  <div>
                    <p className="text-sm">{JSON.parse(message.content).name}</p>
                    <button 
                      onClick={() => downloadFile(message)}
                      className="text-xs underline"
                    >
                      Download
                    </button>
                  </div>
                </div>
              ) : (
                <p>{message.content}</p>
              )}
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs opacity-75">
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                {message.senderId === user?.id && (
                  <span className="text-xs opacity-75">
                    {message.read ? '✓✓' : '✓'}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {adminTyping && (
          <div className="flex justify-start mb-4">
            <div className={`px-4 py-2 rounded-lg max-w-xs ${
              user?.darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'
            }`}>
              <div className="flex items-center space-x-1">
                <span className="text-sm">Admin is typing</span>
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-gray-600 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-gray-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-1 h-1 bg-gray-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="fixed bottom-16 left-0 right-0 bg-white p-4 border-t">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-500 flex-shrink-0"
          >
            <Paperclip size={20} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            onChange={(e) => e.target.files?.[0] && sendFile(e.target.files[0])}
            className="hidden"
          />
          <button 
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'image/*';
              input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) sendPhoto(file);
              };
              input.click();
            }}
            className="p-2 text-gray-500 flex-shrink-0"
          >
            <Camera size={20} />
          </button>
          <div className="flex-1 flex items-center border rounded-full px-3 py-1 min-w-0">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => handleTyping(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 outline-none text-sm min-w-0"
            />
            <button 
              onClick={sendVoiceMessage}
              className="p-1 text-gray-500 flex-shrink-0 ml-1 hover:text-blue-600"
            >
              <Mic size={16} />
            </button>
          </div>
          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white p-2 rounded-full flex-shrink-0"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
 