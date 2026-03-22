import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axiosConfig';
import { motion } from 'framer-motion';
import { User, Mail, Building2, Calendar, Hash, BookOpen, Shield } from 'lucide-react';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile');
        setProfile(res.data);
      } catch (err) {
        console.error('Profile fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-48 bg-white/5 rounded-2xl"></div>
        <div className="h-32 bg-white/5 rounded-2xl"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="glass-panel p-8 rounded-2xl text-center text-gray-400">
        <User size={48} className="mx-auto mb-4 opacity-50" />
        <p>Could not load profile data.</p>
      </div>
    );
  }

  const isStudent = user?.role === 'STUDENT';

  const fields = isStudent
    ? [
        { icon: User, label: 'Name', value: profile.name },
        { icon: Hash, label: 'Register Number', value: profile.regNo },
        { icon: Building2, label: 'Department', value: profile.department },
        { icon: BookOpen, label: 'Year', value: profile.year },
        { icon: Shield, label: 'Section', value: profile.classSection },
        { icon: Calendar, label: 'Date of Birth', value: profile.dob },
      ]
    : [
        { icon: User, label: 'Name', value: profile.name },
        { icon: Hash, label: 'Employee ID', value: profile.empId },
        { icon: Building2, label: 'Department', value: profile.department },
        { icon: Shield, label: 'Role', value: profile.role },
        { icon: Calendar, label: 'Date of Birth', value: profile.dob },
      ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8 rounded-2xl overflow-hidden relative"
      >
        <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none"></div>

        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-3xl font-bold shadow-lg shadow-purple-500/20">
            {profile.name?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{profile.name || 'Unknown'}</h2>
            <p className="text-gray-400 mt-1">
              {isStudent ? `${profile.department} • Year ${profile.year}` : `${profile.role} • ${profile.department}`}
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-panel p-6 rounded-2xl"
      >
        <h3 className="text-lg font-semibold mb-6 text-gray-200">Profile Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((field, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * index }}
              className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
            >
              <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
                <field.icon size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">{field.label}</p>
                <p className="text-white font-medium">{field.value || '-'}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
