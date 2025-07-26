import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import FilterPanel from './components/FilterPanel';
import InterviewTable from './components/InterviewTable';
import AnalyticsSidebar from './components/AnalyticsSidebar';
import InterviewDetailsModal from './components/InterviewDetailsModal';

const InterviewHistoryAnalytics = () => {
  const [filters, setFilters] = useState({
    search: '',
    dateFrom: '',
    dateTo: '',
    position: '',
    rating: '',
    status: '',
    interviewer: ''
  });

  const [sortConfig, setSortConfig] = useState({
    key: 'date',
    direction: 'desc'
  });

  const [expandedRows, setExpandedRows] = useState(new Set());
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock interview data
  const mockInterviews = [
    {
      id: 1,
      date: '2025-01-25',
      candidate: 'Sarah Johnson',
      candidateEmail: 'sarah.johnson@email.com',
      position: 'Senior Frontend Developer',
      interviewer: 'John Doe',
      duration: 45,
      rating: 5,
      status: 'completed',
      summary: `Excellent technical interview with Sarah. She demonstrated strong React expertise and problem-solving skills. Her approach to component architecture was particularly impressive, showing deep understanding of modern React patterns including hooks, context, and performance optimization techniques.`,
      feedback: `Sarah showed exceptional technical skills and communication abilities. Her code was clean, well-structured, and followed best practices. She handled complex algorithmic questions with ease and provided multiple solutions with different time complexities. Highly recommended for the senior position.`,
      codeSnippet: `function fibonacci(n) {
  if (n <= 1) return n;
  
  let prev = 0, curr = 1;
  for (let i = 2; i <= n; i++) {
    [prev, curr] = [curr, prev + curr];
  }
  return curr;
}

// React Component Example
const UserProfile = ({ user }) => {
  const [loading, setLoading] = useState(false);
  
  const handleUpdate = useCallback(async (data) => {
    setLoading(true);
    try {
      await updateUser(data);
    } finally {
      setLoading(false);
    }
  }, []);
  
  return (
    <div className="user-profile">
      <h2>{user.name}</h2>
      <button onClick={handleUpdate} disabled={loading}>
        {loading ? 'Updating...' : 'Update Profile'}
      </button>
    </div>
  );
};`,
      skillsAssessed: ['React', 'JavaScript', 'TypeScript', 'Node.js', 'CSS'],
      keyMoments: [
        { title: 'Algorithm Discussion', description: 'Fibonacci implementation', timestamp: 300 },
        { title: 'React Component Design', description: 'User profile component', timestamp: 1200 },
        { title: 'Performance Optimization', description: 'useCallback usage', timestamp: 1800 }
      ],
      codeMetrics: [
        { name: 'Code Quality', score: 9 },
        { name: 'Problem Solving', score: 10 },
        { name: 'Communication', score: 9 },
        { name: 'Best Practices', score: 8 }
      ],
      testResults: [
        { name: 'Basic Algorithm Test', passed: true },
        { name: 'React Component Test', passed: true },
        { name: 'Performance Test', passed: true },
        { name: 'Edge Cases Test', passed: true }
      ],
      detailedRatings: [
        { category: 'Technical Skills', score: 5, comment: 'Excellent React and JavaScript knowledge' },
        { category: 'Problem Solving', score: 5, comment: 'Great analytical thinking and multiple approaches' },
        { category: 'Communication', score: 5, comment: 'Clear explanations and good questions' },
        { category: 'Code Quality', score: 4, comment: 'Clean code with minor optimization opportunities' }
      ],
      recommendation: 'hire',
      recommendationReason: 'Strong technical skills, excellent communication, and great cultural fit. Ready for senior role.'
    },
    {
      id: 2,
      date: '2025-01-24',
      candidate: 'Michael Chen',
      candidateEmail: 'michael.chen@email.com',
      position: 'Backend Developer',
      interviewer: 'Sarah Wilson',
      duration: 60,
      rating: 4,
      status: 'completed',
      summary: `Good technical interview with Michael. He showed solid backend development skills with Python and Django. His database design knowledge was strong, though he could improve on system design concepts for large-scale applications.`,
      feedback: `Michael demonstrated good technical fundamentals and problem-solving abilities. His API design was well thought out and he showed understanding of RESTful principles. Some areas for improvement in distributed systems knowledge, but overall a solid candidate.`,
      codeSnippet: `# Python API endpoint example
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def user_api(request):
    if request.method == 'GET':
        users = User.objects.all().values()
        return JsonResponse(list(users), safe=False)
    
    elif request.method == 'POST':
        data = json.loads(request.body)
        user = User.objects.create(**data)
        return JsonResponse({'id': user.id, 'status': 'created'})
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)

# Database query optimization
def get_user_posts(user_id):
    return Post.objects.select_related('author').filter(
        author_id=user_id
    ).prefetch_related('comments__author')`,
      skillsAssessed: ['Python', 'Django', 'PostgreSQL', 'REST APIs', 'Docker'],
      keyMoments: [
        { title: 'API Design Discussion', description: 'RESTful endpoint creation', timestamp: 450 },
        { title: 'Database Optimization', description: 'Query performance improvement', timestamp: 1500 },
        { title: 'System Architecture', description: 'Scalability considerations', timestamp: 2400 }
      ],
      codeMetrics: [
        { name: 'Code Quality', score: 8 },
        { name: 'Problem Solving', score: 7 },
        { name: 'Communication', score: 8 },
        { name: 'Best Practices', score: 7 }
      ],
      testResults: [
        { name: 'API Implementation', passed: true },
        { name: 'Database Design', passed: true },
        { name: 'Performance Test', passed: false },
        { name: 'Security Test', passed: true }
      ],
      detailedRatings: [
        { category: 'Technical Skills', score: 4, comment: 'Solid backend development knowledge' },
        { category: 'Problem Solving', score: 4, comment: 'Good analytical approach with room for improvement' },
        { category: 'Communication', score: 4, comment: 'Clear communication, asks good questions' },
        { category: 'System Design', score: 3, comment: 'Basic understanding, needs more experience with scale' }
      ],
      recommendation: 'maybe',
      recommendationReason: 'Good technical foundation but needs more experience with large-scale systems. Consider for mid-level position.'
    },
    {
      id: 3,
      date: '2025-01-23',
      candidate: 'Emily Rodriguez',
      candidateEmail: 'emily.rodriguez@email.com',
      position: 'Full Stack Developer',
      interviewer: 'Mike Chen',
      duration: 50,
      rating: 3,
      status: 'completed',
      summary: `Average interview performance. Emily showed basic understanding of full-stack concepts but struggled with more complex algorithmic problems. Her frontend skills are stronger than backend, with good React knowledge but limited Node.js experience.`,
      feedback: `Emily has potential but needs more experience in backend development. Her React skills are decent, but she struggled with server-side concepts and database design. Would benefit from additional training before taking on full-stack responsibilities.`,
      codeSnippet: `// React component with basic functionality
import React, { useState, useEffect } from 'react';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    // Fetch todos from API
    fetch('/api/todos')
      .then(res => res.json())
      .then(data => setTodos(data));
  }, []);

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, { 
        id: Date.now(), 
        text: newTodo, 
        completed: false 
      }]);
      setNewTodo('');
    }
  };

  return (
    <div>
      <input 
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Add todo..."
      />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </div>
  );
};`,
      skillsAssessed: ['React', 'JavaScript', 'Node.js', 'HTML/CSS', 'Git'],
      keyMoments: [
        { title: 'React Component Building', description: 'Todo list implementation', timestamp: 600 },
        { title: 'Algorithm Challenge', description: 'Array manipulation problem', timestamp: 1800 },
        { title: 'Backend Discussion', description: 'API design concepts', timestamp: 2700 }
      ],
      codeMetrics: [
        { name: 'Code Quality', score: 6 },
        { name: 'Problem Solving', score: 5 },
        { name: 'Communication', score: 7 },
        { name: 'Best Practices', score: 5 }
      ],
      testResults: [
        { name: 'React Component Test', passed: true },
        { name: 'Algorithm Test', passed: false },
        { name: 'API Design Test', passed: false },
        { name: 'CSS Styling Test', passed: true }
      ],
      detailedRatings: [
        { category: 'Frontend Skills', score: 4, comment: 'Good React knowledge, needs improvement in advanced concepts' },
        { category: 'Backend Skills', score: 2, comment: 'Limited experience with server-side development' },
        { category: 'Problem Solving', score: 3, comment: 'Basic problem-solving skills, struggles with complex algorithms' },
        { category: 'Communication', score: 4, comment: 'Good communication skills and willingness to learn' }
      ],
      recommendation: 'no',
      recommendationReason: 'Needs more experience in backend development and algorithmic problem-solving before full-stack role.'
    },
    {
      id: 4,
      date: '2025-01-22',
      candidate: 'David Kim',
      candidateEmail: 'david.kim@email.com',
      position: 'DevOps Engineer',
      interviewer: 'Emily Davis',
      duration: 55,
      rating: 4,
      status: 'completed',
      summary: `Strong DevOps interview with David. He demonstrated excellent knowledge of containerization, CI/CD pipelines, and cloud infrastructure. His experience with Kubernetes and AWS was particularly impressive, showing practical understanding of production environments.`,
      feedback: `David has solid DevOps experience and shows good understanding of modern infrastructure practices. His knowledge of monitoring and logging systems is comprehensive. Would be a valuable addition to the infrastructure team.`,
      codeSnippet: `# Dockerfile for Node.js application
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

USER node

CMD ["npm", "start"]

---

# Kubernetes deployment configuration
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web-app
  template:
    metadata:
      labels:
        app: web-app
    spec:
      containers:
      - name: web-app
        image: myapp:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        resources:
          requests:
            memory: "128Mi" cpu:"100m"
          limits:
            memory: "256Mi" cpu:"200m"`,
      skillsAssessed: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Monitoring'],
      keyMoments: [
        { title: 'Container Discussion', description: 'Docker best practices', timestamp: 400 },
        { title: 'Kubernetes Deep Dive', description: 'Deployment strategies', timestamp: 1600 },
        { title: 'Monitoring Setup', description: 'Prometheus and Grafana', timestamp: 2800 }
      ],
      codeMetrics: [
        { name: 'Infrastructure Knowledge', score: 9 },
        { name: 'Problem Solving', score: 8 },
        { name: 'Best Practices', score: 8 },
        { name: 'Communication', score: 7 }
      ],
      testResults: [
        { name: 'Docker Configuration', passed: true },
        { name: 'Kubernetes Deployment', passed: true },
        { name: 'CI/CD Pipeline', passed: true },
        { name: 'Monitoring Setup', passed: true }
      ],
      detailedRatings: [
        { category: 'Container Technologies', score: 5, comment: 'Excellent Docker and Kubernetes knowledge' },
        { category: 'Cloud Platforms', score: 4, comment: 'Strong AWS experience, good understanding of services' },
        { category: 'CI/CD', score: 4, comment: 'Good pipeline design and automation skills' },
        { category: 'Monitoring', score: 4, comment: 'Solid understanding of observability practices' }
      ],
      recommendation: 'hire',
      recommendationReason: 'Strong technical skills in DevOps practices and good cultural fit. Ready for the role.'
    },
    {
      id: 5,
      date: '2025-01-21',
      candidate: 'Lisa Wang',
      candidateEmail: 'lisa.wang@email.com',
      position: 'Mobile Developer',
      interviewer: 'Alex Johnson',
      duration: 40,
      rating: 2,
      status: 'cancelled',
      summary: `Interview was cancelled due to technical difficulties. Candidate experienced connectivity issues and we were unable to complete the technical assessment. Rescheduling for next week.`,
      feedback: `Unable to complete interview due to technical issues. Will reschedule to properly assess candidate's mobile development skills.`,
      codeSnippet: `// Incomplete - interview cancelled
// Planned to discuss React Native component structure`,
      skillsAssessed: ['React Native', 'iOS', 'Android'],
      keyMoments: [],
      codeMetrics: [],
      testResults: [],
      detailedRatings: [],
      recommendation: 'pending',
      recommendationReason: 'Interview cancelled due to technical issues. Needs rescheduling.'
    }
  ];

  // Mock analytics data
  const analyticsData = {
    totalInterviews: 156,
    successRate: 68,
    averageRating: 3.8,
    averageDuration: 52,
    successTrend: [
      { month: 'Oct', rate: 65 },
      { month: 'Nov', rate: 72 },
      { month: 'Dec', rate: 68 },
      { month: 'Jan', rate: 75 }
    ],
    ratingDistribution: [
      { rating: '1', count: 8 },
      { rating: '2', count: 12 },
      { rating: '3', count: 28 },
      { rating: '4', count: 45 },
      { rating: '5', count: 32 }
    ],
    languageUsage: [
      { name: 'JavaScript', count: 45 },
      { name: 'Python', count: 32 },
      { name: 'Java', count: 28 },
      { name: 'React', count: 38 },
      { name: 'Node.js', count: 25 }
    ],
    performanceMetrics: [
      { name: 'Technical Skills', value: 78 },
      { name: 'Problem Solving', value: 72 },
      { name: 'Communication', value: 85 },
      { name: 'Code Quality', value: 68 }
    ],
    recentActivity: [
      { id: 1, type: 'interview', description: 'Interview completed with Sarah Johnson', time: '2 hours ago' },
      { id: 2, type: 'rating', description: 'High rating (5/5) received', time: '3 hours ago' },
      { id: 3, type: 'followup', description: 'Follow-up scheduled with Michael Chen', time: '1 day ago' },
      { id: 4, type: 'interview', description: 'Interview completed with Emily Rodriguez', time: '2 days ago' }
    ]
  };

  // Filter and sort interviews
  const filteredAndSortedInterviews = useMemo(() => {
    let filtered = mockInterviews.filter(interview => {
      const matchesSearch = !filters.search || 
        interview.candidate.toLowerCase().includes(filters.search.toLowerCase()) ||
        interview.candidateEmail.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesDateFrom = !filters.dateFrom || 
        new Date(interview.date) >= new Date(filters.dateFrom);
      
      const matchesDateTo = !filters.dateTo || 
        new Date(interview.date) <= new Date(filters.dateTo);
      
      const matchesPosition = !filters.position || 
        interview.position.toLowerCase().includes(filters.position.toLowerCase());
      
      const matchesRating = !filters.rating || 
        interview.rating >= parseInt(filters.rating);
      
      const matchesStatus = !filters.status || 
        interview.status === filters.status;
      
      const matchesInterviewer = !filters.interviewer || 
        interview.interviewer.toLowerCase().replace(' ', '_') === filters.interviewer;

      return matchesSearch && matchesDateFrom && matchesDateTo && 
             matchesPosition && matchesRating && matchesStatus && matchesInterviewer;
    });

    // Sort interviews
    filtered.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key === 'date') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  }, [mockInterviews, filters, sortConfig]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      dateFrom: '',
      dateTo: '',
      position: '',
      rating: '',
      status: '',
      interviewer: ''
    });
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleToggleExpand = (id) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleViewDetails = (interview) => {
    setSelectedInterview(interview);
    setIsModalOpen(true);
  };

  const handleScheduleFollowup = (interview) => {
    console.log('Scheduling follow-up for:', interview.candidate);
    // In a real app, this would navigate to scheduling page or open a modal
  };

  const handleExportPDF = (interview) => {
    console.log('Exporting PDF for:', interview.candidate);
    // In a real app, this would generate and download a PDF report
  };

  const handleExportAll = () => {
    console.log('Exporting all interviews');
    // In a real app, this would export all filtered interviews
  };

  const breadcrumbItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Interview History & Analytics', path: '/interview-history-analytics', current: true }
  ];

  useEffect(() => {
    document.title = 'Interview History & Analytics - TechInterview Pro';
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Breadcrumb items={breadcrumbItems} />
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text-primary mb-2">Interview History & Analytics</h1>
            <p className="text-text-secondary">
              Comprehensive view of completed interviews with detailed analytics and performance tracking
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="xl:col-span-3 space-y-6">
              <FilterPanel
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                onExportAll={handleExportAll}
              />

              <InterviewTable
                interviews={filteredAndSortedInterviews}
                onViewDetails={handleViewDetails}
                onScheduleFollowup={handleScheduleFollowup}
                onExportPDF={handleExportPDF}
                sortConfig={sortConfig}
                onSort={handleSort}
                expandedRows={expandedRows}
                onToggleExpand={handleToggleExpand}
              />

              {filteredAndSortedInterviews.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-text-secondary mb-4">
                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-text-primary mb-2">No interviews found</h3>
                  <p className="text-text-secondary">Try adjusting your filters to see more results.</p>
                </div>
              )}
            </div>

            {/* Analytics Sidebar */}
            <div className="xl:col-span-1">
              <AnalyticsSidebar analyticsData={analyticsData} />
            </div>
          </div>
        </div>
      </main>

      {/* Interview Details Modal */}
      <InterviewDetailsModal
        interview={selectedInterview}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onScheduleFollowup={handleScheduleFollowup}
      />
    </div>
  );
};

export default InterviewHistoryAnalytics;