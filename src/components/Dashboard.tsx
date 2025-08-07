import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import BubbleBackground from './BubbleBackground';
import Header from './Layout/Header';
import DiaryEntryCard from './Diary/DiaryEntry';
import DiaryForm from './Diary/DiaryForm';
import FloatingMusicPlayer from './Music/FloatingMusicPlayer';
import { Plus, BookOpen, FileText, Calendar } from 'lucide-react';
import axios from 'axios';

interface DiaryEntry {
  _id: string;
  title: string;
  content: string;
  mood: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

const Dashboard: React.FC = () => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DiaryEntry | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const { themeClasses } = useTheme();

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/diary`);
      setEntries(response.data.entries || []);
    } catch (error) {
      console.error('Failed to fetch entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEntry = async (entryData: Omit<DiaryEntry, '_id'>) => {
    try {
      if (editingEntry) {
        const response = await axios.put(`${API_BASE_URL}/diary/${editingEntry._id}`, entryData);
        setEntries(entries.map(entry => 
          entry._id === editingEntry._id ? response.data.entry : entry
        ));
        setSelectedEntry(response.data.entry);
      } else {
        const response = await axios.post(`${API_BASE_URL}/diary`, entryData);
        setEntries([response.data.entry, ...entries]);
        setSelectedEntry(response.data.entry);
      }
      setShowForm(false);
      setEditingEntry(null);
    } catch (error) {
      console.error('Failed to save entry:', error);
    }
  };

  const handleEditEntry = (entry: DiaryEntry) => {
    setEditingEntry(entry);
    setShowForm(true);
  };

  const handleDeleteEntry = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/diary/${id}`);
      setEntries(entries.filter(entry => entry._id !== id));
      if (selectedEntry?._id === id) {
        setSelectedEntry(null);
      }
    } catch (error) {
      console.error('Failed to delete entry:', error);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingEntry(null);
  };

  const handleNewEntry = () => {
    setShowForm(true);
    setEditingEntry(null);
    setSelectedEntry(null);
  };
  return (
    <div className={`min-h-screen ${themeClasses.bg} relative`}>
      <BubbleBackground />
      <Header />
      
      <div className="relative z-10 flex h-screen pt-16">
        {/* Left Sidebar */}
        <div className={`w-80 ${themeClasses.cardBg} border-r ${themeClasses.border} flex flex-col`}>
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-xl font-semibold ${themeClasses.text}`}>My Diary</h2>
              <button
                onClick={handleNewEntry}
                className={`flex items-center gap-2 px-3 py-2 ${themeClasses.button} rounded-lg text-sm font-medium transition-all hover:scale-105`}
              >
                <Plus className="w-4 h-4" />
                New Entry
              </button>
            </div>
            <p className={`${themeClasses.textSecondary} text-sm`}>
              Welcome back, {user?.username}!
            </p>
          </div>

          {/* Entries List */}
          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : entries.length > 0 ? (
              <div className="space-y-3">
                {entries.map((entry) => (
                  <div
                    key={entry._id}
                    onClick={() => setSelectedEntry(entry)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all hover:scale-[1.02] ${
                      selectedEntry?._id === entry._id
                        ? `${themeClasses.accent} bg-blue-50/50 border-blue-200`
                        : `${themeClasses.border} hover:${themeClasses.cardBg}`
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className={`font-medium ${themeClasses.text} text-sm truncate flex-1`}>
                        {entry.title}
                      </h3>
                      <span className={`text-xs ${themeClasses.textSecondary} ml-2`}>
                        {new Date(entry.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className={`text-xs ${themeClasses.textSecondary} line-clamp-2`}>
                      {entry.content}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        entry.mood === 'happy' ? 'bg-yellow-100 text-yellow-800' :
                        entry.mood === 'sad' ? 'bg-blue-100 text-blue-800' :
                        entry.mood === 'excited' ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {entry.mood}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className={`w-8 h-8 ${themeClasses.textSecondary} mx-auto mb-3`} />
                <h3 className={`text-sm font-medium ${themeClasses.text} mb-2`}>No entries yet</h3>
                <p className={`text-xs ${themeClasses.textSecondary} mb-4`}>Start writing your first entry.</p>
                <button
                  onClick={handleNewEntry}
                  className={`${themeClasses.button} px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105`}
                >
                  Write First Entry
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {showForm ? (
            <DiaryForm
              entry={editingEntry || undefined}
              onSave={handleSaveEntry}
              onCancel={handleCloseForm}
            />
          ) : selectedEntry ? (
            <div className={`${themeClasses.cardBg} h-full overflow-y-auto`}>
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h1 className={`text-2xl font-bold ${themeClasses.text} mb-2`}>
                      {selectedEntry.title}
                    </h1>
                    <div className="flex items-center gap-4 mb-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${
                        selectedEntry.mood === 'happy' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                        selectedEntry.mood === 'sad' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                        selectedEntry.mood === 'excited' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                        'bg-gray-100 text-gray-800 border-gray-200'
                      }`}>
                        {selectedEntry.mood}
                      </span>
                      <span className={`text-sm ${themeClasses.textSecondary} flex items-center gap-1`}>
                        <Calendar className="w-4 h-4" />
                        {new Date(selectedEntry.createdAt).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditEntry(selectedEntry)}
                      className={`px-4 py-2 ${themeClasses.button} rounded-lg text-sm font-medium transition-all hover:scale-105`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteEntry(selectedEntry._id)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-all hover:scale-105"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className={`prose max-w-none ${themeClasses.text}`}>
                  <p className="whitespace-pre-wrap leading-relaxed">
                    {selectedEntry.content}
                  </p>
                </div>

                {selectedEntry.tags.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className={`text-sm font-medium ${themeClasses.text} mb-3`}>Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedEntry.tags.map((tag, index) => (
                        <span
                          key={index}
                          className={`inline-block px-3 py-1 text-sm rounded-full ${themeClasses.accent} bg-opacity-10 border border-current border-opacity-20`}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className={`${themeClasses.cardBg} h-full flex items-center justify-center`}>
              <div className="text-center">
                <FileText className={`w-16 h-16 ${themeClasses.textSecondary} mx-auto mb-4`} />
                <h2 className={`text-xl font-semibold ${themeClasses.text} mb-2`}>
                  Select an entry to read
                </h2>
                <p className={`${themeClasses.textSecondary}`}>
                  Choose an entry from the sidebar or create a new one
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <FloatingMusicPlayer />
    </div>
  );
};

export default Dashboard;