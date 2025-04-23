
import '../../css/css.css';
import { Link } from '@inertiajs/react';

export default function Guest({ children }) {
    return (
        <div className="background-container">
           <h1 className="game">
           <span className='text-[5.5rem]'>Ģ</span><span>e</span><span>o</span><span className='text-[5.5rem]'>p</span><span>r</span><span>ā</span><span>t</span><span>s</span>
           </h1> 
           
           
            <div className="flex-center">
            

                {children}
            </div>
        </div>
    );
}
