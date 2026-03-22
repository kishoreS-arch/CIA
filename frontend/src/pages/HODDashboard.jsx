import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ExamContext } from '../context/ExamContext';
import api from '../api/axiosConfig';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Award, Users, AlertTriangle, Trophy } from 'lucide-react';

const HODDashboard = () => {
  const { user } = useContext(AuthContext);
  const { activeExam } = useContext(ExamContext);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ totalStudents: 0, passCount: 0, failCount: 0, passPercentage: 0 });
  const [subjectAvgs, setSubjectAvgs] = useState([]);
  const [toppers, setToppers] = useState([]);
  const [failures, setFailures] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [summaryRes, avgRes, toppersRes, failuresRes] = await Promise.all([
          api.get(`/analytics/summary?exam=${activeExam}`),
          api.get(`/analytics/subject-averages?exam=${activeExam}`),
          api.get(`/analytics/toppers?exam=${activeExam}&limit=5`),
          api.get(`/analytics/failures?exam=${activeExam}`)
        ]);
        setSummary(summaryRes.data);
        setSubjectAvgs(avgRes.data);
        setToppers(toppersRes.data);
        setFailures(failuresRes.data);
      } catch (err) {
        console.error('HOD Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeExam]);

  const stats = [
    { title: 'Total Students', value: loading ? '...' : summary.totalStudents, icon: Users, color: 'blue' },
    { title: 'Pass %', value: loading ? '...' : `${summary.passPercentage}%`, icon: TrendingUp, color: 'emerald' },
    { title: 'Failures', value: loading ? '...' : summary.failCount, icon: AlertTriangle, color: 'red' }
  ];

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden relative"
      >
        <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-emerald-500/10 to-transparent pointer-events-none"></div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-2">HOD Analytics Dashboard</h2>
          <p className="text-gray-400">High-level insights across all classes for <span className="text-blue-400 font-bold">{activeExam}</span>.</p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} 
            className="glass-panel p-6 rounded-2xl flex items-center gap-4 group"
          >
            <div className={`p-4 rounded-xl bg-gray-800 text-${stat.color}-400 group-hover:bg-${stat.color}-500/20 transition-colors`}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">{stat.title}</p>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Subject Performance Chart */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="glass-panel p-6 rounded-2xl"
      >
        <div className="flex items-center gap-2 mb-6 text-gray-300">
          <BarChart3 size={20} className="text-blue-400" />
          <h3 className="font-semibold text-lg">Subject Performance Overview – {activeExam}</h3>
        </div>
        
        {loading ? (
          <div className="h-64 flex items-center justify-center text-gray-500">Loading chart data...</div>
        ) : subjectAvgs.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-gray-500">No subject data available.</div>
        ) : (
          <div className="h-64 flex items-end justify-around gap-2 px-4 pb-4 border-b border-white/10 relative">
            <div className="absolute left-0 bottom-4 w-full h-[1px] bg-white/5 border-dashed"></div>
            <div className="absolute left-0 bottom-1/2 w-full h-[1px] bg-white/5 border-dashed"></div>
            
            {subjectAvgs.map((sub, i) => {
              const heightPercent = Math.round((sub.average / sub.maxScore) * 100);
              return (
                <div key={i} className="flex flex-col items-center gap-2 z-10 w-full">
                  <motion.div 
                    initial={{ height: 0 }} 
                    animate={{ height: `${heightPercent}%` }} 
                    transition={{ duration: 1, delay: 0.5 + (i * 0.1), type: "spring" }}
                    className="w-full max-w-16 bg-gradient-to-t from-emerald-600 to-cyan-400 rounded-t-lg shadow-lg shadow-emerald-500/20 relative group hover:from-emerald-500 hover:to-cyan-300 transition-colors"
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Avg: {sub.average}
                    </div>
                  </motion.div>
                  <span className="text-xs text-gray-400">{sub.subjectId}</span>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Toppers */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-panel rounded-2xl overflow-hidden">
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
                  <th className="pb-3 px-4 text-right">Total</th>
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

      {/* Failures */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-panel rounded-2xl overflow-hidden">
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

export default HODDashboard;
