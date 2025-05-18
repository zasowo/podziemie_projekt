import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ProfilePage = ({ user }) => {
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const [editableUsername, setEditableUsername] = useState('');
  const [editableBio, setEditableBio] = useState('');

  useEffect(() => {
    if (!user || !user.id) {
      setError('Brak danych użytkownika do załadowania profilu.');
      setIsLoading(false);
      return;
    }

    const fetchProfileData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // miejsce na api call
        console.log(`Pobieranie danych profilu dla użytkownika ID: ${user.id}`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Symulacja opóźnienia
        
        // mockowe dane profilu, mogą być rozszerzone o dane z 'user' prop
        const mockData = {
          id: user.id,
          username: user.username,
          email: user.email,
          joinDate: new Date().toLocaleDateString('pl-PL'), // przykładowa data dołączenia
          bio: 'Entuzjasta historii i odkrywca zapomnianych opowieści. Lubię dzielić się wiedzą i dyskutować o przeszłości.',
          avatarUrl: `https://placehold.co/128x128/E0E0E0/B0B0B0?text=${user.username.charAt(0)}`,
          contributionsCount: Math.floor(Math.random() * 100), // losowa liczba
        };
        setProfileData(mockData);
        setEditableUsername(mockData.username);
        setEditableBio(mockData.bio);

      } catch (err) {
        setError('Nie udało się załadować danych profilu.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [user]); 

  const handleEditToggle = () => {
    if (isEditing) {
        //tutaj dać logike zapisywania i edytowania
    } else {
        if (profileData) {
            setEditableUsername(profileData.username);
            setEditableBio(profileData.bio);
        }
    }
    setIsEditing(!isEditing);
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setIsLoading(true); 
    setError(null);
    try {
        // dać call API PUT /api/users/${user.id}
        console.log('Zapisywanie danych profilu:', { username: editableUsername, bio: editableBio });
        await new Promise(resolve => setTimeout(resolve, 1500)); // symulacja zapisu

        setProfileData(prev => ({ ...prev, username: editableUsername, bio: editableBio }));
        setIsEditing(false); 

    } catch (err) {
        setError('Nie udało się zaktualizować profilu.');
        console.error(err);
    } finally {
        setIsLoading(false);
    }
  };


  if (isLoading) {
    return (
      <div className="text-center py-20">
        <FontAwesomeIcon icon={['fas', 'spinner']} spin size="3x" className="text-red-600" />
        <p className="text-lg text-gray-600 mt-4">Ładowanie profilu...</p>
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500 py-10">Błąd: {error}</p>;
  }

  if (!profileData) {
    return <p className="text-center text-gray-600 py-10">Nie znaleziono danych profilu.</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="bg-white shadow-xl rounded-lg p-6 md:p-8">
        <div className="flex flex-col sm:flex-row items-center mb-6">
          <img 
            src={profileData.avatarUrl} 
            alt={`Awatar ${profileData.username}`}
            className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover mr-0 sm:mr-6 mb-4 sm:mb-0 border-4 border-gray-200"
            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/128x128/E0E0E0/B0B0B0?text=A"; }}
          />
          <div className="text-center sm:text-left">
            {isEditing ? (
                <input 
                    type="text"
                    value={editableUsername}
                    onChange={(e) => setEditableUsername(e.target.value)}
                    className="text-2xl md:text-3xl font-bold text-gray-800 mb-1 border-b-2 border-red-500 focus:outline-none"
                />
            ) : (
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">{profileData.username}</h1>
            )}
            <p className="text-md text-gray-600">{profileData.email}</p>
            <p className="text-sm text-gray-500 mt-1">Dołączył/a: {profileData.joinDate}</p>
          </div>
          <div className="ml-auto mt-4 sm:mt-0">
            <button 
              onClick={handleEditToggle}
              className="px-4 py-2 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition"
            >
              <FontAwesomeIcon icon={isEditing ? ['fas', 'times-circle'] : ['fas', 'edit']} className="mr-2" />
              {isEditing ? 'Anuluj' : 'Edytuj profil'}
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">O mnie</h2>
          {isEditing ? (
            <textarea 
                value={editableBio}
                onChange={(e) => setEditableBio(e.target.value)}
                rows="4"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 text-gray-700 text-sm"
            />
          ) : (
            <p className="text-gray-700 text-sm whitespace-pre-line">{profileData.bio || 'Brak informacji o użytkowniku.'}</p>
          )}
        </div>
        
        {isEditing && (
            <div className="text-right">
                <button 
                    onClick={handleProfileSave}
                    disabled={isLoading}
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-50"
                >
                    <FontAwesomeIcon icon={['fas', 'save']} className="mr-2" />
                    Zapisz zmiany
                </button>
            </div>
        )}

        {!isEditing && (
            <div className="border-t border-gray-200 pt-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">Aktywność</h2>
            <div className="flex items-center text-gray-600 text-sm">
                <FontAwesomeIcon icon={['fas', 'pencil-alt']} className="mr-2 text-red-500" />
                <span>Liczba kontrybucji: {profileData.contributionsCount}</span>
            </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;