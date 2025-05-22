import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Healthcheck from './components/Healthcheck';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import Logout from './components/Logout';
import CreateRecord from './components/CreateRecord';
import UserRecords from './components/UserRecords';
import RecordsDashboard from './components/RecordsDashboard';
import AnnualRecords from './components/AnnualRecords';

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  const navigate = useNavigate(); // Hook for navigation

  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Header handleNavigate={navigate} />
              <Home />
            </>
          }
        />
        <Route
          path="/healthcheck"
          element={
            <>
              <Header handleNavigate={navigate} />
              <Healthcheck />
            </>
          }
        />
        <Route path="/register" element={<Register handleNavigate={navigate} />} />
        <Route path="/login" element={<Login handleNavigate={navigate} />} />
        <Route path="/logout" element={<Logout handleNavigate={navigate} />} />
        <Route
          path="/dashboard"
          element={
            <>
              <Header handleNavigate={navigate} />
              <RecordsDashboard handleNavigate={navigate} />
            </>
          }
        />
        <Route
          path="/dashboard/annual"
          element={
            <>
              <Header handleNavigate={navigate} />
              <AnnualRecords handleNavigate={navigate} />
            </>
          }
        />
        <Route
          path="/records"
          element={
            <>
              <Header handleNavigate={navigate} />
              <UserRecords handleNavigate={navigate} />
            </>
          }
        />
        <Route
          path="/records/create"
          element={
            <>
              <Header handleNavigate={navigate} />
              <CreateRecord handleNavigate={navigate} />
            </>
          }
        />
        <Route
          path="*"
          element={
            <>
              <Header handleNavigate={navigate} />
              <Home />
            </>
          }
        />
      </Routes>
    </div>
  );
}

export default App;