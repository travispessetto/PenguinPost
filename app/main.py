import os
import webview
import sqlite3
from helpers.EnvelopePrinter import EnvelopePrinter

class Api:
    db_path = os.path.join("data", "addresses.db")
    def greet_user(self, name):
        return f"Hello, {name}!"
    
    def print_envelope(self,contact,printer_index=-1):
        envelopePrinter = EnvelopePrinter()
        printers = envelopePrinter.get_printers()
        if not printers:
            raise RuntimeError("No printers found.")
        if not (0 <= printer_index < len(printers)):
            raise IndexError(f"Invalid printer index: {printer_index}")
        sender = self.get_sender()


        envelopePrinter.generate_and_print(sender,contact,printer_index)

    def print_all_envelopes(self, contacts, printer_index=-1):
        envelopePrinter = EnvelopePrinter()
        printers = envelopePrinter.get_printers()
        if not printers:
            raise RuntimeError("No printers found.")
        if not (0 <= printer_index < len(printers)):
            raise IndexError(f"Invalid printer index: {printer_index}")
        
        sender = self.get_sender()
        envelopePrinter.generate_and_print_all(contacts, sender, printer_index=printer_index)

    def add_contact(self, name, address, number):
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO contacts (name, address, number)
                VALUES (?, ?, ?)
            ''', (name, address, number))
            conn.commit()
            return cursor.lastrowid  # return the new contact's ID
        
    def update_contact(self, id, name, address, number):
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                UPDATE contacts
                SET name = ?, address = ?, number = ?
                WHERE id = ?
            ''', (name, address, number, id))
            conn.commit()
            return cursor.rowcount

        
    def delete_contact(self, contact_id):
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('DELETE FROM contacts WHERE id = ?', (contact_id,))
            conn.commit()
            return cursor.rowcount


    def get_contacts(self):
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT id, name, address, number FROM contacts WHERE self = 0 ORDER BY name')
            rows = cursor.fetchall()
            return [
                {"id": r[0], "name": r[1], "address": r[2], "number": r[3]}
                for r in rows
            ]

    def get_my_contact(self):
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT id, name, address, number FROM contacts WHERE self = 1')
            row = cursor.fetchone()
            if row:
                return {"id": row[0], "name": row[1], "address": row[2], "number": row[3]}
            return None
        
    def save_my_contact(self, name, address, number):
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('UPDATE contacts SET name = ?, address = ?, number = ? WHERE self = 1', (name, address, number))
            if cursor.rowcount == 0:
                # If no rows were updated, insert a new self contact
                cursor.execute('INSERT INTO contacts (name, address, number, self) VALUES (?, ?, ?, 1)', (name, address, number))
                return cursor.lastrowid  # return the new contact's ID
            conn.commit()
            return cursor.rowcount  # return number of rows updated


    def preview_envelope(self, contact):
        envelopePrinter = EnvelopePrinter()
        sender = self.get_sender()
        envelopePrinter.preview_envelope(sender, contact)

    def preview_all_envelopes(self,contacts):
        envelopePrinter = EnvelopePrinter()

        print('contacts', contacts)

        sender = self.get_sender()
        envelopePrinter.preview_all_envelopes(contacts,sender)

    def get_sender(self):
        sender = self.get_my_contact()
        return {
            "name": sender.get("name", ""),
            "address": sender.get("address", ""),
        }


    def initialize_database(self):
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True) if os.path.dirname(self.db_path) else None

        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS contacts (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    address TEXT NOT NULL,
                    number TEXT,
                    self INTEGER NOT NULL DEFAULT 0
                )
            ''')
            conn.commit()

    def get_printers(self):
        envelopePrinter = EnvelopePrinter()
        return envelopePrinter.get_printers()
        

if __name__ == '__main__':
    index_file = os.path.abspath('penguin-react/build/index.html')
    static_dir = os.path.abspath('.')  # base directory where /static/ lives
    

    api = Api()
    api.initialize_database()  # Ensure the database is initialized
    webview.create_window('Penguin Post', f'file://{index_file}', js_api=api,width=1500, height=900)
    # webview.create_window('Penguin Post', f'http://localhost:3000', js_api=api,width=1500, height=900)
    webview.start(http_server=True, debug=False)
