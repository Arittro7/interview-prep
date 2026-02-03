/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/set-state-in-effect */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const InterviewContext = createContext();

export const useInterview = () => {
  const context = useContext(InterviewContext);
  if (!context) {
    throw new Error('useInterview must be used within an InterviewProvider');
  }
  return context;
};

export const InterviewProvider = ({ children }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [markedQuestions, setMarkedQuestions] = useState([]);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Load questions from Supabase once on mount
  useEffect(() => {
    const fetchQuestions = async () => {
      const { data, error } = await supabase.from('questions').select('*');
      if (error) {
        console.error('Error fetching questions:', error);
      } else {
        setQuestions(data || []);
      }
    };

    fetchQuestions();

    // Load persisted marked questions
    const storedMarked = localStorage.getItem('markedQuestions');
    if (storedMarked) {
      try {
        setMarkedQuestions(JSON.parse(storedMarked));
      } catch (e) {
        console.error('Failed to parse marked questions from localStorage', e);
      }
    }
  }, []);

  // Timer logic (counts up while interview is active)
  useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  // Derived: all available tags from current questions pool
  const allTags = [...new Set(questions.flatMap((q) => q.tags || []))].sort();

  // Start interview – fetch fresh questions
  const startInterview = async (tags = []) => {
    setSelectedTags(tags); // remember selection

    let query = supabase.from('questions').select('*');

    if (tags.length > 0) {
      query = query.contains('tags', tags);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching questions for interview:', error);
      return;
    }

    if (!data || data.length === 0) {
      console.warn('No questions found for selected tags or in database');
    }

    // Shuffle for random order
    const shuffled = [...(data || [])].sort(() => Math.random() - 0.5);

    setQuestions(shuffled);
    setCurrentQuestionIndex(0);
    setIsInterviewStarted(true);
    setIsTimerRunning(true);
    setTimer(0);
  };
  // End interview – cleanup
  const endInterview = () => {
    setIsInterviewStarted(false);
    setIsTimerRunning(false);
    setTimer(0);
  };

  // Navigation between questions
  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      endInterview();
    }
  };

  // Mark / unmark question for review
  const toggleMarkQuestion = (id) => {
    setMarkedQuestions((prev) => {
      const newMarked = prev.includes(id)
        ? prev.filter((qId) => qId !== id)
        : [...prev, id];

      // Persist to localStorage
      localStorage.setItem('markedQuestions', JSON.stringify(newMarked));
      return newMarked;
    });
  };

  // Exposed context value
  const value = {
    // State
    questions,
    currentQuestion: questions[currentQuestionIndex],
    currentQuestionIndex,
    totalQuestions: questions.length,
    isInterviewStarted,
    selectedTags,
    allTags,
    markedQuestions,
    timer,

    // Actions
    setSelectedTags,
    startInterview,
    endInterview,
    nextQuestion,
    toggleMarkQuestion,
  };

  return (
    <InterviewContext.Provider value={value}>
      {children}
    </InterviewContext.Provider>
  );
};