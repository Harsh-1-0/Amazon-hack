import image0 from '../images/shows/img0.png';
import image1 from '../images/shows/img1.png';
import image2 from '../images/shows/img2.png';
import image3 from '../images/shows/img3.png';
import image4 from '../images/shows/img4.png';
import image5 from '../images/shows/img5.png';
import image6 from '../images/shows/img6.png';
import image7 from '../images/shows/img7.png';
import image8 from '../images/shows/img8.png';
import image9 from '../images/shows/img9.png';
import Image from 'next/image';
export default function Grid() {
    const images = [
        image0, image1, image2, image3, image4,
        image5, image6, image7, image8, image9
    ];
    return(
        <div className="grid grid-cols-5 grid-rows-2 gap-5 ">
                    {images.map((img, index) => (
                        <div key={index} className="flex justify-center hover:scale-110 transition duration-500 items-center">
                            <Image 
                                src={img} 
                                alt={`Image ${index}`} 
                                width={260} 
                                height={135} 
                                className="rounded-lg shadow-lg object-cover"
                            />
                        </div>
                    ))}
        </div>
    )
}