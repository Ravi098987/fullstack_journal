import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { LogOut, Sun, Moon, Palette } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme, themeClasses } = useTheme();

  const themeOptions = [
    { value: 'light' as const, label: 'Light', icon: Sun },
    { value: 'dark' as const, label: 'Dark', icon: Moon },
    { value: 'cyan' as const, label: 'Cyan', icon: Palette },
  ];

  return (
    <header className={`${themeClasses.cardBg} border-b ${themeClasses.border} backdrop-blur-lg sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <h1 className={`text-xl font-bold ${themeClasses.text}`}>
              My Diary - Flipper
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <span className={`${themeClasses.textSecondary} text-sm`}>
              Welcome, {user?.username}
            </span>
            
            {/* Theme Switcher */}
            <div className="flex items-center space-x-1 bg-gray-200/20 rounded-lg p-1">
              {themeOptions.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setTheme(value)}
                  className={`p-2 rounded-md transition-all ${
                    theme === value
                      ? themeClasses.button
                      : `${themeClasses.textSecondary} hover:${themeClasses.text}`
                  }`}
                  title={label}
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>

            <button
              onClick={logout}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${themeClasses.textSecondary} hover:${themeClasses.text} hover:bg-gray-200/20 transition-all`}
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;