import { Home, Plus, List, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  currentView: 'home' | 'add' | 'myListings';
  onNavigate: (view: 'home' | 'add' | 'myListings') => void;
  onLoginClick: () => void;
}

export function Header({ currentView, onNavigate, onLoginClick }: HeaderProps) {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Home className="text-blue-600" size={28} />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">RoomFinder</h1>
          </div>

          <nav className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={() => onNavigate('home')}
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'home'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Home size={18} />
              <span className="hidden sm:inline">Search</span>
            </button>

            {user && (
              <>
                <button
                  onClick={() => onNavigate('add')}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === 'add'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Plus size={18} />
                  <span className="hidden sm:inline">Add Room</span>
                </button>

                <button
                  onClick={() => onNavigate('myListings')}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === 'myListings'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <List size={18} />
                  <span className="hidden sm:inline">My Listings</span>
                </button>

                <button
                  onClick={signOut}
                  className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <LogOut size={18} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}

            {!user && (
              <button
                onClick={onLoginClick}
                className="flex items-center space-x-1 px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                <LogIn size={18} />
                <span>Login</span>
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
