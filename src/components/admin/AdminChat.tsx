import  React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Search, Phone, Camera, Paperclip, Mic, Play } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { supabase } from '../../supabase';
import { Message } from '../../types';

export default function AdminChat() {
  const { messages, addMessage } = useApp();
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showChatView, setShowChatView] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const { data } = await supabase
        .from('users')
        .select('*')
        .order('fullName');
      if (data) setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const userChats = users.filter((user: any) => 
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.tradingId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedUserMessages = selectedUserId 
    ? messages.filter(m => 
        (m.senderId === selectedUserId && m.receiverId === 'admin') ||
        (m.senderId === 'admin' && m.receiverId === selectedUserId)
      ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedUserMessages]);

  useEffect(() => {
    const checkUserTyping = () => {
      const userTypingStatus = localStorage.getItem('userTyping');
      if (userTypingStatus && selectedUserId) {
        const typingData = JSON.parse(userTypingStatus);
        setUserTyping(typingData.isTyping && typingData.userId === selectedUserId);
      } else {
        setUserTyping(false);
      }
    };

    const interval = setInterval(checkUserTyping, 500);
    return () => clearInterval(interval);
  }, [selectedUserId]);

  const handleTyping = (value: string) => {
    setNewMessage(value);
    
    if (!isTyping && value.trim() && selectedUserId) {
      setIsTyping(true);
      localStorage.setItem('adminTyping', JSON.stringify({
        userId: selectedUserId,
        isTyping: true,
        timestamp: Date.now()
      }));
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      localStorage.removeItem('adminTyping');
    }, 2000);
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedUserId) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: 'admin',
      receiverId: selectedUserId,
      content: newMessage,
      type: 'text',
      timestamp: new Date(),
      read: false
    };

    addMessage(message);
    setNewMessage('');
  };

  const sendPhoto = (file: File) => {
    if (!selectedUserId) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const message: Message = {
        id: Date.now().toString(),
        senderId: 'admin',
        receiverId: selectedUserId,
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
    if (!selectedUserId) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const message: Message = {
        id: Date.now().toString(),
        senderId: 'admin',
        receiverId: selectedUserId,
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
    if (!selectedUserId) return;
    
    const message: Message = {
      id: Date.now().toString(),
      senderId: 'admin',
      receiverId: selectedUserId,
      content: '🎤 Voice message from admin',
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

  const getLastMessage = (userId: string) => {
    const userMsgs = messages.filter(m => 
      m.senderId === userId || m.receiverId === userId
    );
    return userMsgs.length > 0 
      ? userMsgs[userMsgs.length - 1]
      : null;
  };

  const isUserOnline = (userId: string) => {
    return Math.random() > 0.3;
  };

  const openChat = (userId: string) => {
    setSelectedUserId(userId);
    setShowChatView(true);
  };

  const backToInbox = () => {
    setShowChatView(false);
    setSelectedUserId(null);
  };

  if (showChatView && selectedUserId) {
    const selectedUser = users.find((u: any) => u.id === selectedUserId);
    
    return (
      <div className="min-h-screen bg-white pb-20">
        <div className="bg-blue-600 text-white p-4 flex items-center space-x-3">
          <ArrowLeft size={24} onClick={backToInbox} className="cursor-pointer" />
          <img
            src={selectedUser?.profilePhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face'}
            className="w-10 h-10 rounded-full"
            alt={selectedUser?.fullName}
          />
          <div className="flex-1">
            <div className="font-semibold">{selectedUser?.fullName}</div>
            <div className="text-xs opacity-75">{selectedUser?.tradingId}</div>
          </div>
          <Phone size={20} className="cursor-pointer" />
        </div>

        <div className="flex-1 p-4 h-screen overflow-y-auto pb-32">
          {selectedUserMessages.map((message) => (
            <div
              key={message.id}
              className={`flex mb-4 ${message.senderId === 'admin' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  message.senderId === 'admin'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200'
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
                  {message.senderId === 'admin' && (
                    <span className="text-xs opacity-75">
                      {message.read ? '✓✓' : '✓'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {userTyping && (
            <div className="flex justify-start mb-4">
              <div className="bg-gray-200 px-4 py-2 rounded-lg max-w-xs">
                <div className="flex items-center space-x-1">
                  <span className="text-sm text-gray-600">User is typing</span>
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

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="bg-blue-600 text-white p-4">
        <h1 className="text-xl font-semibold">Message Inbox</h1>
        <div className="text-sm opacity-75 mt-1">
          {userChats.length} users available
        </div>
      </div>

      <div className="p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pl-10 border rounded-lg"
          />
          <Search size={16} className="absolute left-3 top-3.5 text-gray-400" />
        </div>
      </div>

      <div className="px-4 space-y-2">
        {userChats.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No users found
          </div>
        ) : (
          userChats.map((user: any) => {
            const lastMessage = getLastMessage(user.id);
            const isOnline = isUserOnline(user.id);
            const unreadCount = messages.filter(m => 
              m.senderId === user.id && m.receiverId === 'admin' && !m.read
            ).length;
            
            return (
              <div
                key={user.id}
                onClick={() => openChat(user.id)}
                className="bg-gray-50 p-4 rounded-lg cursor-pointer hover:bg-gray-100 flex items-center space-x-3"
              >
                <div className="relative">
                  <img
                    src={user.profilePhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face'}
                    className="w-12 h-12 rounded-full"
                    alt={user.fullName}
                  />
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                    isOnline ? 'bg-green-500' : 'bg-gray-400'
                  }`}></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold truncate">{user.fullName}</div>
                    <div className="flex items-center space-x-2">
                      {lastMessage && (
                        <div className="text-xs text-gray-400">
                          {new Date(lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      )}
                      {unreadCount > 0 && (
                        <div className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {unreadCount}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 truncate">
                    {lastMessage ? lastMessage.content : 'Start a conversation'}
                  </div>
                  <div className="text-xs text-gray-400">
                    {user.tradingId} • Balance: ₱{(user.balance || 0).toLocaleString()}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
 