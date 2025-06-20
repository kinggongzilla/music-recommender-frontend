import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

function SharedPlaylist(){
    const { id } = useParams();
    const[playlist, setPlaylist] = useState(null);
    const[loading, setLoading] = useState(true);
    const audioRefs = useRef({});

    useEffect(() => {
        async function fetchShared(){
            try{
                const res = await fetch(`http://127.0.0.1:5000/shared/${id}`);
                if(!res.ok){
                    throw new Error("Playlist not found");
                }
                const data = await res.json();
                setPlaylist(data);
            }catch(error){
                console.error(error);
                setPlaylist(null);
            }finally{
                setLoading(false);
            }
        }
        fetchShared();
    }, [id]);

    const togglePlay = (key) => {
        const audio = audioRefs.current[key];
        if(!audio) return;

        Object.values(audioRefs.current).forEach((a) =>{
            if(a!==audio) a.pause();
        });

        if(audio.paused){
            audio.play();
        }else{
            audio.pause();
        }
    };

    if(loading) {
        return <div className="centered-card">
            <div className="spinner"></div>
        </div>;
    }

    if(!playlist){
        return <div className="centered-card">
            <h2 className="subtitle">Playlist not found.</h2>
        </div>;
    }

    return(
        <div className="centered-card">
            <h2 className="subtitle"> Shared Playlist: {playlist.name}</h2>
            <ul>
                {playlist.songs.map((song, i)=>
                (
                    <li key={i}>
                        <div><strong>{song.title} - {song.artist}</strong></div>
                        <audio ref={(el) => (audioRefs.current[i] = el)} src={song.url} />
                        <button onClick={() => togglePlay(i)}> Play/Pause</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SharedPlaylist;