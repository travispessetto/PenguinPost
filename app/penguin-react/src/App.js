import side from './side.png';
import './App.css';
import Contact from './components/Contact.js';
import { useEffect, useState } from 'react';
import { FaPlus } from "react-icons/fa";
import ContactDialog from './components/ContactDialog.js';
import { GoGear } from "react-icons/go";
import { IoPrint } from "react-icons/io5";
import { PiFilePdf } from "react-icons/pi";
import SettingDialog from './components/SettingsDialog.js';

function App() {

 
  const [contacts , setContacts] = useState([]);
  const [myContact, setMyContact] = useState({
	name: '',
	address: '',
	phone: ''
  });
  const [isAddContactDialogOpen, setIsAddContactDialogOpen] = useState(false);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
  const [printers,setPrinters] = useState([]);

  const onSaveContact = (id,name,address,phone) => {
	console.log("Saving contact:", name, address, phone);
	if(window.pywebview){
		if(id > 0)
		{
			window.pywebview.api.update_contact(id,name,address,phone).then((result) => {
				console.log("Contact updated successfully:", result);
				setContacts(contacts.map(contact => contact.id === id ? { ...contact, name, address, number: phone } : contact));
				setIsAddContactDialogOpen(false);
			}).catch((error) => {
				console.error("Error updating contact:", error);
			});
		}
		else
		{
			window.pywebview.api.add_contact(name,address,phone).then((result) => {
				console.log("Contact added successfully:", result);
				setContacts([...contacts, { id: result, name, address, number: phone }]);
				setIsAddContactDialogOpen(false);
			}).catch((error) => {
				console.error("Error adding contact:", error);
			});
		}
	}
  }

  const onSaveSettings = (name, address, phone) => {
	console.log("Saving my contact:", name, address, phone);
	if(window.pywebview){
		window.pywebview.api.save_my_contact(name, address, phone).then((result) => {
		console.log("My contact saved successfully:", result);
		setIsSettingsDialogOpen(false);
	}).catch((error) => {
		console.error("Error saving my contact:", error);
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

  const hasMyContactBeenSet = () => {
		console.log("Checking if my contact has been set:", myContact);
	  	let missingInfoCount = 0;
		if (!myContact.name) {
			missingInfoCount++;
		}
		if (!myContact.address) {
			missingInfoCount++;
		}
		if (!myContact.number) {
			missingInfoCount++;
		}
		// Means probably was never saved
		console.log("Missing info count:", missingInfoCount);
		if(missingInfoCount == 3)
		{
			setIsSettingsDialogOpen(true);
		}
		else
		{
			setIsSettingsDialogOpen(false);
		}
  }

  const previewAllEnvelopes = () => {
    if (window.pywebview) {
      window.pywebview.api.preview_all_envelopes(contacts).then((result) => {
        console.log("All envelopes previewed successfully:", result);
      }).catch((error) => {
        console.error("Error previewing all envelopes:", error);
      });
    }
  };

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

		// get the sender 's contact details
		window.pywebview.api.get_my_contact().then((result) => {
			console.log("My contact fetched successfully:", result);
			setMyContact(result);
		}).catch((error) => {
			console.error("Error fetching my contact:", error);
		});

		// get the printers
		window.pywebview.api.get_printers().then((result) => {
			console.log("Printers fetched successfully:", result);
			setPrinters(result);
		}).catch((error) => {
			console.error("Error fetching printers:", error);
		});
	}
  },[]);

  useEffect(() => {hasMyContactBeenSet(myContact);}, [myContact]);


  return (
    <div id="main">
			<ContactDialog
				isOpen={isAddContactDialogOpen}
				onClose={() => setIsAddContactDialogOpen(false)}
				onSaveContact={onSaveContact}
			/>
			<SettingDialog 
				isOpen={isSettingsDialogOpen}
				onClose={() => setIsSettingsDialogOpen(false)}
				onSaveSettings={onSaveSettings}
				contact={myContact}
			/>
			<div id="header">
				<div>
					<h1>Penguin Post</h1>
				</div>
				<div id="header-actions" style={{fontSize: '20pt'}}>
					<div onClick={previewAllEnvelopes}><PiFilePdf /></div>
					<div><IoPrint /></div>
					<div onClick={() => setIsSettingsDialogOpen(true)}><GoGear /></div>
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
						<div></div>
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
						onSaveContact={onSaveContact}
						printers={printers}
					/>
			))}
			<div id='contact-filler'>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
					</div>{/*End contact body*/}
					
					
				</div>
			</div>
		</div>
  );
}

export default App;
