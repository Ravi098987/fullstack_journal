import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { format } from 'date-fns';
import { Edit, Trash2, Heart, Meh, Frown, Smile, Zap, CloudRain, Sun, HelpCircle } from 'lucide-react';

interface DiaryEntry {
  _id: string;
  title: string;
  content: string;
  mood: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface DiaryEntryProps {
  entry: DiaryEntry;
  onEdit: (entry: DiaryEntry) => void;
  onDelete: (id: string) => void;
}

const DiaryEntryCard: React.FC<DiaryEntryProps> = ({ entry, onEdit, onDelete }) => {
  const { themeClasses } = useTheme();

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'happy': return <Smile className="w-4 h-4 text-yellow-500" />;
      case 'sad': return <Frown className="w-4 h-4 text-blue-500" />;
      case 'excited': return <Zap className="w-4 h-4 text-orange-500" />;
      case 'anxious': return <CloudRain className="w-4 h-4 text-gray-500" />;
      case 'calm': return <Sun className="w-4 h-4 text-green-500" />;
      case 'angry': return <Heart className="w-4 h-4 text-red-500" />;
      case 'content': return <Meh className="w-4 h-4 text-purple-500" />;
      default: return <HelpCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'happy': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'sad': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'excited': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'anxious': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'calm': return 'bg-green-100 text-green-800 border-green-200';
      case 'angry': return 'bg-red-100 text-red-800 border-red-200';
      case 'content': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className={`${themeClasses.cardBg} rounded-xl border ${themeClasses.border} p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold ${themeClasses.text} text-lg mb-2 truncate`}>
            {entry.title}
          </h3>
          <div className="flex items-center gap-3 mb-3">
            <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border ${getMoodColor(entry.mood)}`}>
              {getMoodIcon(entry.mood)}
              {entry.mood}
            </div>
            <span className={`text-sm ${themeClasses.textSecondary}`}>
              {format(new Date(entry.createdAt), 'MMM d, yyyy')}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={() => onEdit(entry)}
            className={`p-2 rounded-lg ${themeClasses.textSecondary} hover:${themeClasses.text} hover:bg-gray-200/20 transition-all`}
            title="Edit entry"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(entry._id)}
            className="p-2 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50/20 transition-all"
            title="Delete entry"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <p className={`${themeClasses.textSecondary} mb-4 line-clamp-3`}>
        {entry.content}
      </p>

      {entry.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {entry.tags.map((tag, index) => (
            <span
              key={index}
              className={`inline-block px-2 py-1 text-xs rounded-full ${themeClasses.accent} bg-opacity-10 border border-current border-opacity-20`}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default DiaryEntryCard;