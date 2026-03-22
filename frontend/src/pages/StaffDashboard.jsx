import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ExamContext } from '../context/ExamContext';
import api from '../api/axiosConfig';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, Save, CheckCircle, AlertCircle } from 'lucide-react';

const Toast = ({ message, type, onClose }) => (
  <motion.div 
    initial={{ opacity: 0, y: 50, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 20, scale: 0.9 }}
    className={`fixed bottom-6 right-6 flex items-center gap-2 px-4 py-3 rounded-xl shadow-2xl z-50 border ${
      type === 'success' ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-400 text-sm font-medium' :
      'bg-red-950/90 border-red-500/50 text-red-400 text-sm font-medium'
    }`}
  >
    {type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
    {message}
  </motion.div>
);

const StaffDashboard = () => {
  const { user } = useContext(AuthContext);
  const { activeExam } = useContext(ExamContext);
  const [studentId, setStudentId] = useState('CS2024001');
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savingMarks, setSavingMarks] = useState({});
  const [toast, setToast] = useState(null);

  const fetchMarks = async (e) => {
    if (e) e.preventDefault();
    if (!studentId) return;
    
    setLoading(true);
    try {
      const res = await api.get(`/marks/${studentId}`);
      setMarks(res.data);
    } catch (err) {
      showToast('Error fetching student', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarks();
  }, []);

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleMarkChange = (markId, value) => {
    setMarks(prev => prev.map(m => {
      if (m.id === markId) {
        if (activeExam === 'CT1') {
          return { ...m, ct1Marks: value === '' ? null : parseInt(value) };
        } else {
          return { ...m, ct2Marks: value === '' ? null : parseInt(value) };
        }
      }
      return m;
    }));
  };

  const saveMark = async (mark) => {
    setSavingMarks(prev => ({ ...prev, [mark.id]: true }));
    try {
      await api.put('/marks/update', {
        studentId: studentId,
        subjectId: mark.subject.subjectId,
        exam: activeExam,
        marks: activeExam === 'CT1' ? mark.ct1Marks : mark.ct2Marks
      });
      showToast('Marks updated successfully', 'success');
    } catch (err) {
      showToast(err.response?.data || 'Failed to update marks', 'error');
    } finally {
      setSavingMarks(prev => ({ ...prev, [mark.id]: false }));
    }
  };

  const activeMarksField = activeExam === 'CT1' ? 'ct1Marks' : 'ct2Marks';

  return (
    <div className="space-y-6 relative">
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden relative"
      >
        <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-purple-500/10 to-transparent pointer-events-none"></div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-2">Staff Operations</h2>
          <p className="text-gray-400">Manage internal marks for <span className="text-blue-400 font-bold">{activeExam}</span>.</p>
        </div>
        
        <form onSubmit={fetchMarks} className="flex gap-2 w-full md:w-auto z-10">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="Enter Student Reg No"
              className="w-full bg-black/30 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
            />
          </div>
          <button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Fetch
          </button>
        </form>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass-panel rounded-2xl overflow-hidden"
      >
        <div className="p-5 border-b border-white/5 flex items-center gap-2">
          <Users size={18} className="text-blue-400" />
          <h3 className="font-semibold text-lg hover:text-blue-400 transition-colors">Student Grades</h3>
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
                      {[1,2].map(i => <div key={i} className="h-16 bg-white/5 animate-pulse rounded-lg"></div>)}
                    </div>
                  ) : marks.length === 0 ? (
                      <div className="text-center py-10 text-gray-400">
                          Search for a student to view and edit marks.
                      </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="text-sm text-gray-400 uppercase tracking-wider border-b border-white/10">
                            <th className="pb-3 px-4">Subject ID</th>
                            <th className="pb-3 px-4">Subject Name</th>
                            <th className="pb-3 px-4 text-center">Marks (out of 60)</th>
                            <th className="pb-3 px-4 text-right">Action</th>
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
                              <td className="py-4 px-4 text-gray-300 font-medium">{mark.subject.subjectId}</td>
                              <td className="py-4 px-4 text-white">{mark.subject.subjectName}</td>
                              <td className="py-4 px-4 text-center">
                                <input 
                                  type="number"
                                  min="0" max="60"
                                  value={mark[activeMarksField] === null ? '' : mark[activeMarksField]}
                                  onChange={(e) => handleMarkChange(mark.id, e.target.value)}
                                  className="w-20 text-center bg-black/30 border border-white/10 rounded px-2 py-1 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:border-white/30 transition-all font-bold"
                                />
                              </td>
                              <td className="py-4 px-4 text-right">
                                <button 
                                  onClick={() => saveMark(mark)}
                                  disabled={savingMarks[mark.id]}
                                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-all shadow-lg active:scale-95"
                                >
                                  {savingMarks[mark.id] ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                  ) : (
                                    <><Save size={14} /> Save</>
                                  )}
                                </button>
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

export default StaffDashboard;
