import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const [currentView, setCurrentView] = useState('projects');

  // Handle URL routing
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/dock-me-floatie') {
        setCurrentView('dashboard');
        document.title = 'dock me, floatie - @lizso projects';
      } else {
        setCurrentView('projects');
        document.title = '@lizso projects';
      }
    };

    // Set initial view based on URL
    handlePopState();

    // Listen for browser back/forward buttons
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const projects = [
    {
      id: 1,
      title: "dock me, floatie",
      description: "A dashboard with drag-and-drop docking functionality",
      color: "from-blue-500 to-purple-600"
    },
    {
      id: 2,
      title: "AI Chat Interface",
      description: "Intelligent conversational UI with natural language processing",
      color: "from-green-500 to-teal-600"
    },
    {
      id: 3,
      title: "E-commerce Platform",
      description: "Full-stack shopping experience with payment integration",
      color: "from-orange-500 to-red-600"
    },
    {
      id: 4,
      title: "Mobile Fitness App",
      description: "Cross-platform fitness tracking with social features",
      color: "from-pink-500 to-rose-600"
    },
    {
      id: 5,
      title: "Code Editor Extension",
      description: "VS Code extension for enhanced developer productivity",
      color: "from-indigo-500 to-blue-600"
    },
    {
      id: 6,
      title: "Blockchain Explorer",
      description: "Web3 application for exploring blockchain transactions",
      color: "from-yellow-500 to-orange-600"
    }
  ];

  const handleProjectClick = (projectId) => {
    if (projectId === 1) {
      window.history.pushState({}, '', '/dock-me-floatie');
      document.title = 'dock me, floatie - @lizso projects';
      setCurrentView('dashboard');
    }
  };

  const handleBackToProjects = () => {
    window.history.pushState({}, '', '/');
    document.title = '@lizso projects';
    setCurrentView('projects');
  };

  if (currentView === 'dashboard') {
    return <DashboardView onBack={handleBackToProjects} />;
  }

  return (
    <div className="App">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="main-title">@lizso projects</h1>
        </div>
      </div>

      <div className="projects-section">
        <div className="container">
          <div className="projects-grid">
            {projects.map((project, index) => (
              <div 
                key={project.id} 
                className={`project-card ${project.color}`}
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => handleProjectClick(project.id)}
              >
                <div className="project-content">
                  <h3 className="project-title">{project.title}</h3>
                  {/* <p className="project-description">{project.description}</p> */}
                  <div className="project-overlay">
                    <button className="view-project-btn">View Project</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardView({ onBack }) {
  const [dragState, setDragState] = useState({
    isDragging: false,
    dragToNavActive: false,
    dragToRightActive: false,
    dragToNavDropped: false,
    dragToRightDropped: false,
    setupGuidePosition: { x: null, y: null }
  });

  const handleDragStart = (e) => {
    setDragState(prev => ({ ...prev, isDragging: true }));
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', '');
    
    // Hide the original element during drag
    e.target.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    // Reset opacity
    e.target.style.opacity = '1';
    
    setDragState(prev => ({
      ...prev,
      isDragging: false,
      dragToNavActive: false,
      dragToRightActive: false
    }));
  };

  const handleDragOver = (e, zone) => {
    e.preventDefault();
    if (zone === 'nav') {
      setDragState(prev => ({ ...prev, dragToNavActive: true, dragToRightActive: false }));
    } else if (zone === 'right') {
      setDragState(prev => ({ ...prev, dragToRightActive: true, dragToNavActive: false }));
    }
  };

  const handleDragLeave = () => {
    setDragState(prev => ({ ...prev, dragToNavActive: false, dragToRightActive: false }));
  };

  const handleDrop = (e, zone) => {
    e.preventDefault();
    if (zone === 'nav') {
      setDragState(prev => ({ 
        ...prev, 
        dragToNavDropped: true, 
        dragToRightDropped: false,
        setupGuidePosition: { x: 20, y: 100 } // Position in nav area
      }));
    } else if (zone === 'right') {
      setDragState(prev => ({ 
        ...prev, 
        dragToRightDropped: true, 
        dragToNavDropped: false,
        setupGuidePosition: { x: window.innerWidth - 380, y: 100 } // Position in right area
      }));
    }
  };

  const handleGlobalDrop = (e) => {
    // Allow dropping anywhere on the dashboard
    if (!dragState.isDragging) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - 180; // Account for setup guide width/2
    const y = e.clientY - rect.top - 47.5; // Account for setup guide height/2
    
    setDragState(prev => ({
      ...prev,
      setupGuidePosition: { x: Math.max(0, Math.min(x, rect.width - 360)), y: Math.max(0, Math.min(y, rect.height - 95)) },
      isDragging: false,
      dragToNavActive: false,
      dragToRightActive: false
    }));
  };

  const setupGuideStyle = dragState.setupGuidePosition.x !== null ? {
    position: 'fixed',
    left: `${dragState.setupGuidePosition.x}px`,
    top: `${dragState.setupGuidePosition.y + 42}px`, // Account for sandbar height
    bottom: 'auto',
    right: 'auto'
  } : {};

  return (
    <div 
      className="dashboard-container"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleGlobalDrop}
    >
      {/* Sandbar */}
      <div className="sandbar">
        <button onClick={onBack} className="back-btn">← Back to Projects</button>
        <span className="project-title">dock me, floatie</span>
      </div>

      <div className="dashboard-layout">
        {/* Nav */}
        <div className="nav">
          <h3>Navigation</h3>
          <div className="nav-item">Dashboard</div>
          <div className="nav-item">Analytics</div>
          <div className="nav-item">Settings</div>
        </div>

        {/* Drag-to-nav overlay */}
        <div 
          className={`drag-to-nav ${dragState.dragToNavActive ? 'active' : ''} ${dragState.dragToNavDropped ? 'dropped' : ''}`}
          onDragOver={(e) => handleDragOver(e, 'nav')}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, 'nav')}
        />

        {/* Dashboard */}
        <div className={`dashboard ${dragState.dragToRightActive || dragState.dragToRightDropped ? 'pushed-left' : ''}`}>
          <div className="dashboard-grid">
            <div className="dashboard-box large">Analytics Overview</div>
            <div className="dashboard-box">Sales</div>
            <div className="dashboard-box">Users</div>
            <div className="dashboard-box medium">Recent Activity</div>
            <div className="dashboard-box">Performance</div>
            <div className="dashboard-box medium">Reports</div>
          </div>
        </div>

        {/* Drag-to-right overlay */}
        <div 
          className={`drag-to-right ${dragState.dragToRightActive ? 'active' : ''} ${dragState.dragToRightDropped ? 'dropped' : ''}`}
          onDragOver={(e) => handleDragOver(e, 'right')}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, 'right')}
        />
      </div>

      {/* Setup Guide */}
      <div 
        className={`setup-guide ${dragState.isDragging ? 'dragging' : ''}`}
        style={setupGuideStyle}
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="drag-handle">
          <div className="drag-dots">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <div className="setup-content">
          <h4>Setup Guide</h4>
          <p>Drag me to dock panels!</p>
        </div>
      </div>
    </div>
  );
}

export default App;
