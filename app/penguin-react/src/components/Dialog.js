import './Dialog.css'; 
import { FaTimes } from "react-icons/fa";

const Dialog = ({title,children,onClose, isOpen, onSave}) => {
  return (
    <>
        <div className={`overlay ${isOpen ? '' : 'hidden' }`} onClick={onClose}></div>
        <div className={`dialog ${isOpen ? '' : 'hidden' }`}>
        <div className='header'>
            <h2>{title}</h2>
            <button className="close" onClick={onClose}><FaTimes /></button>
        </div>
        <div className='body'>{children}</div>
        <div className='footer'>
            <button onClick={onSave}>Save</button>
        </div>
        </div>
    </>
  );
};

export default Dialog;
