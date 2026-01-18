import { useState } from 'react';
import { Header } from './components/Layout/Header';
import { HomePage } from './pages/HomePage';
import { MyListingsPage } from './pages/MyListingsPage';
import { AddRoomForm } from './components/AddRoom/AddRoomForm';
import { LoginModal } from './components/Auth/LoginModal';
import { SignupModal } from './components/Auth/SignupModal';
import { useAuth } from './contexts/AuthContext';

type View = 'home' | 'add' | 'myListings';

function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const { user } = useAuth();

  const handleNavigate = (view: View) => {
    if (!user && (view === 'add' || view === 'myListings')) {
      setShowLoginModal(true);
      return;
    }
    setCurrentView(view);
  };

  const handleAddRoomSuccess = () => {
    setCurrentView('myListings');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        onLoginClick={() => setShowLoginModal(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'home' && <HomePage />}
        {currentView === 'add' && user && (
          <AddRoomForm onSuccess={handleAddRoomSuccess} />
        )}
        {currentView === 'myListings' && user && <MyListingsPage />}
      </main>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToSignup={() => {
          setShowLoginModal(false);
          setShowSignupModal(true);
        }}
      />

      <SignupModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        onSwitchToLogin={() => {
          setShowSignupModal(false);
          setShowLoginModal(true);
        }}
      />
    </div>
  );
}

export default App;
