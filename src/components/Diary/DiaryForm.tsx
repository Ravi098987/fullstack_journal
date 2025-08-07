import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Save, X, Tag } from 'lucide-react';

interface DiaryEntry {
  _id?: string;
  title: string;
  content: string;
  mood: string;
  tags: string[];
}

interface DiaryFormProps {
  entry?: DiaryEntry;
  onSave: (entry: Omit<DiaryEntry, '_id'>) => void;
  onCancel: () => void;
}

const DiaryForm: React.FC<DiaryFormProps> = ({ entry, onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('content');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  const { themeClasses } = useTheme();

  const moods = [
    { value: 'happy', label: 'Happy', emoji: '😊' },
    { value: 'sad', label: 'Sad', emoji: '😢' },
    { value: 'excited', label: 'Excited', emoji: '🤩' },
    { value: 'anxious', label: 'Anxious', emoji: '😰' },
    { value: 'calm', label: 'Calm', emoji: '😌' },
    { value: 'angry', label: 'Angry', emoji: '😠' },
    { value: 'content', label: 'Content', emoji: '😐' },
    { value: 'confused', label: 'Confused', emoji: '🤔' },
  ];

  useEffect(() => {
    if (entry) {
      setTitle(entry.title);
      setContent(entry.content);
      setMood(entry.mood);
      setTags(entry.tags || []);
    }
  }, [entry]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    onSave({
      title: title.trim(),
      content: content.trim(),
      mood,
      tags: tags.filter(tag => tag.trim()),
    });
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className={`${themeClasses.cardBg} rounded-2xl border ${themeClasses.border} h-full overflow-y-auto`}>
      <div className="p-6 border-b border-gray-200">
        <h2 className={`text-xl font-semibold ${themeClasses.text}`}>
          {entry ? 'Edit Entry' : 'New Diary Entry'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border ${themeClasses.input} focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all`}
              placeholder="What's on your mind?"
              required
              maxLength={200}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
              How are you feeling?
            </label>
            <div className="grid grid-cols-4 gap-3">
              {moods.map((moodOption) => (
                <button
                  key={moodOption.value}
                  type="button"
                  onClick={() => setMood(moodOption.value)}
                  className={`p-3 rounded-lg border text-center transition-all hover:scale-105 ${
                    mood === moodOption.value
                      ? `${themeClasses.button} border-transparent`
                      : `${themeClasses.border} hover:border-gray-300`
                  }`}
                >
                  <div className="text-2xl mb-1">{moodOption.emoji}</div>
                  <div className={`text-xs ${
                    mood === moodOption.value ? 'text-white' : themeClasses.text
                  }`}>
                    {moodOption.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className={`w-full px-4 py-3 rounded-lg border ${themeClasses.input} focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all resize-none`}
              placeholder="Write about your day, thoughts, dreams..."
              required
              maxLength={5000}
            />
            <div className="text-right mt-1">
              <span className={`text-xs ${themeClasses.textSecondary}`}>
                {content.length}/5000
              </span>
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
              Tags
            </label>
            <div className="flex gap-2 mb-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${themeClasses.input} focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all`}
                  placeholder="Add a tag"
                />
                <Tag className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${themeClasses.textSecondary}`} />
              </div>
              <button
                type="button"
                onClick={addTag}
                className={`px-4 py-2 ${themeClasses.button} rounded-lg text-sm font-medium transition-all hover:scale-105`}
              >
                Add
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className={`inline-flex items-center gap-1 px-3 py-1 text-sm rounded-full ${themeClasses.accent} bg-opacity-10 border border-current border-opacity-20`}
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-red-500 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className={`px-6 py-2 ${themeClasses.textSecondary} hover:${themeClasses.text} transition-colors`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex items-center gap-2 px-6 py-2 ${themeClasses.button} rounded-lg font-medium transition-all hover:scale-105`}
            >
              <Save className="w-4 h-4" />
              {entry ? 'Update' : 'Save'} Entry
            </button>
          </div>
      </form>
    </div>
  );
};

export default DiaryForm;