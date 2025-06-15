import Dialog from "./Dialog";
import { useEffect, useState } from 'react';

const DeleteContactDialog = ({onClose,isOpen, onDeleteContact,contact})=> {
    const [id,setId] = useState(0);
    const [name, setName] = useState('');


    useEffect(() => {
        if (contact) {
            setId(contact.id || 0);
            setName(contact.name || '');
        } else {
            setId(0);
            setName('');
        }
    }
    , [contact]);

    return (
        <Dialog title={'Delete Contact?'} onClose={onClose} isOpen={isOpen} onSave={() => onDeleteContact(id)} saveText={'Delete'}>
            Are you sure you want to delete {name ? name : 'this contact'}?
        </Dialog>
    );
}

export default DeleteContactDialog;