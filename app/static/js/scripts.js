// Call the exposed Python function
function callPythonFunction() {
    const name = prompt("Enter your name:");
    if (name) {
        pywebview.api.greet_user(name).then(response => {
            alert(response); // Display the response from Python
        });
    }
}

// Attach the function to a button click
document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('greetButton');
    if (button) {
        button.addEventListener('click', callPythonFunction);
    }
});


// Function to handle closing the prompt
document.addEventListener('DOMContentLoaded', () => {
    const prompt = document.getElementById('prompt');
    const closeBtn = document.getElementById('closePrompt');
    const cancelBtn = document.getElementById('cancelPrompt');
    const addBtn = document.getElementById('addButton');

    function closePrompt() {
      prompt.style.display = 'none';
    }

    function showPrompt() {
      prompt.style.display = 'block';
    }

    closeBtn.addEventListener('click', closePrompt);
    cancelBtn.addEventListener('click', closePrompt);
    addBtn.addEventListener('click', showPrompt);
  });

  function getAddressFormData() {
    const form = document.getElementById("newContact");
    return {
      name: form.querySelector("#name").value,
      street1: form.querySelector("#street1").value,
      street2: form.querySelector("#street2").value,
      city: form.querySelector("#city").value,
      state: form.querySelector("#state").value,
      zip: form.querySelector("#zip").value
    };
  }

  async function submitAddressForm() {
    const data = getAddressFormData();
    const response = await pywebview.api.submit_contact(data);
  }
  
  // function loading the contacts on initialization
  function waitForPywebviewApi(callback) {
    const checkInterval = setInterval(() => {
      if (window.pywebview && pywebview.api) {
        clearInterval(checkInterval);
        callback();
      }
    }, 50);
  }
  
  waitForPywebviewApi(async () => {
  
    try {
      const contacts = await pywebview.api.get_contacts();
  
      const container = document.getElementById("contactList");
      if (!container) {
        alert("Missing #contactList in HTML.");
        return;
      }
  
      for (const contact of contacts) {
        const row = document.createElement("div");
        row.className = "row";
  
        row.innerHTML = `
          <div>${contact.name}</div>
          <div>${contact.street1}</div>
          <div>${contact.street2}</div>
          <div>${contact.city}</div>
          <div>${contact.state}</div>
          <div>${contact.zip}</div>
          <div>
            <button onClick="previewEnvelope(this)">Preview</button>
            <button onclick="printContact(this)">Print</button>
          </div>
        `;
  
        container.appendChild(row);
      }
    } catch (error) {
      alert("Error loading contacts:\n" + error);
      console.error(error);
    }
  });
  
  // contact printing function
  function printContact(button) {
    
    const contact = captureContact(button);
    pywebview.api.print_envelope(contact);
  }

  function previewEnvelope(button) {
    const contact = captureContact(button);
    pywebview.api.preview_envelope(contact);
  }

  // function to capture the envelope contact
  function captureContact(button)
  {
    const row = button.closest(".row");
    const cells = row.querySelectorAll("div");

    const contact = {
      name: cells[0].innerText,
      street1: cells[1].innerText,
      street2: cells[2].innerText,
      city: cells[3].innerText,
      state: cells[4].innerText,
      zip: cells[5].innerText
    };
    return contact;
  }