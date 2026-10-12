import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppProvider } from './hooks/AppContext.jsx';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import TopicPage from './pages/TopicPage.jsx';
import FormulaSheetPage from './pages/FormulaSheetPage.jsx';
import QuickRevisionPage from './pages/QuickRevisionPage.jsx';
import GlossaryPage from './pages/GlossaryPage.jsx';
import QuizHubPage from './pages/QuizHubPage.jsx';
import QuizPage from './pages/QuizPage.jsx';

// HashRouter keeps deep links working on Vercel/Netlify without rewrite rules.
export default function App() {
  return (
    <AppProvider>
      <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="topic/:id" element={<TopicPage />} />
            <Route path="formulas" element={<FormulaSheetPage />} />
            <Route path="revision" element={<QuickRevisionPage />} />
            <Route path="glossary" element={<GlossaryPage />} />
            <Route path="quizzes" element={<QuizHubPage />} />
            <Route path="quiz/:unit" element={<QuizPage />} />
            <Route path="test" element={<QuizPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </AppProvider>
  );
}
