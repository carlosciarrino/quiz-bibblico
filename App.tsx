import React, { useState, useEffect, useCallback } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import TopicSelectionScreen from './components/TopicSelectionScreen';
import QuizScreen from './components/QuizScreen';
import ResultsScreen from './components/ResultsScreen';
import HistoryScreen from './components/HistoryScreen';
import Spinner from './components/Spinner';
import { generateQuestions } from './services/geminiService';
import { Question, Difficulty, Topic, GameResult, Language } from './types';
import { TOPICS, QUESTIONS_PER_BLOCK, DIFFICULTY_LEVELS, STRINGS } from './constants';

type GameState = 'welcome' | 'topic' | 'quiz' | 'results' | 'history';

const App: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>('welcome');
    const [language, setLanguage] = useState<Language>('it');
    const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
    const [difficulty, setDifficulty] = useState<Difficulty>('medium');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [totalScore, setTotalScore] = useState(0);
    const [gameHistory, setGameHistory] = useState<GameResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [difficultyChangeMessage, setDifficultyChangeMessage] = useState<string | null>(null);
    const [currentBlockCorrectCount, setCurrentBlockCorrectCount] = useState(0);
    const [currentBlockScore, setCurrentBlockScore] = useState(0);

    // Load history from local storage on startup
    useEffect(() => {
        try {
            const storedHistory = localStorage.getItem('bibleQuizHistory');
            if (storedHistory) {
                setGameHistory(JSON.parse(storedHistory));
            }
        } catch (error) {
            console.error("Failed to load game history from local storage:", error);
        }
    }, []);

    // Save history to local storage whenever it changes
    useEffect(() => {
        try {
            localStorage.setItem('bibleQuizHistory', JSON.stringify(gameHistory));
        } catch (error) {
            console.error("Failed to save game history to local storage:", error);
        }
    }, [gameHistory]);

    const handleLanguageSelect = (lang: Language) => {
        setLanguage(lang);
        setGameState('topic');
    };

    const fetchQuestions = useCallback(async (topic: Topic, diff: Difficulty) => {
        setIsLoading(true);
        setDifficultyChangeMessage(null);
        try {
            const newQuestions = await generateQuestions(topic.id, diff, language);
            if (newQuestions.length < QUESTIONS_PER_BLOCK) {
                throw new Error(`API returned only ${newQuestions.length} questions, expected ${QUESTIONS_PER_BLOCK}.`);
            }
            setQuestions(newQuestions);
            setGameState('quiz');
        } catch (error) {
            console.error("Failed to fetch questions:", error);
            alert(`Error generating questions. Please try again. Details: ${error instanceof Error ? error.message : String(error)}`);
            setGameState('topic'); // Go back to topic selection on error
        } finally {
            setIsLoading(false);
        }
    }, [language]);

    const handleTopicSelect = (topic: Topic) => {
        setSelectedTopic(topic);
        setTotalScore(0); // Reset score for new topic
        fetchQuestions(topic, difficulty);
    };

    const handleQuizComplete = (answers: boolean[]) => {
        const correctCount = answers.filter(Boolean).length;
        const blockScore = correctCount * 10 * (DIFFICULTY_LEVELS.indexOf(difficulty) + 1);
        const newTotalScore = totalScore + blockScore;

        setCurrentBlockCorrectCount(correctCount);
        setCurrentBlockScore(blockScore);
        setTotalScore(newTotalScore);
        
        // Save game result
        const newResult: GameResult = {
            topic: selectedTopic!.id,
            score: blockScore,
            correct: correctCount,
            total: QUESTIONS_PER_BLOCK,
            difficulty,
            date: new Date().toISOString(),
        };
        setGameHistory(prev => [newResult, ...prev]);

        // Adjust difficulty
        const currentDifficultyIndex = DIFFICULTY_LEVELS.indexOf(difficulty);
        let nextDifficulty = difficulty;
        let message: string | null = null;

        if ((correctCount === 3 || correctCount === 4) && currentDifficultyIndex < DIFFICULTY_LEVELS.length - 1) {
            nextDifficulty = DIFFICULTY_LEVELS[currentDifficultyIndex + 1];
            message = STRINGS[language].difficultyIncreased;
        } else if ((correctCount === 0 || correctCount === 1) && currentDifficultyIndex > 0) {
            nextDifficulty = DIFFICULTY_LEVELS[currentDifficultyIndex - 1];
            message = STRINGS[language].difficultyDecreased;
        }
        
        setDifficulty(nextDifficulty);
        setDifficultyChangeMessage(message);

        setGameState('results');
    };
    
    const handlePlayAgain = () => {
        if (selectedTopic) {
            fetchQuestions(selectedTopic, difficulty);
        }
    };
    
    const handleBackToTopics = () => {
        setGameState('topic');
    };
    
    const handleViewHistory = () => {
        setGameState('history');
    };

    const handleClearHistory = () => {
        setGameHistory([]);
    };
    
    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center text-center p-4">
                    <Spinner />
                    <p className="text-xl text-stone-600 mt-4">{STRINGS[language].loading}</p>
                </div>
            );
        }
        
        switch (gameState) {
            case 'welcome':
                return <WelcomeScreen onLanguageSelect={handleLanguageSelect} language={language} />;
            case 'topic':
                return (
                    <div>
                        <TopicSelectionScreen 
                            topics={TOPICS} 
                            onTopicSelect={handleTopicSelect} 
                            language={language}
                            difficulty={difficulty}
                            onDifficultyChange={setDifficulty}
                        />
                        <div className="text-center mt-8">
                            <button onClick={handleViewHistory} className="bg-stone-200 text-stone-700 font-bold py-2 px-6 rounded-full hover:bg-stone-300 transition-colors">
                                {STRINGS[language].viewHistory}
                            </button>
                        </div>
                    </div>
                );
            case 'quiz':
                return <QuizScreen 
                            questions={questions} 
                            topic={selectedTopic!}
                            difficulty={difficulty}
                            totalScore={totalScore}
                            onComplete={handleQuizComplete} 
                            language={language}
                        />;
            case 'results':
                return (
                    <div>
                        <ResultsScreen 
                            topic={selectedTopic!} 
                            correctCount={currentBlockCorrectCount} 
                            blockScore={currentBlockScore}
                            totalScore={totalScore}
                            onPlayAgain={handlePlayAgain}
                            language={language}
                            difficultyChangeMessage={difficultyChangeMessage}
                        />
                         <div className="flex justify-center space-x-4 mt-4">
                             <button onClick={handleBackToTopics} className="bg-stone-200 text-stone-700 font-bold py-2 px-6 rounded-full hover:bg-stone-300 transition-colors">
                                 {STRINGS[language].backToTopics}
                             </button>
                             <button onClick={handleViewHistory} className="bg-stone-200 text-stone-700 font-bold py-2 px-6 rounded-full hover:bg-stone-300 transition-colors">
                                 {STRINGS[language].viewHistory}
                             </button>
                         </div>
                    </div>
                );
            case 'history':
                return <HistoryScreen 
                            history={gameHistory} 
                            onBack={handleBackToTopics}
                            onClearHistory={handleClearHistory} 
                            language={language}
                        />;
            default:
                return <WelcomeScreen onLanguageSelect={handleLanguageSelect} language={language} />;
        }
    };

    return (
        <div className="bg-amber-50 min-h-screen w-full flex items-center justify-center font-sans relative overflow-hidden p-4">
             <div 
                className="absolute inset-0 bg-repeat bg-center opacity-10" 
                style={{backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a16207' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`}}>
            </div>
            <main className="container mx-auto z-10">
                {renderContent()}
            </main>
        </div>
    );
};

export default App;