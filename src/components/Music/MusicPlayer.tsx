import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Play, Pause, Search, Volume2 } from 'lucide-react';
import axios from 'axios';

interface Track {
  id: string;
  name: string;
  artist: string;
  duration: number;
  audio: string;
  image?: string;
  album?: string;
}

const MusicPlayer: React.FC = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);
  const { themeClasses } = useTheme();

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const searchTracks = async (query: string) => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/music/search`, {
        params: { q: query, limit: 10 }
      });
      setTracks(response.data.tracks || []);
    } catch (error) {
      console.error('Search failed:', error);
      setTracks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchTracks(searchQuery);
  };

  const playTrack = (track: Track) => {
    if (currentTrack?.id === track.id) {
      togglePlayPause();
      return;
    }

    setCurrentTrack(track);
    setIsPlaying(true);
    
    if (audioRef.current) {
      audioRef.current.src = track.audio;
      audioRef.current.play();
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current || !currentTrack) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const time = parseFloat(e.target.value);
    audio.currentTime = time;
    setCurrentTime(time);
  };

  return (
    <div className={`${themeClasses.cardBg} rounded-2xl border ${themeClasses.border} p-6 space-y-6`}>
      <h2 className={`text-xl font-semibold ${themeClasses.text} flex items-center gap-2`}>
        <Volume2 className="w-5 h-5" />
        Music Player
      </h2>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for music..."
            className={`w-full pl-10 pr-4 py-3 rounded-lg border ${themeClasses.input} focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all`}
          />
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${themeClasses.textSecondary}`} />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`px-6 py-3 ${themeClasses.button} rounded-lg font-medium transition-all hover:scale-105 disabled:opacity-50`}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {/* Current Track Player */}
      {currentTrack && (
        <div className={`p-4 rounded-lg bg-gray-100/50 dark:bg-gray-800/50 space-y-4`}>
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className={`font-medium ${themeClasses.text} truncate`}>{currentTrack.name}</p>
              <p className={`text-sm ${themeClasses.textSecondary} truncate`}>{currentTrack.artist}</p>
            </div>
            <button
              onClick={togglePlayPause}
              className={`flex items-center justify-center w-10 h-10 ${themeClasses.button} rounded-full ml-4`}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2">
            <Volume2 className={`w-4 h-4 ${themeClasses.textSecondary}`} />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Track List */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {tracks.map((track) => (
          <div
            key={track.id}
            onClick={() => playTrack(track)}
            className={`p-3 rounded-lg border cursor-pointer transition-all hover:scale-[1.02] ${
              currentTrack?.id === track.id
                ? `${themeClasses.accent} bg-blue-50/50 border-blue-200`
                : `${themeClasses.border} hover:${themeClasses.cardBg}`
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className={`font-medium ${themeClasses.text} truncate`}>{track.name}</p>
                <p className={`text-sm ${themeClasses.textSecondary} truncate`}>
                  {track.artist} {track.album && `• ${track.album}`}
                </p>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <span className={`text-xs ${themeClasses.textSecondary}`}>
                  {formatTime(track.duration)}
                </span>
                <div className={`w-6 h-6 flex items-center justify-center ${
                  currentTrack?.id === track.id && isPlaying ? 'text-blue-600' : themeClasses.textSecondary
                }`}>
                  {currentTrack?.id === track.id && isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {tracks.length === 0 && searchQuery && !loading && (
        <div className="text-center py-8">
          <p className={`${themeClasses.textSecondary}`}>No tracks found. Try a different search term.</p>
        </div>
      )}

      <audio ref={audioRef} />
    </div>
  );
};

export default MusicPlayer;