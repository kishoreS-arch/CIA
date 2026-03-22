import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ExamContext } from '../context/ExamContext';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const { activeExam, toggleExam } = useContext(ExamContext);
  const navigate = useNavigate();

  return (
    <div className="h-16 glass-panel border-x-0 border-t-0 border-b border-white/10 flex items-center justify-between px-6 sticky top-0 z-10 bg-gray-950/50 backdrop-blur-lg">
      <div className="flex items-center gap-4 text-sm font-medium text-gray-300">
        <span className="hidden sm:inline">Role: <span className="text-blue-400 font-bold ml-1">{user?.role}</span></span>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <span className={`text-sm font-bold transition-colors ${activeExam === 'CT1' ? 'text-white' : 'text-gray-500'}`}>CT1</span>
          <button 
            onClick={toggleExam}
            className="w-12 h-6 rounded-full bg-white/10 relative p-1 flex items-center cursor-pointer border border-white/20"
          >
            <motion.div 
              layout
              transition={{ type: "spring", stiffness: 700, damping: 30 }}
              className="w-4 h-4 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full shadow-lg"
              style={{ marginLeft: activeExam === 'CT2' ? 'auto' : 0 }}
            />
          </button>
          <span className={`text-sm font-bold transition-colors ${activeExam === 'CT2' ? 'text-white' : 'text-gray-500'}`}>CT2</span>
        </div>

        <button
          onClick={() => navigate('/dashboard/profile')}
          className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-sm font-bold shadow-lg shadow-purple-500/20 hover:scale-110 transition-transform cursor-pointer"
          title="View Profile"
        >
          {user?.username?.[0]?.toUpperCase()}
        </button>
      </div>
    </div>
  );
};

export default Navbar;
