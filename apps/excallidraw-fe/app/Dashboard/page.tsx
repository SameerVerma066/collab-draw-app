"use client"

import React, { useState, useMemo } from 'react';
import { useRouter } from "next/navigation";
import { HTTP_BACKEND } from "@/config";

interface Room {
  id: string;     // store slug here
  name: string;
  createdAt: Date;
}

const HomeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
const PlusCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);
const LogInIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
    <polyline points="10 17 15 12 10 7" />
    <line x1="15" y1="12" x2="3" y2="12" />
  </svg>
);
const CopyIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
);

const RoomInfoCard: React.FC<{ room: Room; onJoin: (id: string) => void }> = ({ room, onJoin }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(room.id).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  return (
    <div className="bg-gray-800 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
      <div className="flex-grow">
        <h3 className="font-bold text-lg text-white">{room.name}</h3>
        <div className="flex items-center space-x-2 mt-1">
          <p className="text-xs text-gray-400 font-mono bg-gray-900 px-2 py-1 rounded-md">{room.id}</p>
          <button onClick={handleCopy} className="p-1 text-gray-400 hover:text-white transition-colors duration-200">
            {copied ? <span className="text-xs text-green-400">Copied!</span> : <CopyIcon className="w-4 h-4" />}
          </button>
        </div>
      </div>
      <button onClick={() => onJoin(room.id)} className="w-full sm:w-auto bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-indigo-500 transition-colors duration-300 flex items-center justify-center space-x-2">
        <LogInIcon className="w-5 h-5" />
        <span>Join Room</span>
      </button>
    </div>
  );
};

export default function App() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [newRoomName, setNewRoomName] = useState('');
  const [joinRoomId, setJoinRoomId] = useState('');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const totalRooms = useMemo(() => rooms.length, [rooms]);
  const activeRooms = useMemo(() => rooms.length, [rooms]);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 2500);
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newRoomName.trim();
    if (!name) return showNotification('Room name cannot be empty.', 'error');

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      showNotification('Please sign in first.', 'error');
      router.push('/Signin');
      return;
    }

    try {
      const res = await fetch(`${HTTP_BACKEND}/room`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name })
      });
      if (!res.ok) throw new Error('Create failed');
      const data = await res.json(); // { roomId: slug } per your backend
      const slug = String(data.roomId);

      const newRoom: Room = { id: slug, name, createdAt: new Date() };
      setRooms(prev => [newRoom, ...prev]);
      setNewRoomName('');
      showNotification(`Room "${name}" created! Slug: ${slug}`, 'success');
    } catch {
      showNotification('Failed to create room.', 'error');
    }
  };

  const handleJoinRoom = (slug: string) => {
    if (!slug.trim()) return showNotification('Enter a room slug.', 'error');
    router.push(`/canvas/${slug}`);
  };

  const handleJoinRoomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleJoinRoom(joinRoomId.trim());
  };

  return (
    <div className="bg-gray-900 min-h-screen text-gray-200 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {notification && (
          <div className={`fixed top-5 right-5 p-4 rounded-lg shadow-xl text-white z-50 ${notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
            {notification.message}
          </div>
        )}

        <header className="mb-8">
          <h1 className="text-4xl font-bold text-white">Chat Dashboard</h1>
          <p className="text-gray-400 mt-1">Create new rooms or join existing ones.</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-2xl flex items-center space-x-4">
            <div className="bg-gray-700 p-3 rounded-full"><HomeIcon className="w-6 h-6 text-indigo-400"/></div>
            <div>
              <p className="text-sm text-gray-400">Total Rooms</p>
              <p className="text-2xl font-bold text-white">{totalRooms}</p>
            </div>
          </div>
          <div className="bg-gray-800 p-6 rounded-2xl flex items-center space-x-4">
            <div className="bg-gray-700 p-3 rounded-full">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-400">Active Rooms</p>
              <p className="text-2xl font-bold text-white">{activeRooms}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-800 p-6 rounded-2xl">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <PlusCircleIcon className="w-6 h-6 mr-2 text-indigo-400"/>
              Create a New Room
            </h2>
            <form onSubmit={handleCreateRoom} className="space-y-4">
              <input
                type="text"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                placeholder="Enter room name"
                className="w-full bg-gray-700 border-2 border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
              <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-500 transition-colors duration-300 transform hover:scale-105">
                Create Room
              </button>
            </form>
          </div>

          <div className="bg-gray-800 p-6 rounded-2xl">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <LogInIcon className="w-6 h-6 mr-2 text-indigo-400"/>
              Join an Existing Room
            </h2>
            <form onSubmit={handleJoinRoomSubmit} className="space-y-4">
              <input
                type="text"
                value={joinRoomId}
                onChange={(e) => setJoinRoomId(e.target.value)}
                placeholder="Enter room slug"
                className="w-full bg-gray-700 border-2 border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
              <button type="submit" className="w-full bg-gray-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-500 transition-colors duration-300 transform hover:scale-105">
                Join with Slug
              </button>
            </form>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-2xl">
          <h2 className="text-xl font-semibold mb-4 text-white">Created Rooms</h2>
          <div className="space-y-4">
            {rooms.length > 0 ? (
              rooms.map(room => (
                <RoomInfoCard key={room.id} room={room} onJoin={handleJoinRoom} />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">No rooms have been created yet.</p>
                <p className="text-gray-500 text-sm mt-1">Use the 'Create a New Room' panel to get started.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}