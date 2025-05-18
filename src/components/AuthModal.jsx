import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const AuthModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isLoginView, setIsLoginView] = useState(true); 
  const modalRef = useRef(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); 
  const [username, setUsername] = useState(''); 
  const [error, setError] = useState(''); 
  const [isLoading, setIsLoading] = useState(false); // stan ładowania dla operacji API

  useEffect(() => {
    if (!isOpen) {
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setUsername(''); 
      setError(''); 
      setIsLoading(false); 
      // setIsLoginView(true); // opcjonalnie: zawsze otwieraj w widoku logowania
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleOverlayClick = (e) => {
    if (modalRef.current && e.target === modalRef.current) {
      onClose();
    }
  };

  const handleSubmit = async (e) => { 
    e.preventDefault();
    setError(''); 
    setIsLoading(true); 

    try {
      if (isLoginView) {
        // przy podpinaniu API
        console.log('Próba logowania z:', { email, password });
        // 
        // const response = await fetch('/api/auth/login', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ email, password }),
        // });
        // const data = await response.json();
        // if (!response.ok) {
        //   throw new Error(data.message || 'Logowanie nie powiodło się.');
        // }
        // onLoginSuccess(data.user); // Przekaż dane użytkownika z odpowiedzi API

        // mock API
        await new Promise(resolve => setTimeout(resolve, 1000)); // symulacja opóźnienia sieciowego
        if (email === "test@example.com" && password === "password123") {
          onLoginSuccess({ id: 1, username: "Mondry student", email: email, token: "fake-jwt-token" });
        } else {
          throw new Error("Nieprawidłowy e-mail lub hasło.");
        }

      } else {
        if (password !== confirmPassword) {
          throw new Error('Hasła nie są zgodne!');
        }
        if (password.length < 8) {
          throw new Error('Hasło musi mieć co najmniej 8 znaków.');
        }
        console.log('Próba rejestracji z:', { username, email, password });
        // gdy bedzie API
        // const response = await fetch('/api/auth/register', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ username, email, password }),
        // });
        // const data = await response.json();
        // if (!response.ok) {
        //   throw new Error(data.message || 'Rejestracja nie powiodła się.');
        // }
        // onLoginSuccess(data.user); // przekaż dane użytkownika z odpowiedzi API (jeśli rejestracja automatycznie loguje)
        // lub wyświetl komunikat o sukcesie i poproś o zalogowanie

        // Symulacja wywołania API (zastąp to powyższym)
        await new Promise(resolve => setTimeout(resolve, 1000));
        onLoginSuccess({ id: Date.now(), username: username, email: email, token: "fake-jwt-token" });
      }
    } catch (err) {
      setError(err.message || 'Wystąpił nieoczekiwany błąd.');
    } finally {
      setIsLoading(false); 
    }
  };

  const switchToRegister = () => {
    setIsLoginView(false);
    setError(''); setIsLoading(false);
    setEmail(''); setPassword(''); setConfirmPassword(''); setUsername('');
  };

  const switchToLogin = () => {
    setIsLoginView(true);
    setError(''); setIsLoading(false);
    setEmail(''); setPassword(''); setConfirmPassword(''); setUsername('');
  };

  return (
    <div
      ref={modalRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 transition-opacity duration-300 ease-in-out opacity-100"
      aria-modal="true"
      role="dialog"
      aria-labelledby="auth-modal-title"
    >
      <div className="bg-white rounded-lg w-full max-w-md mx-auto p-6 sm:p-8 shadow-xl transform transition-all duration-300 ease-in-out scale-100">
        <div className="flex justify-between items-center mb-6">
          <h3 id="auth-modal-title" className="text-xl sm:text-2xl font-bold text-gray-800">
            {isLoginView ? 'Zaloguj się' : 'Utwórz konto'}
          </h3>
          <button 
            onClick={onClose} 
            disabled={isLoading} 
            className="text-gray-500 hover:text-red-600 p-1 -m-1 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
            aria-label="Zamknij modal"
          >
            <FontAwesomeIcon icon={['fas', 'times']} className="text-xl h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoginView && ( 
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Nazwa użytkownika <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="username"
                id="username"
                required
                disabled={isLoading}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm disabled:bg-gray-50"
                placeholder="np. JanKowalski"
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Adres e-mail <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              disabled={isLoading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm disabled:bg-gray-50"
              placeholder="ty@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Hasło <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              id="password"
              required
              disabled={isLoading}
              minLength={isLoginView ? undefined : 8} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm disabled:bg-gray-50"
              placeholder="••••••••"
            />
             {!isLoginView && <p className="text-xs text-gray-500 mt-1">Minimum 8 znaków.</p>}
          </div>

          {!isLoginView && ( 
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Potwierdź hasło <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                required
                disabled={isLoading}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm disabled:bg-gray-50"
                placeholder="••••••••"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : null}
            {isLoading ? (isLoginView ? 'Logowanie...' : 'Rejestrowanie...') : (isLoginView ? 'Zaloguj się' : 'Zarejestruj się')}
          </button>
        </form>

        <div className="mt-6 text-sm text-center">
          {isLoginView ? (
            <>
              <p className="text-gray-600">
                Nie masz konta?{' '}
                <button
                  onClick={switchToRegister}
                  disabled={isLoading}
                  className="font-medium text-red-600 hover:text-red-500 hover:underline focus:outline-none disabled:opacity-75"
                >
                  Utwórz konto
                </button>
              </p>
              <p className="mt-2">
                <a href="#" className={`font-medium text-gray-500 hover:text-gray-700 hover:underline focus:outline-none ${isLoading ? 'opacity-75 pointer-events-none' : ''}`}>
                  Nie pamiętasz hasła?
                </a>
              </p>
            </>
          ) : (
            <p className="text-gray-600">
              Masz już konto?{' '}
              <button
                onClick={switchToLogin}
                disabled={isLoading}
                className="font-medium text-red-600 hover:text-red-500 hover:underline focus:outline-none disabled:opacity-75"
              >
                Zaloguj się
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;