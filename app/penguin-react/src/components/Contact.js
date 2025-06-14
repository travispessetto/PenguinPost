import React from 'react';
import { IoPrint } from "react-icons/io5";
import { PiFilePdf } from "react-icons/pi";
import { CiEdit } from "react-icons/ci";
import { FaRegTrashAlt } from "react-icons/fa";


const Contact = ({id,name,address,number,onDeleteContact}) =>
{
    const previewEnvelope = () => {
        // Logic to preview PDF
        console.log("Preview PDF");
        window.pywebview.api.preview_envelope({
            name: name,
            address: address,
        }).then((result) => {
            console.log("PDF previewed successfully:", result);
        }
        ).catch((error) => {
            console.error("Error previewing PDF:", error);
        });
    }

    const printEnvelope = () => {
        window.pywebview.api.print_envelope({
            name: name,
            address: address,
        }).then((result) => {
            console.log("PDF previewed successfully:", result);
        }
        ).catch((error) => {
            console.error("Error previewing PDF:", error);
        });
    }

    return(
        <div class="contact">
            <div>{name}</div>
            <div>{address}</div>
            <div>{number}</div>
            <div style={{fontSize: '20pt'}}>
                <CiEdit /> 
                <span onClick={previewEnvelope} style={{cursor: 'pointer'}}><PiFilePdf /></span>
                <span onClick={printEnvelope} style={{cursor: 'pointer'}}><IoPrint /></span>
                <span onClick={() => onDeleteContact(id)} style={{cursor: 'pointer'}}><FaRegTrashAlt /></span>
            </div>
                
		</div>
    );
}

export default Contact;