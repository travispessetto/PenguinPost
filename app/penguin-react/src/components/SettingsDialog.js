import Dialog from "./Dialog";
import { useEffect, useState } from 'react';

const SettingDialog = ({onClose,isOpen, onSaveSettings,contact})=> {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');

    const saveSettings = ()=>
    {
        onSaveSettings(name, address, phone);
    }

    useEffect(() => {
        if (contact) {
            setName(contact.name || '');
            setAddress(contact.address || '');
            setPhone(contact.number || '');
        }
    }, [contact]);

    return (
        <Dialog title={'What\'s your contact details?'} onClose={onClose} isOpen={isOpen} onSave={saveSettings}>
            Name: <br />
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} /><br />
            Address: <br />
            <textarea placeholder="Address" rows="3" value={address} onChange={(e) => setAddress(e.target.value)}></textarea><br />
            Phone Number: <br />
            <input type="text" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} /><br />
        </Dialog>
    );
}

export default SettingDialog;