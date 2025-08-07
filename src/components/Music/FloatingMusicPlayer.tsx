import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Music, Play, Pause, Search, X, Volume2 } from 'lucide-react';
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

const FloatingMusicPlayer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
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
    <>
      {/* Floating Music Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 ${themeClasses.button} rounded-full shadow-lg hover:scale-110 transition-all duration-300 z-40 flex items-center justify-center`}
      >
        <Music className="w-6 h-6" />
      </button>

      {/* Music Player Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`${themeClasses.cardBg} rounded-2xl border ${themeClasses.border} w-full max-w-md max-h-[80vh] overflow-hidden`}>
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className={`text-lg font-semibold ${themeClasses.text} flex items-center gap-2`}>
                <Music className="w-5 h-5" />
                Music Player
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className={`p-2 rounded-lg ${themeClasses.textSecondary} hover:${themeClasses.text} transition-colors`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Search */}
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for music..."
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border ${themeClasses.input} focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all`}
                  />
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${themeClasses.textSecondary}`} />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-4 py-2 ${themeClasses.button} rounded-lg font-medium transition-all hover:scale-105 disabled:opacity-50`}
                >
                  {loading ? '...' : 'Search'}
                </button>
              </form>

              {/* Current Track Player */}
              {currentTrack && (
                <div className={`p-3 rounded-lg bg-gray-100/50 dark:bg-gray-800/50 space-y-3`}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium ${themeClasses.text} truncate text-sm`}>{currentTrack.name}</p>
                      <p className={`text-xs ${themeClasses.textSecondary} truncate`}>{currentTrack.artist}</p>
                    </div>
                    <button
                      onClick={togglePlayPause}
                      className={`flex items-center justify-center w-8 h-8 ${themeClasses.button} rounded-full ml-2`}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <input
                      type="range"
                      min="0"
                      max={duration || 0}
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  {/* Volume Control */}
                  <div className="flex items-center gap-2">
                    <Volume2 className={`w-3 h-3 ${themeClasses.textSecondary}`} />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
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
                        <p className={`font-medium ${themeClasses.text} truncate text-sm`}>{track.name}</p>
                        <p className={`text-xs ${themeClasses.textSecondary} truncate`}>
                          {track.artist} {track.album && `• ${track.album}`}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 ml-2">
                        <span className={`text-xs ${themeClasses.textSecondary}`}>
                          {formatTime(track.duration)}
                        </span>
                        <div className={`w-5 h-5 flex items-center justify-center ${
                          currentTrack?.id === track.id && isPlaying ? 'text-blue-600' : themeClasses.textSecondary
                        }`}>
                          {currentTrack?.id === track.id && isPlaying ? (
                            <Pause className="w-3 h-3" />
                          ) : (
                            <Play className="w-3 h-3" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {tracks.length === 0 && searchQuery && !loading && (
                <div className="text-center py-4">
                  <p className={`${themeClasses.textSecondary} text-sm`}>No tracks found. Try a different search term.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <audio ref={audioRef} />
    </>
  );
};

export default FloatingMusicPlayer;