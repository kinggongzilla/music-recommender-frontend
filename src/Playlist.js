import { useEffect, useRef, useState } from 'react';
import { FaEdit, FaPlay, FaSave, FaTrash } from "react-icons/fa";

function Playlist(){
    //const[songs, setSongs] = useState([]);
    const audioRefs = useRef({});
    const[playlists, setPlaylists] = useState([]);
    const[editingId, setEditingId] = useState(null);
    const[editName, setEditName] = useState('');
    const[likedSongs, setLikedSongs] = useState(() => JSON.parse(localStorage.getItem('likedSongs')) || {});

    useEffect(() =>{

        async function fetchPlaylists(){
            const username = localStorage.getItem('username');
            if(!username){
                console.warn("No username found in localStorage");
                return;
            }

            try{
                const res = await fetch(`http://127.0.0.1:5001/playlists?username=${username}`);
                const data = await res.json();
                setPlaylists(data.map(p => ({
                    ...p,
                    songs: typeof p.songs === 'string' ? JSON.parse(p.songs) : p.songs || []
                })));
            }catch(error){
                console.error("fetch failed", error);
            }
        }

        fetchPlaylists();
    }, []);

    const togglePlay = (id) => {
        const audio = audioRefs.current[id];
        if(!audio) return;

        Object.values(audioRefs.current).forEach((a)=>{
            if(a!== audio) a.pause();
        });
        if(audio.paused){
            audio.play();
        }else{
            audio.pause();
        }
    };

    const deletePlaylist = async(id) => {
        if(!window.confirm("Are you sure you want to delete this playlist?"))return;
        try{
            const res = await fetch(`http://127.0.0.1:5001/playlist/${id}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            alert(data.message);
            setPlaylists((prev)=>prev.filter((pl)=>pl.id !==id));
        }catch(error){
            console.error("delete failed", error);
            alert("could not delete playlist.");
        }
    };

    const copyShareLink = (shareId) =>{
        const url = `${window.location.origin}/shared/${shareId}`;
        navigator.clipboard.writeText(url);
        alert("Shareable link copied to clipboard");
    };

    const toggleLike =(title) => {
        setLikedSongs( prev =>{
            const updated ={...prev, [title]: !prev[title] };
            localStorage.setItem('likedSongs', JSON.stringify(updated));
            return updated;
        });
    };

    const startEditing = (id, currentName) => {
        setEditingId(id);
        setEditName(currentName);
    };

    const saveNewName = async (id) => {
        try{
            await fetch(`http://127.0.0.1:5001/playlist/${id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({name: editName}),
            });
            setPlaylists((prev)=> prev.map(p => p.id === id ? {...p, name: editName}: p));
            setEditingId(null);
            setEditName('');
        }catch(error){
            alert('Rename failed.');
        }
    };

    return(
        <div className="centered-card">
            <h2 className = "subtitle">🎧 Your Playlists</h2>
            {playlists.length === 0 ? (
                <p>No playlists saved yet.</p>
            ): (
                playlists.map((pl) => (
                    <div key={pl.id} style={cardStyle}>
                        <div style={headerStyle}>
                            {editingId == pl.id ? (
                                <>
                                    <input value={editName} onChange={(e) => setEditName(e.target.value)} />
                                    <button onClick={()=> saveNewName(pl.id)}> <FaSave /></button>
                                </>
                            ): (
                                <>
                                    <h3 style ={{margin : 0}}> {pl.name}</h3>
                                    <button onClick={() => startEditing(pl.id, pl.name)} style={iconButton}><FaEdit /></button>
                                </>
                            )
                        }
                        <button onClick={() => deletePlaylist(pl.id)} style={iconButton}><FaTrash /></button>
                        {pl.share_id && (
                            <button onClick={() => copyShareLink(pl.share_id)} style={{marginLeft: "1rem"}}>🔗 Share</button>
                        )}
                        </div>
                        <ul style= {{ listStyle: 'none', padding: 0}}>
                            {pl.songs.map((song, i)=>{
                                const label = typeof song === 'object' ? `${song.title} - ${song.artist}` : song;
                                const url = typeof song === 'object' ? song.url : '';
                                const id = `${pl.id}-${i}`;
                                return (
                                    <li key={i} style={songItemStyle}>
                                        <div style={{display: "flex", alignItems: "center", gap: "0.5rem"}}>
                                            <button onClick={() => togglePlay(id)} style={iconButton}><FaPlay /></button>
                                            <span>{label}</span>
                                            <button onClick={() => toggleLike(song.title)} style={iconButton}>{likedSongs[song.title] ? '💖' : '🤍'}</button>
                                        </div>
                                        {url && <audio ref={ el => (audioRefs.current[id] = el)} src={url} />}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))
            )}
        </div>
    );
}

const cardStyle = {
    backgroundColor: "var(--card-bg)",
    padding: "1.5rem",
    borderRadius: "1rem",
    marginBottom: "2rem",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
};

const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
};

const songItemStyle = {
    padding: "0.75rem 1rem",
    backgroundColor: "var(--highlight)",
    color: "var(--highlight-text)",
    borderRadius: "0.5rem",
    marginBottom: "0.5rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
};

const iconButton = {
    background: "none",
    border: "none",
    color: "var(--highlight-text)",
    cursor: "pointer",
    fontSize: "1rem",
};


export default Playlist;