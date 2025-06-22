import { IoHomeSharp } from "react-icons/io5";
import { MdCable } from "react-icons/md";
import { FaRegBookmark } from "react-icons/fa";
import { FaRegShareSquare } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import Image from "next/image";

export default function Buttons({url}) {
    return(
        <div className='flex justify-center items-center gap-5 '>
            <div>
                <Image
                    src={url}
                    alt="Button Icon"
                    width={72}
                    height={72}
                    className="p-3 bg-white/80 rounded-full shadow-md hover:bg-blue-500 hover:text-white transition-colors duration-200 object-cover"
                />
            </div>
            <div>
                <button className="p-3 bg-white/80 rounded-full shadow-md hover:bg-blue-500 hover:text-white transition-colors duration-200">
                    <IoHomeSharp size={24} />
                </button>
            </div>
            <div>
                <button className="p-3 bg-white/80 rounded-full shadow-md hover:bg-green-500 hover:text-white transition-colors duration-200">
                    <MdCable size={24} />
                </button>
            </div>
            <div>
                <button className="p-3 bg-white/80 rounded-full shadow-md hover:bg-yellow-500 hover:text-white transition-colors duration-200">
                    <FaRegBookmark size={24} />
                </button>
            </div>
            <div>
                <button className="p-3 bg-white/80 rounded-full shadow-md hover:bg-purple-500 hover:text-white transition-colors duration-200">
                    <FaRegShareSquare size={24} />
                </button>
            </div>
            <div>
                <button className="p-3 bg-white/80 rounded-full shadow-md hover:bg-pink-500 hover:text-white transition-colors duration-200">
                    <IoSearch size={24} />
                </button>
            </div>
        </div>
    );
}