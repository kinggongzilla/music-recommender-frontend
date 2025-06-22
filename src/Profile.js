import { useEffect, useState } from "react";

function Profile(){
    const [username, setUsername] = useState('');
    const [playlist, setPlaylistCount] = useState(0);
    const [songCount, setSongCount] = useState(0);

    useEffect(() => {
        const savedUsername = localStorage.getItem('username');
        if(savedUsername) {
            setUsername(savedUsername);

            fetch(`http://127.0.0.1:5001/playlists?username=${savedUsername}`)
            .then(res => res.json())
            .then(data => {
                setPlaylistCount(data.length);
                const allSongs = data.flatMap(p => p.songs);
                setSongCount(allSongs.length);
            })
            .catch(error => console.error("Failed to load playlists", error))
        }
    }, []);

    const handleClearPlaylists = async () => {
        const confirmClear = window.confirm("Are you sure you want to delete all your playlists?")
        if(!confirmClear) return;

        try{
            await fetch('http://127.0.0.1:5001/clear_playlists', {
                method: 'POST'
            });
            alert("All playlists deleted.");
            setPlaylistCount(0);
            setSongCount(0);
        }catch(error){
            alert("Error clearing playlists.");
        }
    };

    return(
        <div className="centered-card">
            <h2 className="subtitle">Profile</h2>
            <p><strong>Username:</strong>{username}</p>
            <p><strong>Total Songs:</strong>{songCount}</p>
            <button onClick={handleClearPlaylists} style={{marginTop: '1rem'}}>Clear All Playlists</button>
        </div>
    );

}

export default Profile;