import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppLayout from './components/common/AppLayout';
import AIInsights from './pages/AIInsights';
import MatchingCenter from './pages/MatchingCenter';

const App: React.FC = () => {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/ai-insights" element={<AIInsights />} />
          <Route path="/matching-center" element={<MatchingCenter />} />
          <Route path="/" element={<AIInsights />} />
        </Routes>
      </AppLayout>
    </Router>
  );
};

export default App;
