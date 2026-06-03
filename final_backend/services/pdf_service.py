from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.units import mm
import io

def generate_offer_letter_pdf(data: dict, company: dict) -> bytes:
    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4
    c.setFont("Helvetica-Bold", 18)
    c.drawString(20*mm, height - 30*mm, company.get("name", ""))
    c.setFont("Helvetica", 12)
    c.drawString(20*mm, height - 50*mm, f"Dear {data.get('candidate_name', '')},")
    c.drawString(20*mm, height - 65*mm, f"Position : {data.get('designation', '')} — {data.get('department', '')}")
    c.drawString(20*mm, height - 80*mm, f"CTC      : Rs. {data.get('ctc', 0):,.0f} per annum")
    c.drawString(20*mm, height - 95*mm, f"Joining  : {data.get('joining_date', '')}")
    c.drawString(20*mm, height - 130*mm, "Regards,")
    c.drawString(20*mm, height - 145*mm, "HR Team")
    c.save()
    buffer.seek(0)
    return buffer.read()

def generate_payslip_pdf(data: dict, company: dict) -> bytes:
    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4
    c.setFont("Helvetica-Bold", 16)
    c.drawString(20*mm, height - 25*mm, company.get("name", ""))
    c.setFont("Helvetica-Bold", 13)
    c.drawString(20*mm, height - 40*mm, "SALARY SLIP")
    c.setFont("Helvetica", 11)
    c.drawString(20*mm, height - 58*mm, f"Employee : {data.get('employee_name', '')}")
    c.drawString(20*mm, height - 70*mm, f"Month    : {data.get('month', '')} {data.get('year', '')}")
    c.drawString(20*mm, height - 88*mm, f"Basic    : Rs. {data.get('basic', 0):,.0f}")
    c.drawString(20*mm, height - 100*mm, f"HRA      : Rs. {data.get('hra', 0):,.0f}")
    c.drawString(20*mm, height - 112*mm, f"Allowances: Rs. {data.get('allowances', 0):,.0f}")
    c.drawString(20*mm, height - 124*mm, f"Deductions: Rs. {data.get('deductions', 0):,.0f}")
    gross = data.get('basic',0) + data.get('hra',0) + data.get('allowances',0)
    net   = gross - data.get('deductions',0)
    c.setFont("Helvetica-Bold", 12)
    c.drawString(20*mm, height - 142*mm, f"Net Salary: Rs. {net:,.0f}")
    c.save()
    buffer.seek(0)
    return buffer.read()
