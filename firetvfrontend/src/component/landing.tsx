import Grid from './grid';
import Buttons from './buttons';
import Otts from './otts';
export default function Landing() {
    return (
        <div  className="h-screen w-screen bg-cover background-image flex flex-col justify-between items-center">
            <div className="h-1/3 w-full "></div>
            <div className="h-2/3 w-full backdrop-blur-lg items-center justify-center px-5">
                <div className='p-3 flex justify-between items-center w-full'>
                    <Buttons/>
                    <Otts/>
                </div>
                <Grid/>
            </div>
        </div>
    );
}
