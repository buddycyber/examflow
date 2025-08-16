import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

// Import components
import ExamCard from './components/ExamCard';
import CreateExamModal from './components/CreateExamModal';
import QuestionBankModal from './components/QuestionBankModal';
import ScheduleModal from './components/ScheduleModal';
import ExamTable from './components/ExamTable';
import QuestionBankList from './components/QuestionBankList';

const ExamCreationManagement = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // Modal states
  const [isCreateExamModalOpen, setIsCreateExamModalOpen] = useState(false);
  const [isQuestionBankModalOpen, setIsQuestionBankModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedQuestionBank, setSelectedQuestionBank] = useState(null);

  // Mock data
  const [exams, setExams] = useState([
    {
      id: '1',
      title: 'Mathematics Level 1 Assessment',
      description: 'Basic arithmetic and algebra concepts for beginners',
      level: '1',
      duration: '60',
      scheduledDate: '2025-01-20T10:00:00',
      enrolledStudents: 25,
      status: 'scheduled',
      classLink: 'https://zoom.us/j/123456789',
      classLinkType: 'zoom',
      maxAttempts: '2',
      passingScore: '70',
      questionBankId: 'math-basic',
      totalQuestions: '15',
      createdAt: '2025-01-15T09:30:00Z'
    },
    {
      id: '2',
      title: 'Science Physics Fundamentals',
      description: 'Core physics concepts including mechanics and thermodynamics',
      level: '2',
      duration: '90',
      scheduledDate: '2025-01-22T14:00:00',
      enrolledStudents: 18,
      status: 'active',
      classLink: 'https://meet.google.com/abc-defg-hij',
      classLinkType: 'meet',
      maxAttempts: '1',
      passingScore: '75',
      questionBankId: 'science-physics',
      totalQuestions: '20',
      createdAt: '2025-01-14T11:15:00Z'
    },
    {
      id: '3',
      title: 'English Grammar & Composition',
      description: 'Comprehensive English language assessment',
      level: '1',
      duration: '45',
      scheduledDate: null,
      enrolledStudents: 0,
      status: 'draft',
      classLink: '',
      classLinkType: 'zoom',
      maxAttempts: '3',
      passingScore: '65',
      questionBankId: 'english-grammar',
      totalQuestions: '12',
      createdAt: '2025-01-16T16:20:00Z'
    },
    {
      id: '4',
      title: 'World History Advanced',
      description: 'Advanced world history covering major civilizations and events',
      level: '4',
      duration: '120',
      scheduledDate: '2025-01-18T09:00:00',
      enrolledStudents: 12,
      status: 'completed',
      classLink: 'https://youtube.com/live/xyz123',
      classLinkType: 'youtube',
      maxAttempts: '1',
      passingScore: '80',
      questionBankId: 'history-world',
      totalQuestions: '25',
      createdAt: '2025-01-10T13:45:00Z'
    }
  ]);

  const tabs = [
    { id: 'active', label: 'Active Exams', count: exams?.filter(e => e?.status === 'active' || e?.status === 'scheduled')?.length },
    { id: 'draft', label: 'Draft Exams', count: exams?.filter(e => e?.status === 'draft')?.length },
    { id: 'completed', label: 'Completed Exams', count: exams?.filter(e => e?.status === 'completed')?.length },
    { id: 'question-banks', label: 'Question Banks', count: 5 }
  ];

  const getFilteredExams = () => {
    let filtered = exams;
    
    // Filter by tab
    if (activeTab === 'active') {
      filtered = filtered?.filter(exam => exam?.status === 'active' || exam?.status === 'scheduled');
    } else if (activeTab === 'draft') {
      filtered = filtered?.filter(exam => exam?.status === 'draft');
    } else if (activeTab === 'completed') {
      filtered = filtered?.filter(exam => exam?.status === 'completed');
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered?.filter(exam => 
        exam?.title?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        exam?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      );
    }
    
    return filtered;
  };

  const handleCreateExam = (newExam) => {
    setExams(prev => [...prev, newExam]);
  };

  const handleEditExam = (exam) => {
    setSelectedExam(exam);
    setIsCreateExamModalOpen(true);
  };

  const handleDeleteExam = (exam) => {
    if (window.confirm(`Are you sure you want to delete "${exam?.title}"?`)) {
      setExams(prev => prev?.filter(e => e?.id !== exam?.id));
    }
  };

  const handleViewQuestions = (exam) => {
    setSelectedExam(exam);
    setSelectedQuestionBank({ id: exam?.questionBankId, name: `Question Bank for ${exam?.title}` });
    setIsQuestionBankModalOpen(true);
  };

  const handleScheduleExam = (exam) => {
    setSelectedExam(exam);
    setIsScheduleModalOpen(true);
  };

  const handleSaveSchedule = (updatedExam) => {
    setExams(prev => prev?.map(exam => 
      exam?.id === updatedExam?.id ? updatedExam : exam
    ));
  };

  const handleDuplicateExam = (exam) => {
    const duplicatedExam = {
      ...exam,
      id: Date.now()?.toString(),
      title: `${exam?.title} (Copy)`,
      status: 'draft',
      scheduledDate: null,
      enrolledStudents: 0,
      createdAt: new Date()?.toISOString()
    };
    setExams(prev => [...prev, duplicatedExam]);
  };

  const handleViewQuestionBank = (questionBank) => {
    setSelectedQuestionBank(questionBank);
    setIsQuestionBankModalOpen(true);
  };

  const handleCreateQuestionBank = () => {
    // Handle create question bank
    console.log('Create new question bank');
  };

  const filteredExams = getFilteredExams();

  return (
    <div className="min-h-screen bg-background">
      <Header 
        userRole="admin" 
        userName="Dr. Sarah Johnson" 
        onLogout={() => console.log('Logout clicked')}
      />
      <Sidebar 
        userRole="admin" 
        userName="Dr. Sarah Johnson"
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onLogout={() => console.log('Logout clicked')}
      />
      <main className={`transition-all duration-300 ${isSidebarCollapsed ? 'ml-16' : 'ml-60'} pt-16`}>
        <div className="p-6">
          <Breadcrumb userRole="admin" />
          
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Exam Creation & Management</h1>
              <p className="text-muted-foreground">Create, schedule, and manage your examinations</p>
            </div>
            <Button
              variant="default"
              onClick={() => setIsCreateExamModalOpen(true)}
              iconName="Plus"
              iconPosition="left"
              iconSize={16}
            >
              Create New Exam
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="FileText" size={24} className="text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{exams?.length}</div>
                  <div className="text-sm text-muted-foreground">Total Exams</div>
                </div>
              </div>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                  <Icon name="CheckCircle" size={24} className="text-success" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {exams?.filter(e => e?.status === 'active' || e?.status === 'scheduled')?.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Active Exams</div>
                </div>
              </div>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                  <Icon name="Users" size={24} className="text-warning" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {exams?.reduce((sum, exam) => sum + exam?.enrolledStudents, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Students</div>
                </div>
              </div>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Icon name="Calendar" size={24} className="text-accent" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {exams?.filter(e => e?.scheduledDate && new Date(e.scheduledDate) > new Date())?.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Upcoming</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex space-x-1 bg-muted p-1 rounded-lg">
              {tabs?.map((tab) => (
                <Button
                  key={tab?.id}
                  variant={activeTab === tab?.id ? "default" : "ghost"}
                  onClick={() => setActiveTab(tab?.id)}
                  className="relative"
                >
                  {tab?.label}
                  <span className="ml-2 px-2 py-1 text-xs bg-muted-foreground/20 rounded-full">
                    {tab?.count}
                  </span>
                </Button>
              ))}
            </div>
            
            {activeTab !== 'question-banks' && (
              <div className="flex items-center gap-4">
                <Input
                  type="search"
                  placeholder="Search exams..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e?.target?.value)}
                  className="w-64"
                />
                
                <div className="flex gap-1 bg-muted p-1 rounded-lg">
                  <Button
                    variant={viewMode === 'grid' ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    iconName="Grid3X3"
                    iconSize={16}
                  />
                  <Button
                    variant={viewMode === 'table' ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode('table')}
                    iconName="List"
                    iconSize={16}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          {activeTab === 'question-banks' ? (
            <QuestionBankList
              onViewQuestionBank={handleViewQuestionBank}
              onCreateQuestionBank={handleCreateQuestionBank}
            />
          ) : (
            <>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredExams?.map((exam) => (
                    <ExamCard
                      key={exam?.id}
                      exam={exam}
                      onEdit={handleEditExam}
                      onDelete={handleDeleteExam}
                      onViewQuestions={handleViewQuestions}
                      onSchedule={handleScheduleExam}
                    />
                  ))}
                </div>
              ) : (
                <ExamTable
                  exams={filteredExams}
                  onEdit={handleEditExam}
                  onDelete={handleDeleteExam}
                  onViewQuestions={handleViewQuestions}
                  onSchedule={handleScheduleExam}
                  onDuplicate={handleDuplicateExam}
                />
              )}
              
              {filteredExams?.length === 0 && (
                <div className="text-center py-12">
                  <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    {searchTerm ? 'No exams found' : `No ${activeTab} exams`}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm 
                      ? 'Try adjusting your search criteria.' 
                      : `Create your first exam to get started.`
                    }
                  </p>
                  {!searchTerm && (
                    <Button
                      variant="default"
                      onClick={() => setIsCreateExamModalOpen(true)}
                      iconName="Plus"
                      iconPosition="left"
                      iconSize={16}
                    >
                      Create New Exam
                    </Button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      {/* Modals */}
      <CreateExamModal
        isOpen={isCreateExamModalOpen}
        onClose={() => {
          setIsCreateExamModalOpen(false);
          setSelectedExam(null);
        }}
        onSave={handleCreateExam}
        exam={selectedExam}
      />
      <QuestionBankModal
        isOpen={isQuestionBankModalOpen}
        onClose={() => {
          setIsQuestionBankModalOpen(false);
          setSelectedQuestionBank(null);
          setSelectedExam(null);
        }}
        questionBank={selectedQuestionBank}
      />
      <ScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => {
          setIsScheduleModalOpen(false);
          setSelectedExam(null);
        }}
        exam={selectedExam}
        onSave={handleSaveSchedule}
      />
    </div>
  );
};

export default ExamCreationManagement;