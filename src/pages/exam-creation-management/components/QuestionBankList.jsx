import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const QuestionBankList = ({ onViewQuestionBank, onCreateQuestionBank }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const mockQuestionBanks = [
    {
      id: 'math-basic',
      name: 'Mathematics - Basic Concepts',
      description: 'Fundamental mathematics questions covering arithmetic, algebra, and geometry',
      category: 'Mathematics',
      questionCount: 150,
      difficulty: 'Mixed',
      lastUpdated: '2025-01-15T10:30:00Z',
      createdBy: 'Dr. Sarah Johnson',
      isActive: true,
      tags: ['arithmetic', 'algebra', 'geometry']
    },
    {
      id: 'science-physics',
      name: 'Science - Physics Fundamentals',
      description: 'Core physics concepts including mechanics, thermodynamics, and electromagnetism',
      category: 'Science',
      questionCount: 120,
      difficulty: 'Intermediate',
      lastUpdated: '2025-01-14T14:20:00Z',
      createdBy: 'Prof. Michael Chen',
      isActive: true,
      tags: ['mechanics', 'thermodynamics', 'electromagnetism']
    },
    {
      id: 'english-grammar',
      name: 'English - Grammar & Composition',
      description: 'Comprehensive English language questions focusing on grammar rules and writing skills',
      category: 'English',
      questionCount: 200,
      difficulty: 'Mixed',
      lastUpdated: '2025-01-13T09:15:00Z',
      createdBy: 'Ms. Emily Rodriguez',
      isActive: true,
      tags: ['grammar', 'composition', 'vocabulary']
    },
    {
      id: 'history-world',
      name: 'History - World History',
      description: 'World history questions covering major civilizations, wars, and cultural developments',
      category: 'History',
      questionCount: 180,
      difficulty: 'Advanced',
      lastUpdated: '2025-01-12T16:45:00Z',
      createdBy: 'Dr. Robert Williams',
      isActive: false,
      tags: ['civilizations', 'wars', 'culture']
    },
    {
      id: 'computer-programming',
      name: 'Computer Science - Programming Basics',
      description: 'Programming fundamentals including algorithms, data structures, and coding concepts',
      category: 'Computer Science',
      questionCount: 95,
      difficulty: 'Intermediate',
      lastUpdated: '2025-01-11T11:30:00Z',
      createdBy: 'Dr. Lisa Park',
      isActive: true,
      tags: ['algorithms', 'data-structures', 'programming']
    }
  ];

  const categories = ['all', 'Mathematics', 'Science', 'English', 'History', 'Computer Science'];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'bg-success text-success-foreground';
      case 'intermediate':
        return 'bg-warning text-warning-foreground';
      case 'advanced':
        return 'bg-error text-error-foreground';
      case 'mixed':
        return 'bg-primary text-primary-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const filteredQuestionBanks = mockQuestionBanks?.filter(bank => {
    const matchesSearch = bank?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         bank?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         bank?.tags?.some(tag => tag?.toLowerCase()?.includes(searchTerm?.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || bank?.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Question Banks</h2>
          <p className="text-muted-foreground">Manage your question collections</p>
        </div>
        <Button
          variant="default"
          onClick={onCreateQuestionBank}
          iconName="Plus"
          iconPosition="left"
          iconSize={16}
        >
          Create Question Bank
        </Button>
      </div>
      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 max-w-md">
          <Input
            type="search"
            placeholder="Search question banks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target?.value)}
            className="w-full"
          />
        </div>
        
        <div className="flex gap-2">
          {categories?.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="capitalize"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
      {/* Question Banks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuestionBanks?.map((bank) => (
          <div
            key={bank?.id}
            className="bg-card border border-border rounded-lg p-6 hover:shadow-moderate transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-foreground">{bank?.name}</h3>
                  {!bank?.isActive && (
                    <span className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded-full">
                      Inactive
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-3">{bank?.description}</p>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Questions:</span>
                <span className="font-medium text-foreground">{bank?.questionCount}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Difficulty:</span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(bank?.difficulty)}`}>
                  {bank?.difficulty}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Category:</span>
                <span className="font-medium text-foreground">{bank?.category}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Last Updated:</span>
                <span className="font-medium text-foreground">{formatDate(bank?.lastUpdated)}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Created By:</span>
                <span className="font-medium text-foreground">{bank?.createdBy}</span>
              </div>
            </div>

            {/* Tags */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {bank?.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="default"
                size="sm"
                onClick={() => onViewQuestionBank(bank)}
                iconName="Eye"
                iconPosition="left"
                iconSize={14}
                className="flex-1"
              >
                View
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconName="Edit"
                iconSize={14}
                className="p-2"
              />
              <Button
                variant="outline"
                size="sm"
                iconName="Copy"
                iconSize={14}
                className="p-2"
              />
              <Button
                variant="outline"
                size="sm"
                iconName="Download"
                iconSize={14}
                className="p-2"
              />
            </div>
          </div>
        ))}
      </div>
      {/* Empty State */}
      {filteredQuestionBanks?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Database" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No question banks found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || selectedCategory !== 'all' ?'Try adjusting your search or filter criteria.' :'Create your first question bank to get started.'
            }
          </p>
          {!searchTerm && selectedCategory === 'all' && (
            <Button
              variant="default"
              onClick={onCreateQuestionBank}
              iconName="Plus"
              iconPosition="left"
              iconSize={16}
            >
              Create Question Bank
            </Button>
          )}
        </div>
      )}
      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Database" size={20} className="text-primary" />
            </div>
            <div>
              <div className="text-2xl font-semibold text-foreground">
                {mockQuestionBanks?.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Banks</div>
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <Icon name="FileText" size={20} className="text-success" />
            </div>
            <div>
              <div className="text-2xl font-semibold text-foreground">
                {mockQuestionBanks?.reduce((sum, bank) => sum + bank?.questionCount, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Questions</div>
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
              <Icon name="CheckCircle" size={20} className="text-warning" />
            </div>
            <div>
              <div className="text-2xl font-semibold text-foreground">
                {mockQuestionBanks?.filter(bank => bank?.isActive)?.length}
              </div>
              <div className="text-sm text-muted-foreground">Active Banks</div>
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
              <Icon name="Tag" size={20} className="text-accent" />
            </div>
            <div>
              <div className="text-2xl font-semibold text-foreground">
                {categories?.length - 1}
              </div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionBankList;