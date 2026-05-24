import { useState } from 'react';
import AssessmentScreen from './components/AssessmentScreen.jsx';
import LandingScreen from './components/LandingScreen.jsx';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('landing');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(14).fill(null));

  const startAssessment = () => {
    setCurrentScreen('assessment');
    setCurrentQuestionIndex(0);
  };

  const goBack = () => {
    if (currentScreen !== 'assessment') {
      return;
    }

    if (currentQuestionIndex === 0) {
      setCurrentScreen('landing');
      return;
    }

    setCurrentQuestionIndex((index) => index - 1);
  };

  const handleAnswer = (value) => {
    setAnswers((previousAnswers) => {
      const nextAnswers = [...previousAnswers];
      nextAnswers[currentQuestionIndex] = value;
      return nextAnswers;
    });
  };

  const advanceQuestion = () => {
    setCurrentQuestionIndex((index) => index + 1);
  };

  if (currentScreen === 'assessment') {
    return (
      <AssessmentScreen
        answers={answers}
        currentQuestionIndex={currentQuestionIndex}
        onAnswer={handleAnswer}
        onBack={goBack}
        onAdvance={advanceQuestion}
      />
    );
  }

  return <LandingScreen onStartScan={startAssessment} />;
}
