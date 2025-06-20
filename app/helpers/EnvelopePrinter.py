import re
import tempfile
import subprocess
import platform
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas
from PyPDF2 import PdfMerger

class EnvelopePrinter:
    def __init__(self):
        self.width = 4.125 * inch
        self.height = 9.5 * inch

    def create_pdf(self, sender_address, recipient_address, output_path):
        c = canvas.Canvas(output_path, pagesize=(self.width, self.height))
        c.saveState()
        c.translate(self.width / 2, self.height / 2)
        c.rotate(90)

        # === Sender ===
        sender = c.beginText()
        sender.setFont("Helvetica", 8)
        sender.setTextOrigin(-self.height / 2 + 0.5 * inch, self.width / 2 - 0.75 * inch)
        for line in sender_address:
            if line.strip():
                sender.textLine(line)
        c.drawText(sender)

        # === Recipient ===
        recipient = c.beginText()
        recipient.setFont("Helvetica-Bold", 14)

        # Filter out blank lines and calculate width
        lines = [line for line in recipient_address if line.strip()]
        recipient_width = max((c.stringWidth(line, "Helvetica-Bold", 14) for line in lines), default=0)
        recipient.setTextOrigin(-recipient_width / 2, 0.0)

        for line in lines:
            recipient.textLine(line)

        c.drawText(recipient)

        c.restoreState()
        c.showPage()
        c.save()


    def get_printers(self):
        result = subprocess.run(['lpstat', '-p'], capture_output=True, text=True)
        printers = []
        for idx, line in enumerate(result.stdout.splitlines()):
            if line.startswith("printer"):
                parts = line.split()
                if len(parts) >= 2:
                    printers.append({
                        "index": len(printers),  # Not `idx` to only count valid printers
                        "name": parts[1]
                    })
        return printers
    
    def print_pdf(self, file_path, printer_index=0):
        printers = self.get_printers()
        if not printers:
            raise RuntimeError("No printers found.")
        if not (0 <= printer_index < len(printers)):
            raise IndexError(f"Invalid printer index: {printer_index}")
        printer_name = printers[printer_index]['name']
        subprocess.run(['lp', '-d', printer_name, '-o', 'media=Custom.4.125x9.5in', file_path])
        print(f"Printed to {printer_name}")


    def generate(self, sender, recipient, output_path=None):
        """
        Generate a PDF envelope.
        :param sender: dict or list of sender address lines
        :param recipient: dict or list of recipient address lines
        :param output_path: optional output path
        :return: full path to generated PDF
        """
        sender_lines = self.format_address(sender) if isinstance(sender, dict) else sender
        recipient_lines = self.format_address(recipient) if isinstance(recipient, dict) else recipient

        path = output_path or tempfile.NamedTemporaryFile(delete=False, suffix=".pdf").name
        self.create_pdf(sender_lines, recipient_lines, path)
        print(f"PDF generated at: {path}")
        return path

    
    def generate_and_print(self, sender, recipient, printer_index=0):
        """
        Generate a PDF and immediately print it to the given printer.
        Accepts recipient as either a dict (raw contact) or list of lines.
        """

        path = self.generate(sender, recipient)
        self.print_pdf(path, printer_index=printer_index)
        return path
    
    def generate_all(self, contacts, sender):
        """
        Generate envelopes for all contacts and merge into a single PDF.
        :param contacts: list of contact dicts or formatted address lists
        :param sender: sender address as dict or list
        :return: path to merged PDF
        """
        pdf_paths = []

        for contact in contacts:
            print(f"Generating envelope for {contact} from {sender}")
            # Don't format here, just pass it through
            path = self.generate(sender, contact)
            pdf_paths.append(path)

        merged_path = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf").name
        merger = PdfMerger()
        for pdf in pdf_paths:
            merger.append(pdf)
        merger.write(merged_path)
        merger.close()
        print(f"Merged PDF generated at: {merged_path}")
        return merged_path



    

    def format_address(self, address_dict):

        lines = []

        name = clean(address_dict.get("name", ""))
        if name:
            lines.append(name)

        address = clean(address_dict.get("address", ""))
        if address:
            for line in address.splitlines():
                line = line.strip()
                if line:
                    lines.append(line)

        return lines
    
    def preview_all_envelopes(self, contacts, sender):
        """
        Generate PDF envelopes for all contacts and open them in the default PDF viewer.
        """
        merged_path = self.generate_all(contacts, sender)

        # Determine platform-specific command
        if platform.system() == "Darwin":
            subprocess.run(["open", merged_path])
        elif platform.system() == "Windows":
            subprocess.run(["start", merged_path], shell=True)
        else:  # Linux and others
            subprocess.run(["xdg-open", merged_path])
    
    def preview_envelope(self, sender, recipient):
        """
        Generate a PDF envelope from the given contact and open it in the default PDF viewer.
        """
        
        path = self.generate(sender, recipient)

        # Determine platform-specific command
        if platform.system() == "Darwin":  # macOS
            subprocess.run(["open", path])
        elif platform.system() == "Windows":
            subprocess.run(["start", path], shell=True)
        else:  # Linux and others
            subprocess.run(["xdg-open", path])

def clean(text):
    # Remove non-printable characters and whitespace
    return re.sub(r'[^(\x20-\x7E|\n|\r)]', '', text).strip()