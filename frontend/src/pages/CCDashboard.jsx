import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ExamContext } from '../context/ExamContext';
import api from '../api/axiosConfig';
import { motion, AnimatePresence } from 'framer-motion';
import { FileDown, Users, AlertTriangle, TrendingUp, Trophy, BookOpen } from 'lucide-react';

const CCDashboard = () => {
  const { user } = useContext(AuthContext);
  const { activeExam } = useContext(ExamContext);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ totalStudents: 0, failCount: 0, passPercentage: 0 });
  const [toppers, setToppers] = useState([]);
  const [failures, setFailures] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [summaryRes, toppersRes, failuresRes] = await Promise.all([
          api.get(`/analytics/summary?exam=${activeExam}`),
          api.get(`/analytics/toppers?exam=${activeExam}&limit=5`),
          api.get(`/analytics/failures?exam=${activeExam}`)
        ]);
        setSummary(summaryRes.data);
        setToppers(toppersRes.data);
        setFailures(failuresRes.data);
      } catch (err) {
        console.error('CC Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeExam]);

  const handleExport = async (format) => {
    try {
      const res = await api.get('/export/report', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report.${format}`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error('Export failed', err);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden relative"
      >
        <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-orange-500/10 to-transparent pointer-events-none"></div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-2">Class Coordinator (CC) Operations</h2>
          <p className="text-gray-400">View rankings and filter failure lists for <span className="text-blue-400 font-bold">{activeExam}</span>.</p>
        </div>
        <div className="flex gap-3 z-10">
          <button onClick={() => handleExport('pdf')} className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-red-500/20 active:scale-95">
            <FileDown size={16} /> Export PDF
          </button>
          <button onClick={() => handleExport('docx')} className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-500/20 active:scale-95">
            <FileDown size={16} /> Export DOCX
          </button>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/20 text-blue-400 rounded-lg"><Users size={24} /></div>
            <h3 className="font-semibold text-gray-300">Total Students</h3>
          </div>
          <div className="text-3xl font-bold cursor-default hover:scale-105 transition-transform origin-left">
            {loading ? <div className="h-9 w-16 bg-white/10 animate-pulse rounded"></div> : summary.totalStudents}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel p-6 rounded-2xl border-red-500/20 bg-red-950/10 hover:bg-red-950/20 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-500/20 text-red-400 rounded-lg"><AlertTriangle size={24} /></div>
            <h3 className="font-semibold text-gray-300">Failures</h3>
          </div>
          <div className="text-3xl font-bold text-red-500 cursor-default hover:scale-105 transition-transform origin-left">
            {loading ? <div className="h-9 w-16 bg-white/10 animate-pulse rounded"></div> : summary.failCount}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-panel p-6 rounded-2xl border-emerald-500/20 bg-emerald-950/10 hover:bg-emerald-950/20 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-lg"><TrendingUp size={24} /></div>
            <h3 className="font-semibold text-gray-300">Pass Percentage</h3>
          </div>
          <div className="text-3xl font-bold text-emerald-400 cursor-default hover:scale-105 transition-transform origin-left">
            {loading ? <div className="h-9 w-16 bg-white/10 animate-pulse rounded"></div> : `${summary.passPercentage}%`}
          </div>
        </motion.div>
      </div>

      {/* Toppers Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-panel rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-white/5 flex items-center gap-2">
          <Trophy size={18} className="text-yellow-400" />
          <h3 className="font-semibold text-lg">Top Performers – {activeExam}</h3>
        </div>
        <div className="p-5">
          {loading ? (
            <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-12 bg-white/5 animate-pulse rounded-lg"></div>)}</div>
          ) : toppers.length === 0 ? (
            <p className="text-center text-gray-500 py-6">No data available.</p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-sm text-gray-400 uppercase tracking-wider border-b border-white/10">
                  <th className="pb-3 px-4">#</th>
                  <th className="pb-3 px-4">Name</th>
                  <th className="pb-3 px-4">Reg No</th>
                  <th className="pb-3 px-4 text-right">Total Marks</th>
                </tr>
              </thead>
              <tbody>
                {toppers.map((t, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 text-gray-500">{i + 1}</td>
                    <td className="py-3 px-4 text-white font-medium">{t.name}</td>
                    <td className="py-3 px-4 text-gray-300">{t.regNo}</td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-400">{t.totalMarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>

      {/* Failures Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-panel rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-white/5 flex items-center gap-2">
          <AlertTriangle size={18} className="text-red-400" />
          <h3 className="font-semibold text-lg">Failure List – {activeExam}</h3>
        </div>
        <div className="p-5">
          {loading ? (
            <div className="space-y-3">{[1,2].map(i => <div key={i} className="h-12 bg-white/5 animate-pulse rounded-lg"></div>)}</div>
          ) : failures.length === 0 ? (
            <p className="text-center text-gray-500 py-6">No failures! 🎉</p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-sm text-gray-400 uppercase tracking-wider border-b border-white/10">
                  <th className="pb-3 px-4">Name</th>
                  <th className="pb-3 px-4">Reg No</th>
                  <th className="pb-3 px-4">Subject</th>
                  <th className="pb-3 px-4 text-right">Marks</th>
                </tr>
              </thead>
              <tbody>
                {failures.map((f, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-red-500/5 transition-colors">
                    <td className="py-3 px-4 text-white">{f.name}</td>
                    <td className="py-3 px-4 text-gray-300">{f.regNo}</td>
                    <td className="py-3 px-4 text-gray-400">{f.subjectName}</td>
                    <td className="py-3 px-4 text-right font-bold text-red-400">{f.marks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CCDashboard;
