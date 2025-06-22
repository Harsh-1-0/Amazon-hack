import Image from "next/image"
import flux0 from "../images/flux/flux0.png"
import flux1 from "../images/flux/flux1.png"
import flux2 from "../images/flux/flux2.png"
import flux3 from "../images/flux/flux3.png"
import flux4 from "../images/flux/flux4.png"

import ott1 from "../images/ott/ott1.png"
import ott2 from "../images/ott/ott2.png"
import ott3 from "../images/ott/ott3.png"
import ott4 from "../images/ott/ott4.png"
import ott5 from "../images/ott/ott5.png"

export default function Otts() {
    const fluxImages = [flux0, flux1, flux2, flux3, flux4];
    
    const checkTimeFromImage = ()=>{
        const currentHour = new Date().getHours();
        if(currentHour >= 0 && currentHour < 4) {
            return fluxImages[4]; // Early morning
        }else if(currentHour >= 4 && currentHour < 12) {
            return fluxImages[0]; // Morning
        }else if(currentHour >= 12 && currentHour < 17) {
            return fluxImages[1]; // Afternoon
        }
        else if(currentHour >= 17 && currentHour < 21) {
            return fluxImages[2]; // Evening
        }else return fluxImages[3]; // Night
    }
    const handleClick = () => {
        window.location.href = "/audio_mood";
    }
    return (

        <div className="flex items-center justify-center gap-5">
            
            <button onClick={handleClick}  className={`p-3 shadow-md cursor-pointer  hover:scale-110 transition-transform duration-200`}>
                <Image src={checkTimeFromImage()} alt="Flux"/>
            </button>
            <button className="text-white w-32 h-16  cursor-pointer  hover:scale-110 transition-transform duration-200"> collaborative</button>
            <button>
                <Image src={ott1} alt="OTT 1" className="w-16 h-16 cursor-pointer rounded-lg shadow-md hover:scale-110 transition-transform duration-200" />
            </button>
            <button>
                <Image src={ott2} alt="OTT 2" className="w-16 h-16 cursor-pointer rounded-lg shadow-md hover:scale-110 transition-transform duration-200" />
            </button>
            <button>
                <Image src={ott3} alt="OTT 3" className="w-16 h-16 cursor-pointer rounded-lg shadow-md hover:scale-110 transition-transform duration-200" />
            </button>
            <button>
                <Image src={ott4} alt="OTT 4" className="w-16 h-16 cursor-pointer rounded-lg shadow-md hover:scale-110 transition-transform duration-200" />           
            </button>
            <button>
                <Image src={ott5} alt="OTT 5" className="w-16 h-16 cursor-pointer rounded-lg shadow-md hover:scale-110 transition-transform duration-200" />
            </button>
            
        </div>
    )
}