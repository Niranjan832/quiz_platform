import React, { useState } from 'react';
import { Plus, Trash2, Play, Home, CheckCircle } from 'lucide-react';
import './App.css';

export default function QuizPlatform() {
  const [view, setView] = useState('home');
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);

  const [newQuestion, setNewQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0
  });

  const handleAddQuestion = () => {
    if (newQuestion.question && newQuestion.options.every(opt => opt.trim())) {
      setQuestions([...questions, { ...newQuestion }]);
      setNewQuestion({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0
      });
    }
  };

  const handleDeleteQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleAnswerClick = (selectedIndex) => {
    const correct = selectedIndex === questions[currentQuestion].correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      setScore(score + 1);
    }

    setTimeout(() => {
      setShowFeedback(false);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setQuizComplete(true);
      }
    }, 2000);
  };

  const startQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setQuizComplete(false);
    setView('quiz');
  };

  const resetQuiz = () => {
    setView('home');
    setCurrentQuestion(0);
    setScore(0);
    setQuizComplete(false);
  };

  if (view === 'home') {
    return (
      <div className="container home-view">
        <div className="header">
          <h1 className="title">🌈 Fun Quiz Time! 🌟</h1>
          <p className="subtitle">Create your own quiz or start playing</p>
        </div>

        <div className="button-group">
          <button 
            className="nav-button create-btn"
            onClick={() => setView('create')}
          >
            <Plus size={24} />
            Create Questions
          </button>
          <button 
            className="nav-button play-btn"
            onClick={startQuiz}
            disabled={questions.length === 0}
          >
            <Play size={24} />
            Start Quiz ({questions.length} questions)
          </button>
        </div>

        {questions.length > 0 && (
          <div className="questions-preview">
            <h3>Your Questions:</h3>
            {questions.map((q, idx) => (
              <div key={idx} className="question-preview-item">
                <span>{idx + 1}. {q.question}</span>
                <button 
                  className="delete-btn-small"
                  onClick={() => handleDeleteQuestion(idx)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (view === 'create') {
    return (
      <div className="container create-view">
        <div className="header">
          <h1 className="title">Create Your Questions ✨</h1>
          <button className="back-btn" onClick={() => setView('home')}>
            <Home size={20} />
            Back to Home
          </button>
        </div>

        <div className="question-form">
          <div className="form-group">
            <label>Question:</label>
            <input
              type="text"
              className="input-field"
              placeholder="Type your question here..."
              value={newQuestion.question}
              onChange={(e) => setNewQuestion({...newQuestion, question: e.target.value})}
            />
          </div>

          <div className="options-grid">
            {newQuestion.options.map((option, idx) => (
              <div key={idx} className="form-group">
                <label>Option {idx + 1}:</label>
                <div className="option-input-group">
                  <input
                    type="text"
                    className="input-field"
                    placeholder={`Option ${idx + 1}`}
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...newQuestion.options];
                      newOptions[idx] = e.target.value;
                      setNewQuestion({...newQuestion, options: newOptions});
                    }}
                  />
                  <input
                    type="radio"
                    name="correct"
                    checked={newQuestion.correctAnswer === idx}
                    onChange={() => setNewQuestion({...newQuestion, correctAnswer: idx})}
                    className="radio-input"
                  />
                  <span className="radio-label">Correct</span>
                </div>
              </div>
            ))}
          </div>

          <button className="add-question-btn" onClick={handleAddQuestion}>
            <Plus size={20} />
            Add Question
          </button>
        </div>

        <div className="added-questions">
          <h3>Added Questions ({questions.length}):</h3>
          {questions.map((q, idx) => (
            <div key={idx} className="added-question-card">
              <div className="question-header">
                <span className="question-number">Q{idx + 1}</span>
                <h4>{q.question}</h4>
                <button 
                  className="delete-btn"
                  onClick={() => handleDeleteQuestion(idx)}
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <div className="options-list">
                {q.options.map((opt, i) => (
                  <div 
                    key={i} 
                    className={`option-item ${i === q.correctAnswer ? 'correct-option' : ''}`}
                  >
                    {opt}
                    {i === q.correctAnswer && <CheckCircle size={16} />}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (view === 'quiz') {
    if (quizComplete) {
      return (
        <div className="container results-view">
          <div className="results-card">
            <h1 className="results-title">🎉 Amazing Job! 🎉</h1>
            <div className="score-display">
              <p className="score-text">You got</p>
              <p className="score-number">{score}</p>
              <p className="score-text">out of {questions.length}</p>
            </div>
            <div className="results-percentage">
              <div 
                className="percentage-bar"
                style={{width: `${(score/questions.length)*100}%`}}
              />
            </div>
            <button className="home-btn" onClick={resetQuiz}>
              <Home size={20} />
              Back to Home
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className={`container quiz-view ${showFeedback ? (isCorrect ? 'correct-feedback' : 'neutral-feedback') : ''}`}>
        <div className="quiz-header">
          <button className="exit-btn" onClick={resetQuiz}>
            <Home size={18} />
          </button>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{width: `${((currentQuestion + 1) / questions.length) * 100}%`}}
            />
          </div>
          <span className="question-counter">
            {currentQuestion + 1} / {questions.length}
          </span>
        </div>

        <div className="quiz-content">
          <h2 className="quiz-question">{questions[currentQuestion].question}</h2>
          
          <div className="answer-options">
            {questions[currentQuestion].options.map((option, idx) => (
              <button
                key={idx}
                className="answer-btn"
                onClick={() => handleAnswerClick(idx)}
                disabled={showFeedback}
              >
                {option}
              </button>
            ))}
          </div>

          {showFeedback && (
            <div className={`feedback-message ${isCorrect ? 'correct' : 'incorrect'}`}>
              {isCorrect ? '🌟 Wonderful! That\'s Right! 🌟' : '💭 Try again next time! 💭'}
            </div>
          )}
        </div>
      </div>
    );
  }
}