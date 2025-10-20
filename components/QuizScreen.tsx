import React, { useState, useEffect } from 'react';
import { Question, Topic, Difficulty, Language } from '../types';
import { STRINGS, QUESTIONS_PER_BLOCK, QUESTION_TIME_LIMIT } from '../constants';

interface QuizScreenProps {
  questions: Question[];
  topic: Topic;
  difficulty: Difficulty;
  totalScore: number;
  onComplete: (answers: boolean[]) => void;
  language: Language;
}

const QuizScreen: React.FC<QuizScreenProps> = ({ questions, topic, difficulty, totalScore, onComplete, language }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_LIMIT);

  const strings = STRINGS[language];
  const currentQuestion = questions[currentQuestionIndex];

  // Reset state and timer for new questions/topic
  useEffect(() => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setIsAnswered(false);
    setTimeLeft(QUESTION_TIME_LIMIT);
  }, [questions]);

  // Timer countdown logic
  useEffect(() => {
    if (isAnswered) return;

    if (timeLeft <= 0) {
      // Time's up! Handle as incorrect answer
      setIsAnswered(true);
      setSelectedAnswer(null); // No answer was selected
      setAnswers(prev => [...prev, false]);
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, isAnswered, answers]);
  
  // Reset timer for each new question
  useEffect(() => {
     setTimeLeft(QUESTION_TIME_LIMIT);
  }, [currentQuestionIndex]);


  const handleAnswerSelect = (index: number) => {
    if (isAnswered) return;

    setIsAnswered(true);
    setSelectedAnswer(index);
    const isCorrect = index === currentQuestion.correctAnswerIndex;
    setAnswers([...answers, isCorrect]);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      // Timer will be reset by the useEffect watching currentQuestionIndex
    } else {
      onComplete(answers);
    }
  };

  const getButtonClass = (index: number) => {
    if (!isAnswered) {
      return 'bg-white hover:bg-stone-100';
    }
    if (index === currentQuestion.correctAnswerIndex) {
      return 'bg-green-200 border-green-400';
    }
    if (index === selectedAnswer) {
      return 'bg-red-200 border-red-400';
    }
    return 'bg-stone-100 text-stone-500';
  };

  const getTimerBarColor = () => {
    const percentage = (timeLeft / QUESTION_TIME_LIMIT) * 100;
    if (percentage > 50) return 'bg-green-500';
    if (percentage > 25) return 'bg-yellow-500';
    return 'bg-red-500';
  }

  if (!currentQuestion) {
    return null;
  }

  return (
    <div className="flex flex-col items-center p-4 w-full max-w-3xl mx-auto">
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-stone-200 w-full">
        <div className="flex justify-between items-center mb-2 text-stone-600">
          <div className="text-left">
            <p className="text-sm font-semibold uppercase tracking-wider">{strings.topic}</p>
            <p className="text-lg font-bold text-amber-800">{topic.id}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold uppercase tracking-wider">{strings.score}</p>
            <p className="text-lg font-bold text-amber-800">{totalScore}</p>
          </div>
        </div>
        
        <div className="mb-4">
            <div className="flex justify-between items-center text-sm font-semibold text-stone-600 mb-1">
                <span>{strings.question} {currentQuestionIndex + 1} / {QUESTIONS_PER_BLOCK}</span>
                <span>{strings.timeLeft}: {timeLeft}s</span>
            </div>
            <div className="w-full bg-stone-200 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full transition-all duration-500 ${getTimerBarColor()}`} 
                style={{ width: `${(timeLeft / QUESTION_TIME_LIMIT) * 100}%` }}>
              </div>
            </div>
        </div>
        
        <div className="text-center mb-6 min-h-[100px] flex items-center justify-center">
          <h3 className="text-2xl md:text-3xl font-serif text-stone-800">
            {currentQuestion.question}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={isAnswered}
              className={`p-4 rounded-lg text-lg text-left border-2 transition-all duration-200 ${getButtonClass(index)} ${!isAnswered ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <span className="font-semibold mr-2">{String.fromCharCode(65 + index)}.</span>
              {option}
            </button>
          ))}
        </div>

        {isAnswered && (
          <div className="text-center mt-8">
            <button
              onClick={handleNextQuestion}
              className="bg-amber-700 text-white font-bold py-3 px-12 rounded-full hover:bg-amber-800 transition-transform transform hover:scale-105 shadow-lg"
            >
              {currentQuestionIndex < questions.length - 1 ? strings.nextQuestion : strings.viewResults}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizScreen;