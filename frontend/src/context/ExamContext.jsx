import React, { createContext, useState } from 'react';

export const ExamContext = createContext();

export const ExamProvider = ({ children }) => {
  const [activeExam, setActiveExam] = useState('CT1');

  const toggleExam = () => {
    setActiveExam(prev => prev === 'CT1' ? 'CT2' : 'CT1');
  };

  return (
    <ExamContext.Provider value={{ activeExam, toggleExam }}>
      {children}
    </ExamContext.Provider>
  );
};
