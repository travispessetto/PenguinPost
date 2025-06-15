import React from 'react';
import { IoPrint } from "react-icons/io5";
import { PiFilePdf } from "react-icons/pi";
import { CiEdit } from "react-icons/ci";
import { FaRegTrashAlt } from "react-icons/fa";
import ContactDialog from './ContactDialog';
import DeleteContactDialog from './DeleteContactDialog';


const Contact = ({id,name,address,number,onDeleteContact,onSaveContact}) =>
{
    const addressLines = address.split(/\r\n|\r|\n/);
    const [isDialogOpen,setIsDialogOpen] = React.useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
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

    const saveContact = (id, name, address, number) => {
        onSaveContact(id, name, address, number);
        setIsDialogOpen(false);
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
        <>
            <div class="contact">
                <div>{name}</div>
                <div>{addressLines.map((line,index)=><div key={index}>{line}</div>)}</div>
                <div>{number}</div>
                <div style={{fontSize: '20pt'}}>
                    <span onClick={()=>setIsDialogOpen(true)}><CiEdit /></span>
                    <span onClick={previewEnvelope} style={{cursor: 'pointer'}}><PiFilePdf /></span>
                    <span onClick={printEnvelope} style={{cursor: 'pointer'}}><IoPrint /></span>
                    <span onClick={() => setIsDeleteDialogOpen(true)} style={{cursor: 'pointer'}}><FaRegTrashAlt /></span>
                </div>
                    
            </div>
            <ContactDialog
                isOpen={isDialogOpen}
                onClose={()=>setIsDialogOpen(false)}
                onSaveContact={saveContact}
                contact={{id: id, name: name, address: address, number: number}}
            />
            <DeleteContactDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onDeleteContact={()=>{onDeleteContact(id); setIsDeleteDialogOpen(false);}}
                contact={{id: id, name: name}}
            />
        </>
    );
}

export default Contact;