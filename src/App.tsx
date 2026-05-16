import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { TaskCompression } from './pages/TaskCompression';
import { TaskScenario } from './pages/TaskScenario';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/task/compression" element={<TaskCompression />} />
        <Route path="/task/scenario" element={<TaskScenario />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
