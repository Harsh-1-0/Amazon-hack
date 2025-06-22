"use client";
import {useState,useEffect} from 'react';
import axios from 'axios';
import Grid from './grid';
import Buttons from './buttons';
import Otts from './otts';


export default function Landing() {
    const [user, setUser] = useState(null);
    useEffect(()=>{
        const getUser = async()=>{
            try{
                const response = await axios.get(`${process.env.NEXT_PUBLIC_CHAT_SERVER}/user`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
                        "Content-Type": "multipart/form-data",
                    },
                });
                console.log("User data fetched:", response.data.archetypes[response.data.archetypes.length - 1].name);
                setUser(response.data);
            }catch(err){
                console.log("Error fetching user data:", err);
            } 
        }
        getUser();
    },[]);
    return (
        <div className="h-screen w-screen bg-cover background-image flex flex-col justify-between items-center">
            <div className="h-1/3 w-full flex justify-end px-5">
                <div></div>
                <div>{user?user.name:" "}</div>
                <div>{user ? user.archetypes[user.archetypes.length - 1].name : ""}</div>
            </div>
            <div className="h-2/3 w-full backdrop-blur-lg items-center justify-center px-5">
                <div className='p-3 flex justify-between items-center w-full'>
                    <Buttons url={user ? user.picture : ""} />
                    <Otts />
                </div>
                <Grid />
            </div>
        </div>
    );
}
