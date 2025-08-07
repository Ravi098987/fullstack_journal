import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const BubbleBackground: React.FC = () => {
  const { theme } = useTheme();

  const getBubbleColors = () => {
    switch (theme) {
      case 'dark':
        return {
          bubble1: 'bg-purple-600/20',
          bubble2: 'bg-blue-600/20',
          bubble3: 'bg-pink-600/20',
          bubble4: 'bg-indigo-600/20',
        };
      case 'cyan':
        return {
          bubble1: 'bg-cyan-400/20',
          bubble2: 'bg-teal-400/20',
          bubble3: 'bg-blue-400/20',
          bubble4: 'bg-emerald-400/20',
        };
      default: // light
        return {
          bubble1: 'bg-blue-400/20',
          bubble2: 'bg-purple-400/20',
          bubble3: 'bg-pink-400/20',
          bubble4: 'bg-indigo-400/20',
        };
    }
  };

  const colors = getBubbleColors();

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Large floating bubbles */}
      <div className={`absolute top-10 left-10 w-32 h-32 ${colors.bubble1} rounded-full blur-xl animate-pulse`}></div>
      <div className={`absolute top-20 right-20 w-24 h-24 ${colors.bubble2} rounded-full blur-lg animate-bounce`} style={{ animationDuration: '3s' }}></div>
      <div className={`absolute bottom-20 left-20 w-28 h-28 ${colors.bubble3} rounded-full blur-xl animate-pulse`} style={{ animationDelay: '1s' }}></div>
      <div className={`absolute bottom-10 right-10 w-20 h-20 ${colors.bubble4} rounded-full blur-lg animate-bounce`} style={{ animationDuration: '2s', animationDelay: '0.5s' }}></div>
      
      {/* Medium bubbles */}
      <div className={`absolute top-40 left-1/2 w-16 h-16 ${colors.bubble1} rounded-full blur-md animate-pulse`} style={{ animationDelay: '2s' }}></div>
      <div className={`absolute top-60 right-40 w-12 h-12 ${colors.bubble2} rounded-full blur-sm animate-bounce`} style={{ animationDuration: '4s' }}></div>
      <div className={`absolute bottom-40 left-40 w-14 h-14 ${colors.bubble3} rounded-full blur-md animate-pulse`} style={{ animationDelay: '1.5s' }}></div>
      
      {/* Small floating elements */}
      <div className={`absolute top-80 left-80 w-8 h-8 ${colors.bubble4} rounded-full blur-sm animate-bounce`} style={{ animationDuration: '2.5s' }}></div>
      <div className={`absolute top-96 right-60 w-6 h-6 ${colors.bubble1} rounded-full blur-sm animate-pulse`} style={{ animationDelay: '3s' }}></div>
      <div className={`absolute bottom-60 left-60 w-10 h-10 ${colors.bubble2} rounded-full blur-sm animate-bounce`} style={{ animationDuration: '3.5s', animationDelay: '0.8s' }}></div>
      
      {/* Gradient overlay for depth */}
      <div className={`absolute inset-0 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-gray-900/50 via-transparent to-gray-900/30' 
          : theme === 'cyan'
          ? 'bg-gradient-to-br from-teal-900/40 via-transparent to-teal-800/20'
          : 'bg-gradient-to-br from-blue-50/40 via-transparent to-blue-100/20'
      }`}></div>
    </div>
  );
};

export default BubbleBackground;