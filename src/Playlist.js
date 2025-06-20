import { useEffect, useRef, useState } from 'react';
import { FaPlay, FaTrash } from "react-icons/fa";

function Playlist(){
    //const[songs, setSongs] = useState([]);
    const audioRefs = useRef({});
    const[playlists, setPlaylists] = useState([]);

    useEffect(() =>{

        async function fetchPlaylists(){
            const username = localStorage.getItem('username');
            if(!username){
                console.warn("No username found in localStorage");
                return;
            }

            try{
                const res = await fetch(`http://127.0.0.1:5000/playlists?username=${username}`);
                const data = await res.json();
                setPlaylists(data);
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
            const res = await fetch(`http://127.0.0.1:5000/playlist/${id}`, {
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

    return(
        <div className="centered-card">
            <h2 className="subtitle"> 🎧 Your Playlists</h2>
            {playlists.length === 0 ? (
                <p>No playlists saved yet.</p>
            ): (
                playlists.map((pl) => (
                    <div key={pl.id} style={cardStyle}>
                        <div style={headerStyle}>
                            <h3 style={{margin: 0}}>{pl.name}</h3>
                            <button onClick={() => deletePlaylist(pl.id)} style={iconButton}> <FaTrash /></button>
                            {pl.share_id && (
                                <button onClick={() => copyShareLink(pl.share_id)} style={{marginLeft: "1rem"}}> Share </button>
                            )}
                        </div>
                        <ul style={{paddingLeft: 0, listStyle: "none", marginTop: "1rem"}}>
                            {pl.songs.map((song, i) => {
                                const isObj = typeof song ==='object';
                                const label = isObj ?`${song.title} - ${song.artist}` : song;
                                const url = isObj ? song.url : "";

                                return(
                                    <li key={i} style ={songItemStyle}>
                                        <div style={{display: "flex", alignItems:"center", gap:"0.5rem"}}>
                                            <button onClick={() => togglePlay(`${pl.id}-${i}`)} style= {iconButton}><FaPlay /></button>
                                            <span>{label}</span>
                                        </div>
                                        {url && (
                                            <audio ref={(el)=>(audioRefs.current[`${pl.id}-${i}`] =el)}
                                            src ={url}/>
                                        )}
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