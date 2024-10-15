
import '../../css/css.css';
import { Link } from '@inertiajs/react';

export default function Guest({ children }) {
    return (
        <div className="background-container">
           <h1 className="game">Prāta dueļi</h1> 
           
            <div className="flex-center">
            

                {children}
            </div>
        </div>
    );
}
