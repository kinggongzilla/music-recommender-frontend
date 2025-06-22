import './App.css';
import Playlist from './Playlist';
import Profile from './Profile';

import { useEffect, useRef, useState } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';

import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import SharedPlaylist from "./SharedPlaylist";


function NavBar({currentView, onNavigate, onLogout, onToggleTheme }){
  const [menuOpen, setMenuOpen] = useState(false);

  const handleClick =(view) =>{
    onNavigate(view);
    setMenuOpen(false);
  };

  const isActive = (view) => currentView === view;

  const isDark = document.body.classList.contains('dark');

  return (
    <>
      <div className="navbar">
        <div className="logo">Brewtune</div>
        <div className="menu-toggle" onClick={()=> setMenuOpen(!menuOpen)}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
      </div>
    
      <div className={`side-menu ${menuOpen ? 'open' : ''}`}>
        <button className={isActive('home') ? 'active-button' : ''}
        onClick={()=> handleClick('home')}>Home</button>
        <button className={isActive('profile') ? 'active-button' : ''}
        onClick={()=> handleClick('profile')}>Profile</button>
        <button className={isActive('playlist') ? 'active-button' :''}
        onClick={()=>handleClick('playlist')}>Playlists</button>
        <button onClick={onLogout}>Logout</button>
        <button onClick={onToggleTheme} style={{display: 'flex', alignItems:'center', gap: '0.5rem'}}>
          {isDark ? <FaSun/> : <FaMoon/>} Theme
        </button>
      </div>

      {menuOpen &&(
        <div className="overlay" onClick={() => setMenuOpen(false)}></div>
      )}
    </>
  );
}
function LoginPage({ onLogin }){
  const[isRegistering, setIsRegistering] = useState(false);
  const[username, setUsername] = useState('');
  const[password, setPassword] = useState('');
  const[confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async () => {
    if(!username|| !password || (isRegistering && !confirmPassword)){
      alert('please fill in all fields');
      return;
    }

    if(isRegistering && password !== confirmPassword){
      alert("Passwords don't match");
      return;
    }
    const url = isRegistering ? 'http://127.0.0.1:5001/register' : 'http://127.0.0.1:5001/login';
    try{
      const response = await fetch(url,{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, password}),
      });

      const data = await response.json();
      if(response.ok){
        alert(data.message);
        if(!isRegistering){
          localStorage.setItem('username', username);
          onLogin();
        }else{
          setIsRegistering(false);
          setUsername('');
          setPassword('');
          setConfirmPassword('');
        }
      }else{
        alert(data.message|| 'An error occurred');
      }
    }catch(error){
      alert("Connection error");
    }
  };

  return (
    <div className="centered-card">
      <h1 className="main-title"> 🎵 Brewtune</h1>
      <div className="login-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=> setPassword(e.target.value)}
          />
          {isRegistering && (
            <input
              type ="password"
              placeholder="Confirm Password"
              value = {confirmPassword}
              onChange={(e) =>setConfirmPassword(e.target.value)}
            />
          )}
          <button onClick={handleSubmit}>
            {isRegistering ? 'Sign Up' : 'Login'}
          </button>
          <p style={{marginTop: '10px'}}>
            {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
            <span
              style={{ color: 'blue', cursor: 'pointer'}}
              onClick={() =>{
                setIsRegistering(!isRegistering)
                setUsername('');
                setPassword('');
                setConfirmPassword('');
              }}
            >
              {isRegistering ? 'Login here' : 'Sign up here'}
            </span>
          </p>
      </div>
    </div>
  );
}


function MusicRecommender() {
  const[songs, setSongs] = useState(()=>{
    const saved = localStorage.getItem('songs');
    return saved ? JSON.parse(saved) :[];
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [playlistName, setPlaylistName] = useState('');
  const [likedSongs, setLikedSongs] = useState(() => JSON.parse(localStorage.getItem('likedSongs')) || {});
  const [currentIndex, setCurrentIndex] = useState(0);
  const audioRef = useRef(null);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved): [];
  });

  const currentSong = songs[currentIndex];

  const playNext = () => {
    const next = (currentIndex + 1 )
  }

  const sendText = async () => {
    setLoading(true);
    await new Promise((resolve)=>setTimeout(resolve, 500));
    
    try{
      const res = await fetch('http://localhost:5001/recommend',
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({text: input}),
        });
        const data = await res.json();
        const recommendedSongs = data.songs || [];
        setSongs(recommendedSongs);
        localStorage.setItem('songs', JSON.stringify(recommendedSongs));
    }catch (error){
      console.warn('API unavailable. Showing mock songs .');
      const mockSongs=[
        { title: 'Mock Song 1', artist: 'Artist', url: '' },
        { title: 'Mock Song 2', artist: 'Artist', url: '' },
        { title: 'Mock Song 3', artist: 'Artist', url: '' },
      ];
      setSongs(mockSongs);
      localStorage.setItem('songs', JSON.stringify(mockSongs));
    }finally{
      setLoading(false);
    }
  };

  const savePlaylist = async () => {
    if(!playlistName){
      alert("Enter a playlist name");
      return;
    }

    const username = localStorage.getItem('username');
    if(!username){
      alert("You're not logged in.");
      return;
    }

    const normalizedSongs = songs.map(song =>

      typeof song === 'string'
      ? {title: song, artist: 'Unknown', url:''}
      :song
    );

      try{
        const res = await fetch('http://localhost:5001/playlist', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            username,
            name: playlistName,
            songs: normalizedSongs
          }),
        });

      const data = await res.json();
      alert(data.message);
      setPlaylistName('');
    }catch(error){
      alert("Could not save playlist.");
    }
  };

  const handleClear = () => {
    setInput('');
    setSongs([]);
    localStorage.removeItem('songs');
  };

  return (
    <div className="centered-card">
      <h2 className="subtitle">Tell us your mood or activity</h2>
      <div className="input-row">
        <input
          value ={input}
          onChange={e => setInput(e.target.value)}
          placeholder="e.g. feeling sad, studying ..."
        />
        <button onClick={sendText} style={{marginLeft: '1rem'}}>Get Songs</button>
      </div>
      <button onClick={handleClear}>Clear</button>

      {loading && <div className="spinner"></div>}

      {songs.length > 0 && !loading && (
        <div className="song-list">
          <h3>Recommend songs</h3>
          <ul>
            {songs.map((song, index) => (
              <li key={index}>{typeof song === 'string'? song :`${song.title} - ${song.artist}` }</li>
            ))}
          </ul>
          <input type="text" placeholder="Playlist name" value={playlistName}
          onChange={(e) => setPlaylistName(e.target.value)}
          style ={{marginTop: '1rem'}}
          />
          <button onClick={savePlaylist}>Save Playlist</button>
        </div>
      )}

    </div>
  );
}

function App(){
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const[showRecommender, setShowRecommender] = useState(true);

  const handleHome = () => {
    setShowRecommender(true);
  };
  const handleLogout = () => {
    setLoggedIn(false);
    localStorage.removeItem('username');
    localStorage.removeItem('songs');
  };

  const handleNavigate = (view) => {
    setCurrentView(view);
  };

  const handleToggleTheme = () => {
    const isDark = document.body.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme == 'dark'){
      document.body.classList.add('dark');
    }
    
    const username = localStorage.getItem('username');
    if(username){
      setLoggedIn(true);
    }
  }, []);

  return(
    <Router>
      <Routes>
        <Route path = "/" element={!loggedIn ? (<LoginPage onLogin={() => setLoggedIn(true)}/>
        ) : (
          <>
            <NavBar currentView={currentView} onNavigate={handleNavigate} onLogout={handleLogout} onToggleTheme={handleToggleTheme}/>
            <div className = "page-content">
              {currentView==="home" && <MusicRecommender />}
              {currentView==="profile" && <Profile />}
              {currentView==="playlist" && <Playlist />}
            </div>
          </>
        )
        }
      />
      <Route path="/shared/:id" element={<SharedPlaylist />} />
      <Route path="*" element={<Navigate to ="/" />} />
    </Routes>
  </Router>
  );
  
}

const likeSong = async (song) => {
  const username = localStorage.getItem("username");
  if (!username){
    alert ("Please log in to like songs !");
    return;
  }

  try{
    const res = await fetch("http://localhost:5001/like", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body:JSON.stringify({
        username,
        title:song.title,
        artist:song.artist || "Unknown",
        url: song.url,
      }),
    });

    const data = await res.json();
    if(res.ok){
      alert(`You liked ${song.title}`);
    }else{
      alert(data.message || "Couldn't like song")
    }
  }catch(error){
    alert("Something went wrong");
  }
};

export default App;
