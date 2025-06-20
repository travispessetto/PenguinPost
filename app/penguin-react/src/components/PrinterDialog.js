import Dialog from './Dialog';
import { FaCheck } from "react-icons/fa";
import { useState } from 'react';

const PrinterDialog = ({ isOpen, onClose, onPrint,printers }) => {
  const [selectedPrinter, setSelectedPrinter] = useState(-1);
  return (
    <>
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            title="Select Printer"
            className="printer-dialog"
            onSave={()=>{onPrint(selectedPrinter);}}
            saveText={'Print'}
        >
                {
                  printers && printers.length > 0 && 
                  printers.map((printer, index) => (
                    <div key={index} className="printer-option" onClick={() => setSelectedPrinter(index)}>
                      <div>
                        {selectedPrinter == index && <FaCheck />}
                      </div>
                      <div>
                        <label htmlFor={`printer-${index}`}>{printer.name}</label>
                      </div>
                    </div>
                  ))
                }
        </Dialog>
    </>
  );
}

export default PrinterDialog;