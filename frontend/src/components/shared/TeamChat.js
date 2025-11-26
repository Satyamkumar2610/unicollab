import React, { useState } from 'react';
import { useList } from '../../hooks/useList';
import { api } from '../../services/api';
import { LoadingState } from '../ui/LoadingState';
import { ErrorState } from '../ui/ErrorState';

const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

const TeamChat = ({ teamId }) => {
  const { data: messages, loading, error, refetch } = useList(() => api.get(`/teams/${teamId}/messages`));
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;

    try {
      await api.post(`/teams/${teamId}/messages`, { content: newMessage });
      setNewMessage('');
      refetch();
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-bold text-lg">Team Chat</h3>
      </div>
      <div className="flex-grow p-4 space-y-4 overflow-y-auto">
        {messages.map(message => (
          <div key={message.id} className={`flex items-start gap-3 ${message.isSender ? 'flex-row-reverse' : ''}`}>
            <img src={message.author.avatarUrl} alt={message.author.name} className="w-8 h-8 rounded-full" />
            <div className={`flex flex-col ${message.isSender ? 'items-end' : ''}`}>
              <p className="font-semibold text-sm">{message.author.name}</p>
              <div className={`${message.isSender ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded-lg mt-1`}>
                <p>{message.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="relative">
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="w-full pl-4 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button onClick={handleSendMessage} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-600">
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamChat;
