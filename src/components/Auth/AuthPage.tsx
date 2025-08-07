import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import BubbleBackground from '../BubbleBackground';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { themeClasses } = useTheme();

  return (
    <div className={`min-h-screen ${themeClasses.bg} flex items-center justify-center p-4 relative`}>
      <BubbleBackground />
      
      <div className="relative z-10 w-full max-w-md">
        {isLogin ? (
          <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
        ) : (
          <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
};

export default AuthPage;