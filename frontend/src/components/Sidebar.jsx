import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, FileText, ChevronLeft, ChevronRight, LogOut, BookOpen, UserCircle } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: UserCircle, label: 'Profile', path: '/dashboard/profile' },
    ...(user?.role !== 'STUDENT' ? [{ icon: Users, label: 'Students', path: '/dashboard' }] : []),
    ...(user?.role === 'CC' || user?.role === 'HOD' ? [{ icon: FileText, label: 'Reports', path: '/dashboard' }] : [])
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.div 
      initial={false}
      animate={{ width: isCollapsed ? 80 : 260 }}
      className="h-screen glass-panel border-y-0 border-l-0 border-r border-white/10 flex flex-col flex-shrink-0 z-20 relative bg-gray-950/50"
    >
      <div className="flex items-center justify-between p-4 border-b border-white/5 h-16">
        {!isCollapsed && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} className="flex items-center gap-2 text-blue-400 font-bold overflow-hidden">
            <BookOpen size={24} />
            <span className="whitespace-nowrap">MarkSync</span>
          </motion.div>
        )}
        {isCollapsed && <BookOpen size={24} className="text-blue-400 mx-auto" />}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-md hover:bg-white/10 transition-colors absolute -right-3 top-5 bg-gray-800 border border-white/20 z-30"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      <div className="flex-1 py-6 px-3 space-y-2">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <button 
              key={index}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors group relative ${
                isActive 
                  ? 'bg-blue-500/20 text-blue-400' 
                  : 'hover:bg-white/10 text-gray-300 hover:text-white'
              }`}
              title={isCollapsed ? item.label : ""}
            >
              <item.icon size={20} className={`transition-colors flex-shrink-0 ${isActive ? 'text-blue-400' : 'group-hover:text-blue-400'}`} />
              {!isCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
            </button>
          );
        })}
      </div>

      <div className="p-4 border-t border-white/5">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-500/20 text-gray-300 hover:text-red-400 transition-colors"
          title={isCollapsed ? "Logout" : ""}
        >
          <LogOut size={20} className="flex-shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;
