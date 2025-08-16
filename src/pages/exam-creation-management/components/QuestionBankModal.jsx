import React, { useState } from 'react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const QuestionBankModal = ({ isOpen, onClose, questionBank }) => {
  const [activeTab, setActiveTab] = useState('questions');
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    type: 'multiple-choice',
    options: ['', '', '', ''],
    correctAnswer: '',
    explanation: '',
    difficulty: 'medium',
    category: ''
  });

  const mockQuestions = [
    {
      id: 1,
      question: "What is the capital of France?",
      type: "multiple-choice",
      options: ["London", "Berlin", "Paris", "Madrid"],
      correctAnswer: "Paris",
      difficulty: "easy",
      category: "Geography",
      explanation: "Paris is the capital and most populous city of France."
    },
    {
      id: 2,
      question: "Calculate the area of a circle with radius 5 units.",
      type: "multiple-choice",
      options: ["25π", "10π", "15π", "20π"],
      correctAnswer: "25π",
      difficulty: "medium",
      category: "Mathematics",
      explanation: "Area of circle = πr². With r=5, Area = π(5)² = 25π"
    },
    {
      id: 3,
      question: "Explain the process of photosynthesis.",
      type: "essay",
      correctAnswer: "",
      difficulty: "hard",
      category: "Biology",
      explanation: "Photosynthesis is the process by which plants convert light energy into chemical energy."
    }
  ];

  const questionTypeOptions = [
    { value: 'multiple-choice', label: 'Multiple Choice' },
    { value: 'true-false', label: 'True/False' },
    { value: 'short-answer', label: 'Short Answer' },
    { value: 'essay', label: 'Essay' }
  ];

  const difficultyOptions = [
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' }
  ];

  const categoryOptions = [
    { value: 'mathematics', label: 'Mathematics' },
    { value: 'science', label: 'Science' },
    { value: 'english', label: 'English' },
    { value: 'history', label: 'History' },
    { value: 'geography', label: 'Geography' }
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-success text-success-foreground';
      case 'medium':
        return 'bg-warning text-warning-foreground';
      case 'hard':
        return 'bg-error text-error-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const handleQuestionSelect = (questionId) => {
    setSelectedQuestions(prev => 
      prev?.includes(questionId)
        ? prev?.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const handleSelectAll = () => {
    if (selectedQuestions?.length === mockQuestions?.length) {
      setSelectedQuestions([]);
    } else {
      setSelectedQuestions(mockQuestions?.map(q => q?.id));
    }
  };

  const handleNewQuestionChange = (field, value) => {
    setNewQuestion(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOptionChange = (index, value) => {
    setNewQuestion(prev => ({
      ...prev,
      options: prev?.options?.map((opt, i) => i === index ? value : opt)
    }));
  };

  const renderQuestionsTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSelectAll}
            iconName={selectedQuestions?.length === mockQuestions?.length ? "Square" : "CheckSquare"}
            iconPosition="left"
            iconSize={16}
          >
            {selectedQuestions?.length === mockQuestions?.length ? 'Deselect All' : 'Select All'}
          </Button>
          <span className="text-sm text-muted-foreground">
            {selectedQuestions?.length} of {mockQuestions?.length} selected
          </span>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Upload"
            iconPosition="left"
            iconSize={16}
          >
            Import
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconPosition="left"
            iconSize={16}
            disabled={selectedQuestions?.length === 0}
          >
            Export
          </Button>
          <Button
            variant="destructive"
            size="sm"
            iconName="Trash2"
            iconPosition="left"
            iconSize={16}
            disabled={selectedQuestions?.length === 0}
          >
            Delete
          </Button>
        </div>
      </div>
      
      <div className="space-y-3">
        {mockQuestions?.map((question) => (
          <div
            key={question?.id}
            className={`p-4 border rounded-lg transition-colors ${
              selectedQuestions?.includes(question?.id)
                ? 'border-primary bg-primary/5' :'border-border bg-card'
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={selectedQuestions?.includes(question?.id)}
                onChange={() => handleQuestionSelect(question?.id)}
                className="mt-1 w-4 h-4 text-primary bg-input border-border rounded focus:ring-ring"
              />
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-medium text-foreground">{question?.question}</h4>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(question?.difficulty)}`}>
                      {question?.difficulty}
                    </span>
                    <span className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded-full">
                      {question?.category}
                    </span>
                  </div>
                </div>
                
                {question?.type === 'multiple-choice' && (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {question?.options?.map((option, index) => (
                      <div
                        key={index}
                        className={`text-xs p-2 rounded ${
                          option === question?.correctAnswer
                            ? 'bg-success/10 text-success border border-success/20' :'bg-muted text-muted-foreground'
                        }`}
                      >
                        {String.fromCharCode(65 + index)}. {option}
                      </div>
                    ))}
                  </div>
                )}
                
                {question?.explanation && (
                  <div className="mt-2 p-2 bg-muted rounded text-xs text-muted-foreground">
                    <strong>Explanation:</strong> {question?.explanation}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAddQuestionTab = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Question</label>
        <textarea
          className="w-full min-h-[100px] px-3 py-2 text-sm border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
          placeholder="Enter your question here..."
          value={newQuestion?.question}
          onChange={(e) => handleNewQuestionChange('question', e?.target?.value)}
        />
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <Select
          label="Question Type"
          options={questionTypeOptions}
          value={newQuestion?.type}
          onChange={(value) => handleNewQuestionChange('type', value)}
        />
        
        <Select
          label="Difficulty"
          options={difficultyOptions}
          value={newQuestion?.difficulty}
          onChange={(value) => handleNewQuestionChange('difficulty', value)}
        />
        
        <Select
          label="Category"
          options={categoryOptions}
          value={newQuestion?.category}
          onChange={(value) => handleNewQuestionChange('category', value)}
          placeholder="Select category"
        />
      </div>
      
      {newQuestion?.type === 'multiple-choice' && (
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Answer Options</label>
          {newQuestion?.options?.map((option, index) => (
            <div key={index} className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground w-6">
                {String.fromCharCode(65 + index)}.
              </span>
              <Input
                type="text"
                placeholder={`Option ${String.fromCharCode(65 + index)}`}
                value={option}
                onChange={(e) => handleOptionChange(index, e?.target?.value)}
                className="flex-1"
              />
              <input
                type="radio"
                name="correctAnswer"
                checked={newQuestion?.correctAnswer === option}
                onChange={() => handleNewQuestionChange('correctAnswer', option)}
                className="w-4 h-4 text-primary bg-input border-border focus:ring-ring"
              />
            </div>
          ))}
          <p className="text-xs text-muted-foreground">Select the correct answer by clicking the radio button</p>
        </div>
      )}
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Explanation (Optional)</label>
        <textarea
          className="w-full min-h-[80px] px-3 py-2 text-sm border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
          placeholder="Provide an explanation for the correct answer..."
          value={newQuestion?.explanation}
          onChange={(e) => handleNewQuestionChange('explanation', e?.target?.value)}
        />
      </div>
      
      <div className="flex justify-end gap-2">
        <Button
          variant="ghost"
          onClick={() => setNewQuestion({
            question: '',
            type: 'multiple-choice',
            options: ['', '', '', ''],
            correctAnswer: '',
            explanation: '',
            difficulty: 'medium',
            category: ''
          })}
        >
          Clear
        </Button>
        <Button
          variant="default"
          iconName="Plus"
          iconPosition="left"
          iconSize={16}
        >
          Add Question
        </Button>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-lg shadow-strong w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Question Bank</h2>
            <p className="text-sm text-muted-foreground">{questionBank?.name || 'Mathematics - Basic Concepts'}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            iconName="X"
            iconSize={20}
          />
        </div>
        
        <div className="flex border-b border-border">
          <Button
            variant={activeTab === 'questions' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('questions')}
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
          >
            Questions ({mockQuestions?.length})
          </Button>
          <Button
            variant={activeTab === 'add' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('add')}
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
          >
            Add Question
          </Button>
        </div>
        
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {activeTab === 'questions' ? renderQuestionsTab() : renderAddQuestionTab()}
        </div>
        
        <div className="flex items-center justify-end p-6 border-t border-border gap-2">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="default"
            iconName="Save"
            iconPosition="left"
            iconSize={16}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuestionBankModal;