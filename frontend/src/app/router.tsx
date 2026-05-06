import { Routes, Route } from 'react-router-dom';

const PlaceholderHome = () => (
  <div className="min-h-screen flex items-center justify-center bg-surface-50">
    <div className="text-center">
      <h1 className="text-4xl font-display font-bold text-primary-500 mb-4">
        Food Store
      </h1>
      <p className="text-lg text-slate-600 font-sans">
        Frontend Ready
      </p>
    </div>
  </div>
);

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<PlaceholderHome />} />
    </Routes>
  );
};
