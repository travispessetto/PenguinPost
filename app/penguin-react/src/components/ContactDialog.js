import Dialog from "./Dialog";
import React, { useState } from 'react';

const ContactDialog = ({onClose,isOpen, onSaveContact})=> {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');

    return (
        <Dialog title={'Add Contact?'} onClose={onClose} isOpen={isOpen} onSave={() => onSaveContact(name, address, phone)}>
            Name: <br />
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} /><br />
            Address: <br />
            <textarea placeholder="Address" rows="3" value={address} onChange={(e) => setAddress(e.target.value)}></textarea><br />
            Phone Number: <br />
            <input type="text" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} /><br />
        </Dialog>
    );
}

export default ContactDialog;