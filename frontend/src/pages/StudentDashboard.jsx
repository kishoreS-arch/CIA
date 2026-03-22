import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ExamContext } from '../context/ExamContext';
import api from '../api/axiosConfig';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, BookOpen, AlertCircle, Award } from 'lucide-react';

const AnimatedCounter = ({ value }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value);
    if (isNaN(end) || end <= 0) {
      setCount(0);
      return;
    }
    const duration = 1000;
    const incrementTime = Math.max(duration / end, 10);
    
    const timer = setInterval(() => {
      start += 1;
      setCount(prev => {
        if(prev >= end) {
            clearInterval(timer);
            return end;
        }
        return prev + 1;
      });
    }, incrementTime);
    
    return () => clearInterval(timer);
  }, [value]);

  return <span>{count}</span>;
};

const MarkDisplay = ({ mark }) => {
  if (mark === null || mark === undefined) return <span className="text-gray-500">-</span>;
  
  const isFail = mark < 30;
  const isRisk = mark >= 30 && mark <= 35;
  const isSafe = mark > 35;

  let animationClass = "";
  if (isFail) {
      animationClass = "text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.8)]";
  } else if (isRisk) {
      animationClass = "text-orange-400 drop-shadow-[0_0_5px_rgba(251,146,60,0.6)] animate-pulse";
  } else if (isSafe) {
      animationClass = "text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.4)]";
  }

  return (
    <motion.div 
      whileHover={isFail ? { x: [-2, 2, -2, 2, 0], transition: { duration: 0.3 } } : { scale: 1.1 }}
      className={`font-bold text-lg inline-block ${animationClass}`}
    >
      {mark}
    </motion.div>
  );
};

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const { activeExam } = useContext(ExamContext);
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarks = async () => {
      setLoading(true);
      try {
        // Use linkedId (regNo) instead of username
        const studentId = user.linkedId || user.username;
        const res = await api.get(`/marks/${studentId}`);
        setMarks(res.data);
      } catch (err) {
        console.error('Error fetching marks:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMarks();
  }, [user.linkedId, user.username]);

  const activeMarksField = activeExam === 'CT1' ? 'ct1Marks' : 'ct2Marks';
  
  const totalScore = marks.reduce((acc, curr) => acc + (curr[activeMarksField] || 0), 0);
  const maxScore = marks.length * 60;
  const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden relative"
      >
        <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-blue-500/10 to-transparent pointer-events-none"></div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-2">Welcome back, {user.username}</h2>
          <p className="text-gray-400">Here's your performance overview for <span className="text-blue-400 font-bold">{activeExam}</span>.</p>
        </div>
        {!loading && (
          <div className="flex gap-4">
            <div className="bg-black/30 p-4 rounded-xl border border-white/5 flex items-center gap-4">
              <div className="p-3 bg-blue-500/20 text-blue-400 rounded-lg"><Trophy size={20} /></div>
              <div>
                <p className="text-sm text-gray-400">Total Score</p>
                <div className="text-xl font-bold"><AnimatedCounter value={totalScore} /> <span className="text-sm text-gray-500 font-normal">/ {maxScore}</span></div>
              </div>
            </div>
            <div className="bg-black/30 p-4 rounded-xl border border-white/5 flex items-center gap-4">
              <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-lg"><Award size={20} /></div>
              <div>
                <p className="text-sm text-gray-400">Percentage</p>
                <div className="text-xl font-bold"><AnimatedCounter value={percentage} />%</div>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass-panel rounded-2xl overflow-hidden"
      >
        <div className="p-5 border-b border-white/5 flex items-center gap-2">
          <BookOpen size={18} className="text-blue-400" />
          <h3 className="font-semibold text-lg hover:text-blue-400 transition-colors">Subject Performance</h3>
        </div>
        
        <div className="p-5">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeExam}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                  {loading ? (
                    <div className="space-y-4">
                      {[1,2,3].map(i => <div key={i} className="h-16 bg-white/5 animate-pulse rounded-lg"></div>)}
                    </div>
                  ) : marks.length === 0 ? (
                      <div className="text-center py-10 text-gray-400 flex flex-col items-center gap-2">
                          <AlertCircle size={32} className="opacity-50"/>
                          No marks published yet.
                      </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="text-sm text-gray-400 uppercase tracking-wider border-b border-white/10">
                            <th className="pb-3 px-4">Subject ID</th>
                            <th className="pb-3 px-4">Subject Name</th>
                            <th className="pb-3 px-4 text-center">Max Marks</th>
                            <th className="pb-3 px-4 text-right">Scored</th>
                          </tr>
                        </thead>
                        <tbody>
                          {marks.map((mark, index) => (
                            <motion.tr 
                              key={mark.id} 
                              initial={{ opacity: 0, y: 10 }} 
                              animate={{ opacity: 1, y: 0 }} 
                              transition={{ delay: index * 0.05 }}
                              className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                            >
                              <td className="py-4 px-4 text-gray-300 font-medium">{mark.subject?.subjectId}</td>
                              <td className="py-4 px-4 text-white">{mark.subject?.subjectName}</td>
                              <td className="py-4 px-4 text-center text-gray-500">60</td>
                              <td className="py-4 px-4 text-right">
                                <MarkDisplay mark={mark[activeMarksField]} />
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
              </motion.div>
            </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default StudentDashboard;
