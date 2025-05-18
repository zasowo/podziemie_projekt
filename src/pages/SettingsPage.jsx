import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Przyjmuje 'user' jako prop z App.js
const SettingsPage = ({ user }) => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    newsletterSubscription: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveStatus, setSaveStatus] = useState(''); 

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordChangeError, setPasswordChangeError] = useState('');
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState('');


  useEffect(() => {
    if (!user || !user.id) {
      setError('Brak danych użytkownika do załadowania ustawień.');
      setIsLoading(false);
      return;
    }
    const fetchSettings = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // dać call API GET /api/users/${user.id}/settings
        console.log(`Pobieranie ustawień dla użytkownika ID: ${user.id}`);
        await new Promise(resolve => setTimeout(resolve, 800));
        // mockowe ustawienia
        setSettings({
          emailNotifications: true,
          newsletterSubscription: false,
        });
      } catch (err) {
        setError('Nie udało się załadować ustawień.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, [user]);

  const handleSettingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setSaveStatus(''); 
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setIsLoading(true); 
    setError(null);
    setSaveStatus('');
    try {
      // dać call API PUT /api/users/${user.id}/settings
      console.log('Zapisywanie ustawień:', settings);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSaveStatus('success');
    } catch (err) {
      setError('Nie udało się zapisać ustawień.');
      setSaveStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordChangeError('');
    setPasswordChangeSuccess('');
    setIsLoading(true); 

    if (newPassword !== confirmNewPassword) {
        setPasswordChangeError('Nowe hasła nie są zgodne.');
        setIsLoading(false);
        return;
    }
    if (newPassword.length < 8) {
        setPasswordChangeError('Nowe hasło musi mieć co najmniej 8 znaków.');
        setIsLoading(false);
        return;
    }

    try {
        // dać call API POST /api/users/${user.id}/change-password
        console.log('Zmiana hasła dla:', user.email, { currentPassword: '***', newPassword: '***' });
        await new Promise(resolve => setTimeout(resolve, 2000));
        // case: stare hasło jest poprawne
        // if (mockCheckOldPassword(currentPassword)) {
        setPasswordChangeSuccess('Hasło zostało zmienione pomyślnie.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        // } else {
        //   setPasswordChangeError('Obecne hasło jest nieprawidłowe.');
        // }
    } catch (err) {
        setPasswordChangeError('Nie udało się zmienić hasła. Spróbuj ponownie.');
    } finally {
        setIsLoading(false);
    }
  };

  if (isLoading && !settings.emailNotifications) {
    return (
      <div className="text-center py-20">
        <FontAwesomeIcon icon={['fas', 'spinner']} spin size="3x" className="text-red-600" />
        <p className="text-lg text-gray-600 mt-4">Ładowanie ustawień...</p>
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500 py-10">Błąd: {error}</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Ustawienia Konta</h1>
      
      <form onSubmit={handleSaveChanges} className="bg-white shadow-xl rounded-lg p-6 md:p-8 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-3">Powiadomienia</h2>
          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                name="emailNotifications"
                checked={settings.emailNotifications}
                onChange={handleSettingChange}
                className="form-checkbox h-5 w-5 text-red-600 rounded border-gray-300 focus:ring-red-500"
              />
              <span className="text-gray-700 text-sm">Otrzymuj powiadomienia e-mail o aktywności na koncie</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                name="newsletterSubscription"
                checked={settings.newsletterSubscription}
                onChange={handleSettingChange}
                className="form-checkbox h-5 w-5 text-red-600 rounded border-gray-300 focus:ring-red-500"
              />
              <span className="text-gray-700 text-sm">Zapisz się na nasz newsletter</span>
            </label>
          </div>
        </div>

        
        {saveStatus === 'success' && <p className="text-sm text-green-600">Ustawienia zapisane pomyślnie!</p>}
        {saveStatus === 'error' && <p className="text-sm text-red-600">Błąd zapisu ustawień.</p>}

        <div className="pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-2.5 bg-red-600 text-white font-medium text-sm rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition disabled:opacity-50"
          >
            {isLoading && !passwordChangeError && !passwordChangeSuccess ? 'Zapisywanie...' : 'Zapisz zmiany'}
          </button>
        </div>
      </form>

      <form onSubmit={handleChangePassword} className="bg-white shadow-xl rounded-lg p-6 md:p-8 space-y-6 mt-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">Zmień hasło</h2>
        {passwordChangeError && <p className="text-sm text-red-600">{passwordChangeError}</p>}
        {passwordChangeSuccess && <p className="text-sm text-green-600">{passwordChangeSuccess}</p>}
        <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">Obecne hasło</label>
            <input type="password" id="currentPassword" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" />
        </div>
        <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">Nowe hasło</label>
            <input type="password" id="newPassword" value={newPassword} onChange={e => setNewPassword(e.target.value)} required minLength="8" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" />
            <p className="text-xs text-gray-500 mt-1">Minimum 8 znaków.</p>
        </div>
        <div>
            <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700 mb-1">Potwierdź nowe hasło</label>
            <input type="password" id="confirmNewPassword" value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" />
        </div>
        <div className="pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-2.5 bg-gray-700 text-white font-medium text-sm rounded-md shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition disabled:opacity-50"
          >
            {isLoading && (passwordChangeError || passwordChangeSuccess) ? 'Zmienianie...' : 'Zmień hasło'}
          </button>
        </div>
      </form>

    </div>
  );
};

export default SettingsPage;
