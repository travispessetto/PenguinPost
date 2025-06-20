import Dialog from "./Dialog";
import { useEffect, useState } from 'react';

const ContactDialog = ({onClose,isOpen, onSaveContact,contact})=> {
    const [id,setId] = useState(0);
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');

    const saveContact = ()=>
    {
        onSaveContact(id, name, address, phone);
        setName('');
        setAddress('');
        setPhone('');
    }

    useEffect(() => {
        if (contact) {
            setId(contact.id || 0);
            setName(contact.name || '');
            setAddress(contact.address || '');
            setPhone(contact.number || '');
        } else {
            setId(0);
            setName('');
            setAddress('');
            setPhone('');
        }
    }
    , [contact]);

    return (
        <Dialog title={'Add Contact?'} onClose={onClose} isOpen={isOpen} onSave={saveContact}>
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