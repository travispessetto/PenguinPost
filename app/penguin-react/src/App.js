import side from './side.png';
import './App.css';
import Contact from './components/Contact.js';
import { useEffect, useState } from 'react';
import { FaPlus } from "react-icons/fa";
import Dialog from './components/Dialog.js';
import ContactDialog from './components/ContactDialog.js';

function App() {

  const [contacts , setContacts] = useState([]);
  const [isAddContactDialogOpen, setIsAddContactDialogOpen] = useState(false);

  const onSaveContact = (name,address,phone) => {
	console.log("Saving contact:", name, address, phone);
	if(window.pywebview){
		window.pywebview.api.add_contact(name,address,phone).then((result) => {
			console.log("Contact added successfully:", result);
			setContacts([...contacts, { id: result, name, address, number: phone }]);
			setIsAddContactDialogOpen(false);
		}).catch((error) => {
			console.error("Error adding contact:", error);
		});
	}
  }

  const onDeleteContact = (id) => {
	console.log("Deleting contact with id:", id);
	if(window.pywebview){
	  window.pywebview.api.delete_contact(id).then((result) => {
		console.log("Contact deleted successfully:", result);
		setContacts(contacts.filter(contact => contact.id !== id));
	  }).catch((error) => {
		console.error("Error deleting contact:", error);
	  });
	}
  }

  useEffect(()=>{
	// Fetch contacts from the API
	if(window.pywebview)
	{
		window.pywebview.api.get_contacts().then((result) => {
		  console.log("Contacts fetched successfully:", result);
		  setContacts(result);
		}).catch((error) => {
		  console.error("Error fetching contacts:", error);
		});
	}
  },[]);

  return (
    <div id="main">
			<ContactDialog
				isOpen={isAddContactDialogOpen}
				onClose={() => setIsAddContactDialogOpen(false)}
				onSaveContact={onSaveContact}
			/>
			<div id="header">
				<div>
					<h1>Penguin Post</h1>
				</div>
				<div id="header-actions" style={{fontSize: '20pt'}}>
					<div onClick={() => setIsAddContactDialogOpen(true)}><FaPlus /></div>
				</div>
			</div>
			<div id="body">
				<div id="side">
					<img src={side}/>
				</div>
				<div id="contacts">
					<div id="contact-header">
						<div>Name</div>
						<div>Address</div>
						<div>Phone #</div>
						<div>[All PDF] [ALL Print]</div>
					</div>
					<div id="contact-body">
						
			 { contacts.map((contact) => (
					<Contact
						key={contact.id}
						id={contact.id}
						name={contact.name}
						address={`${contact.address}`}
						number={contact.number}
						onDeleteContact={onDeleteContact}
					/>
			))}
					</div>{/*End contact body*/}
					
					
				</div>
			</div>
		</div>
  );
}

export default App;
