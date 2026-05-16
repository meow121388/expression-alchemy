import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TaskScenario } from './pages/TaskScenario';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TaskScenario />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
