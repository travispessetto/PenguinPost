import os
import csv
import webview
import sqlite3
from helpers.EnvelopePrinter import EnvelopePrinter

class Api:
    db_path = os.path.join("data", "addresses.db")
    def greet_user(self, name):
        return f"Hello, {name}!"
    
    def print_envelope(self,contact):
        envelopePrinter = EnvelopePrinter()
        printers = envelopePrinter.list_printers()
        if not printers:
            raise RuntimeError("No printers found.")
        printer_index = 0  # Default to the first printer
        if not (0 <= printer_index < len(printers)):
            raise IndexError(f"Invalid printer index: {printer_index}")
        sender = [
            "Travis Pessetto",
            "123 Penguin Ln",
            "Suite 7",
            "Anchorage, AK 99501"
        ]


        #recipient = [
        #    contact.get("name",""),
        #    contact.get("street1",""),
        #    contact.get("street2",""),
        #    contact.get("city",""),
        #    contact.get("state",""),
        #    contact.get("zip","")
        #]

        envelopePrinter.generate_and_print(sender,contact)

    def add_contact(self, name, address, number):
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO contacts (name, address, number)
                VALUES (?, ?, ?)
            ''', (name, address, number))
            conn.commit()
            return cursor.lastrowid  # return the new contact's ID
        
    def delete_contact(self, contact_id):
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('DELETE FROM contacts WHERE id = ?', (contact_id,))
            conn.commit()
            return cursor.rowcount


    def get_contacts(self):
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT id, name, address, number FROM contacts ORDER BY name')
            rows = cursor.fetchall()
            return [
                {"id": r[0], "name": r[1], "address": r[2], "number": r[3]}
                for r in rows
            ]


    def preview_envelope(self, contact):
        envelopePrinter = EnvelopePrinter()
        sender = [
            "Travis Pessetto",
            "123 Penguin Ln",
            "Suite 7",
            "Anchorage, AK 99501"
        ]
        #recipient = [
        #    contact.get("name",""),
        #    contact.get("street1",""),
        #    contact.get("street2",""),
        #    contact.get("city",""),
        #    contact.get("state",""),
        #    contact.get("zip","")
        #]
        envelopePrinter.preview_envelope(sender, contact)
        

if __name__ == '__main__':
    index_file = os.path.abspath('penguin-react/build/index.html')
    static_dir = os.path.abspath('.')  # base directory where /static/ lives

    api = Api()
    webview.create_window('Penguin Post', f'file://{index_file}', js_api=api,width=1500, height=900)
    webview.start(http_server=True, debug=True)
