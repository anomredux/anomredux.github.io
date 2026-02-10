import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/home';
import { ProjectDetail } from './pages/project-detail';
import { AwardDetail } from './pages/award-detail';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/projects/:id" element={<ProjectDetail />} />
      <Route path="/awards/:id" element={<AwardDetail />} />
    </Routes>
  );
}
