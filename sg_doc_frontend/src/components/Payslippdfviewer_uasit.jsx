// import bgImage from '../assets/UAS_backGround.jpeg'

// // ─── Number to Words ────────────────────────────────────────────────────────
// const ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"]
// const tens = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"]
// function hw(n) { if(n<20) return ones[n]; if(n<100) return tens[Math.floor(n/10)]+(n%10?" "+ones[n%10]:""); return ones[Math.floor(n/100)]+" Hundred"+(n%100?" "+hw(n%100):"") }
// function toWords(n) { n=Math.round(n); if(!n) return "Zero Rupees"; const cr=Math.floor(n/10000000),lk=Math.floor((n%10000000)/100000),th=Math.floor((n%100000)/1000),rest=n%1000; let r=""; if(cr) r+=hw(cr)+" Crore "; if(lk) r+=hw(lk)+" Lakh "; if(th) r+=hw(th)+" Thousand "; if(rest) r+=hw(rest); return r.trim()+" Rupees" }
// function fmt(n) { return Math.round(n||0).toLocaleString('en-IN') }

// const CO = {
//   fullName: 'UAS IT Consultancy Services Pvt. Ltd.',
//   address:  'Office No. 203, Khandagale Complex, Behind EON Hospital, Kharadi Bypass, Pune MH - 411014',
//   gstin:    '27ABJCS4985R1Z4',
//   tan:      'PNES82511C',
//   email:    'hr@uasit.in',
//   website:  'www.uasit.in',
//   color:    '#1a3c6e',
// }

// export function openPaySlipPDF_UASIT(ps) {

//   const payPeriod = (ps.attend_from && ps.attend_to)
//     ? `${ps.attend_from} - ${ps.attend_to}`
//     : `${ps.month || ''} ${ps.year || ''}`

//   const earnings = [
//     { label: 'Basic Salary',              val: ps.basic           || 0 },
//     { label: 'Dearness Allowance (DA)',    val: ps.da              || 0 },
//     { label: 'House Rent Allowance (HRA)', val: ps.hra             || 0 },
//     { label: 'Conveyance Allowance',       val: ps.conveyance      || 0 },
//     { label: 'Medical Allowance',          val: ps.medical         || 0 },
//     { label: 'Special Allowance',          val: ps.special         || 0 },
//   ]
//   const deductions = [
//     { label: 'Provident Fund (PF)',        val: ps.pf_employee     || 0 },
//     { label: 'ESI / Health Insurance',     val: ps.esi_employee    || 0 },
//     { label: 'Professional Tax',           val: ps.prof_tax        || 0 },
//     { label: 'Loan Recovery',              val: ps.loan_recovery   || 0 },
//     { label: 'Other Deduction',            val: ps.other_deduction || 0 },
//     { label: 'TDS',                        val: ps.tds             || 0 },
//   ]
//   const totalEarnings   = earnings.reduce((s, r) => s + r.val, 0)
//   const totalDeductions = deductions.reduce((s, r) => s + r.val, 0)
//   const netPay          = totalEarnings - totalDeductions

//   const maxRows   = Math.max(earnings.length, deductions.length)
//   const tableRows = Array.from({ length: maxRows }, (_, i) => {
//     const e = earnings[i]
//     const d = deductions[i]
//     return `<tr>
//       <td class="tl">${e ? e.label : ''}</td>
//       <td class="tr">${e && e.val ? fmt(e.val) : (e ? '—' : '')}</td>
//       <td class="tl ded">${d ? d.label : ''}</td>
//       <td class="tr ded">${d && d.val ? fmt(d.val) : (d ? '—' : '')}</td>
//     </tr>`
//   }).join('')

//   // ── bgImage is already a resolved URL (Vite: hashed path or base64)
//   // window.open with document.write keeps same origin → image loads directly
//   const win = window.open('', '_blank')
//   if (!win) return

//   win.document.write(`<!DOCTYPE html>
// <html>
// <head>
// <meta charset="utf-8"/>
// <title>PaySlip — ${ps.emp_name || ''} — ${ps.month} ${ps.year}</title>
// <style>
//   @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
//   * { margin:0; padding:0; box-sizing:border-box; }

//   body {
//     font-family: 'Inter', Arial, sans-serif;
//     background: #f0f4f8;
//     display: flex;
//     justify-content: center;
//     padding: 30px 0 60px;
//   }

//   /* ── A4 exact size ── */
//   .page {
//     width: 210mm;
//     min-height: 297mm;
//     background: #fff;
//     position: relative;
//     box-shadow: 0 4px 32px rgba(0,0,0,0.18);
//     overflow: hidden;
//   }

//   /* ── Full-page background letterhead ── */
//   .bg-img {
//     position: absolute;
//     top: 0; left: 0;
//     width: 100%; height: 100%;
//     object-fit: cover;
//     object-position: top;
//     z-index: 0;
//   }

//   /* ── All content above background ── */
//   .content {
//     position: relative;
//     z-index: 1;
//     padding: 58mm 12mm 12mm 12mm;
//   }

//   .title-wrap { text-align: center; margin-bottom: 5px; }
//   .title-wrap h1 {
//     font-size: 20px; font-weight: 800;
//     color: ${CO.color}; letter-spacing: 0.06em; text-transform: uppercase;
//   }
//   .title-wrap .pay-period { font-size: 10.5px; color: #555; margin-top: 3px; }

//   .divider {
//     height: 2px;
//     background: linear-gradient(to right, ${CO.color}, #4a90d9, ${CO.color});
//     margin: 8px 0 12px; border-radius: 2px;
//   }

//   .emp-grid {
//     display: grid; grid-template-columns: 1fr 1fr;
//     gap: 3px 20px; margin-bottom: 10px; font-size: 10.5px;
//   }
//   .emp-grid .row { display: flex; gap: 5px; }
//   .emp-grid .row .key { color: #555; min-width: 95px; }
//   .emp-grid .row .val { color: #111; font-weight: 600; }

//   .attend-strip {
//     display: grid; grid-template-columns: repeat(4, 1fr);
//     gap: 5px; margin-bottom: 10px;
//   }
//   .attend-strip .abox {
//     background: #f0f5fc; border: 1px solid #c8d8ee;
//     border-radius: 4px; padding: 6px 8px; text-align: center;
//   }
//   .attend-strip .abox .ak { color: #777; font-size: 8.5px; text-transform: uppercase; letter-spacing: 0.03em; }
//   .attend-strip .abox .av { font-weight: 700; color: ${CO.color}; font-size: 12px; margin-top: 2px; }

//   .table-wrap { border: 1px solid #d0dce8; border-radius: 5px; overflow: hidden; margin-bottom: 0; }
//   table { width: 100%; border-collapse: collapse; font-size: 10.5px; }
//   thead tr { background: ${CO.color}; color: #fff; }
//   thead th {
//     padding: 7px 9px; text-align: left;
//     font-weight: 700; font-size: 10px; letter-spacing: 0.04em; text-transform: uppercase;
//   }
//   thead th.right { text-align: right; }
//   tbody tr { border-bottom: 1px solid #e8edf2; }
//   tbody tr:nth-child(even) { background: #f5f8fc; }
//   tbody tr:last-child { border-bottom: none; }
//   td { padding: 6px 9px; color: #333; vertical-align: middle; }
//   td.tr { text-align: right; font-weight: 500; color: #1a1a1a; }
//   td.ded { border-left: 1px solid #d0dce8; }

//   .totals-row {
//     display: grid; grid-template-columns: 1fr 1fr;
//     background: #e8f0fb; border-top: 2px solid ${CO.color};
//   }
//   .totals-row .half {
//     padding: 8px 9px; display: flex;
//     justify-content: space-between; align-items: center;
//     font-size: 11px; font-weight: 700; color: ${CO.color};
//   }
//   .totals-row .half + .half { border-left: 1px solid #c0d0e8; }

//   .net-wrap { margin-top: 10px; border: 1.5px solid ${CO.color}; border-radius: 5px; overflow: hidden; }
//   .net-header { display: grid; grid-template-columns: 1fr 1fr; }
//   .net-header .nh {
//     background: ${CO.color}; color: #fff; padding: 7px 10px;
//     font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em;
//   }
//   .net-header .nh + .nh { border-left: 1px solid rgba(255,255,255,0.25); }
//   .net-body { display: grid; grid-template-columns: 1fr 1fr; }
//   .net-body .nb { padding: 9px 10px; font-size: 12px; font-weight: 700; color: ${CO.color}; }
//   .net-body .nb + .nb { border-left: 1px solid #d0dce8; }

//   .words-wrap {
//     margin-top: 8px; background: #f0f5fc; border: 1px solid #c8d8ee;
//     border-radius: 4px; padding: 7px 12px; font-size: 10px; color: #333;
//   }
//   .words-wrap span { font-weight: 700; color: ${CO.color}; }

//   .info-strip {
//     display: grid; grid-template-columns: repeat(3, 1fr);
//     gap: 5px 14px; margin-top: 10px; padding: 8px 12px;
//     background: #f7f9fc; border: 1px solid #dce6f0;
//     border-radius: 4px; font-size: 9.5px;
//   }
//   .info-strip .irow { display: flex; gap: 4px; }
//   .info-strip .irow .ik { color: #777; min-width: 75px; }
//   .info-strip .irow .iv { font-weight: 600; color: #222; }

//   .note-line {
//     position: absolute;
//     bottom: 25mm;
//     left: 12mm;
//     right: 12mm;
//     text-align: center;
//     font-size: 9.5px;
//     color: #555;
//     font-style: italic;
//   }

//   @media print {
//     body { background: none; padding: 0; }
//     .page { box-shadow: none; width: 210mm; min-height: 297mm; }
//   }
// </style>
// </head>
// <body>
// <div class="page">

//   <img class="bg-img" src="${bgImage}" alt="" />

//   <div class="content">

//     <div class="title-wrap">
//       <h1>Pay Slip</h1>
//       <div class="pay-period">Pay Period: ${payPeriod}</div>
//     </div>
//     <div class="divider"></div>

//     <div class="emp-grid">
//       <div class="row"><span class="key">Employee Name</span><span class="val">: ${ps.emp_name || '—'}</span></div>
//       <div class="row"><span class="key">Employee ID</span><span class="val">: ${ps.emp_id || '—'}</span></div>
//       <div class="row"><span class="key">Designation</span><span class="val">: ${ps.designation || '—'}</span></div>
//       <div class="row"><span class="key">Department</span><span class="val">: ${ps.department || '—'}</span></div>
//       <div class="row"><span class="key">Bank Name</span><span class="val">: ${ps.bank_name || '—'}</span></div>
//       <div class="row"><span class="key">Account No</span><span class="val">: ${ps.account_no || '—'}</span></div>
//     </div>

//     <div class="attend-strip">
//       <div class="abox"><div class="ak">Working Days</div><div class="av">${ps.working_days || '—'}</div></div>
//       <div class="abox"><div class="ak">Paid Days</div><div class="av">${ps.paid_days || ps.working_days || '—'}</div></div>
//       <div class="abox"><div class="ak">LOP Days</div><div class="av">${ps.lop || '0'}</div></div>
//       <div class="abox"><div class="ak">Leave Balance</div><div class="av">${ps.pl || '—'}</div></div>
//     </div>

//     <div class="table-wrap">
//       <table>
//         <thead>
//           <tr>
//             <th>Earnings</th><th class="right">Amount (₹)</th>
//             <th>Deductions</th><th class="right">Amount (₹)</th>
//           </tr>
//         </thead>
//         <tbody>${tableRows}</tbody>
//       </table>
//       <div class="totals-row">
//         <div class="half"><span>Gross Salary</span><span>₹ ${fmt(totalEarnings)}</span></div>
//         <div class="half"><span>Total Deductions</span><span>₹ ${fmt(totalDeductions)}</span></div>
//       </div>
//     </div>

//     <div class="net-wrap">
//       <div class="net-header">
//         <div class="nh">Net Pay</div><div class="nh">Amount (₹)</div>
//       </div>
//       <div class="net-body">
//         <div class="nb">Net Salary Payable</div><div class="nb">₹ ${fmt(netPay)}</div>
//       </div>
//     </div>

//     <div class="words-wrap">
//       Net Salary in Words: <span>${toWords(netPay)} Only</span>
//     </div>

//     <div class="info-strip">
//       <div class="irow"><span class="ik">UAN Number</span><span class="iv">: ${ps.uan_number || '—'}</span></div>
//       <div class="irow"><span class="ik">PF Number</span><span class="iv">: ${ps.pf_number || '—'}</span></div>
//       <div class="irow"><span class="ik">PAN Number</span><span class="iv">: ${ps.pan_number || '—'}</span></div>
//       <div class="irow"><span class="ik">Aadhar No</span><span class="iv">: ${ps.adhar_number || '—'}</span></div>
//       <div class="irow"><span class="ik">Month / Year</span><span class="iv">: ${ps.month} ${ps.year}</span></div>
//       <div class="irow"><span class="ik">Annual Gross</span><span class="iv">: ₹ ${fmt((ps.monthly_gross || 0) * 12)}</span></div>
//     </div>

//     <div class="note-line">
//       Note: This is a computer-generated slip, signature is not required.
//     </div>

//   </div>
// </div>
// </body>
// </html>`)

//   win.document.close()
// }

import bgImage from '../assets/UAS_backGround.jpeg'

// ─── Number to Words ────────────────────────────────────────────────────────
const ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"]
const tens = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"]
function hw(n) { if(n<20) return ones[n]; if(n<100) return tens[Math.floor(n/10)]+(n%10?" "+ones[n%10]:""); return ones[Math.floor(n/100)]+" Hundred"+(n%100?" "+hw(n%100):"") }
function toWords(n) { n=Math.round(n); if(!n) return "Zero Rupees"; const cr=Math.floor(n/10000000),lk=Math.floor((n%10000000)/100000),th=Math.floor((n%100000)/1000),rest=n%1000; let r=""; if(cr) r+=hw(cr)+" Crore "; if(lk) r+=hw(lk)+" Lakh "; if(th) r+=hw(th)+" Thousand "; if(rest) r+=hw(rest); return r.trim()+" Rupees" }
function fmt(n) { return Math.round(n||0).toLocaleString('en-IN') }

const CO = {
  fullName: 'UAS IT Consultancy Services Pvt. Ltd.',
  address:  'Office No. 203, Khandagale Complex, Behind EON Hospital, Kharadi Bypass, Pune MH - 411014',
  gstin:    '27ABJCS4985R1Z4',
  tan:      'PNES82511C',
  email:    'hr@uasit.in',
  website:  'www.uasit.in',
  color:    '#1a3c6e',
}

export function openPaySlipPDF_UASIT(ps) {

  const payPeriod = (ps.attend_from && ps.attend_to)
    ? `${ps.attend_from} - ${ps.attend_to}`
    : `${ps.month || ''} ${ps.year || ''}`

  const earnings = [
    { label: 'Basic Salary',              val: ps.basic           || 0 },
    { label: 'Dearness Allowance (DA)',    val: ps.da              || 0 },
    { label: 'House Rent Allowance (HRA)', val: ps.hra             || 0 },
    { label: 'Conveyance Allowance',       val: ps.conveyance      || 0 },
    { label: 'Medical Allowance',          val: ps.medical         || 0 },
    { label: 'Special Allowance',          val: ps.special         || 0 },
  ]
  const deductions = [
    { label: 'Provident Fund (PF)',        val: ps.pf_employee     || 0 },
    { label: 'ESI / Health Insurance',     val: ps.esi_employee    || 0 },
    { label: 'Professional Tax',           val: ps.prof_tax        || 0 },
    { label: 'Loan Recovery',              val: ps.loan_recovery   || 0 },
    { label: 'Other Deduction',            val: ps.other_deduction || 0 },
    { label: 'TDS',                        val: ps.tds             || 0 },
  ]
  const totalEarnings   = earnings.reduce((s, r) => s + r.val, 0)
  const totalDeductions = deductions.reduce((s, r) => s + r.val, 0)
  const netPay          = totalEarnings - totalDeductions

  const maxRows   = Math.max(earnings.length, deductions.length)
  const tableRows = Array.from({ length: maxRows }, (_, i) => {
    const e = earnings[i]
    const d = deductions[i]
    return `<tr>
      <td class="tl">${e ? e.label : ''}</td>
      <td class="tr">${e && e.val ? fmt(e.val) : (e ? '—' : '')}</td>
      <td class="tl ded">${d ? d.label : ''}</td>
      <td class="tr ded">${d && d.val ? fmt(d.val) : (d ? '—' : '')}</td>
    </tr>`
  }).join('')

  // ── bgImage is already a resolved URL (Vite: hashed path or base64)
  // window.open with document.write keeps same origin → image loads directly
  const win = window.open('', '_blank')
  if (!win) return

  win.document.write(`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<title>PaySlip — ${ps.emp_name || ''} — ${ps.month} ${ps.year}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }

  body {
    font-family: 'Inter', Arial, sans-serif;
    background: #f0f4f8;
    display: flex;
    justify-content: center;
    padding: 30px 0 60px;
  }

  /* ── A4 exact size — fixed, no overflow ── */
  .page {
    width: 210mm;
    height: 297mm;
    background: #fff;
    position: relative;
    box-shadow: 0 4px 32px rgba(0,0,0,0.18);
    overflow: hidden;
  }

  /* ── Full-page background letterhead ── */
  .bg-img {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    object-fit: cover;
    object-position: top;
    z-index: 0;
  }

  /* ── All content above background — A4 ला fit ── */
  .content {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    z-index: 1;
    padding: 58mm 12mm 10mm 12mm;
    display: flex;
    flex-direction: column;
  }

  .title-wrap { text-align: center; margin-bottom: 5px; }
  .title-wrap h1 {
    font-size: 20px; font-weight: 800;
    color: ${CO.color}; letter-spacing: 0.06em; text-transform: uppercase;
  }
  .title-wrap .pay-period { font-size: 10.5px; color: #555; margin-top: 3px; }

  .divider {
    height: 2px;
    background: linear-gradient(to right, ${CO.color}, #4a90d9, ${CO.color});
    margin: 8px 0 12px; border-radius: 2px;
  }

  .emp-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 3px 20px; margin-bottom: 10px; font-size: 10.5px;
  }
  .emp-grid .row { display: flex; gap: 5px; }
  .emp-grid .row .key { color: #555; min-width: 95px; }
  .emp-grid .row .val { color: #111; font-weight: 600; }

  .attend-strip {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 5px; margin-bottom: 10px;
  }
  .attend-strip .abox {
    background: #f0f5fc; border: 1px solid #c8d8ee;
    border-radius: 4px; padding: 6px 8px; text-align: center;
  }
  .attend-strip .abox .ak { color: #777; font-size: 8.5px; text-transform: uppercase; letter-spacing: 0.03em; }
  .attend-strip .abox .av { font-weight: 700; color: ${CO.color}; font-size: 12px; margin-top: 2px; }

  .table-wrap { border: 1px solid #d0dce8; border-radius: 5px; overflow: hidden; margin-bottom: 0; }
  table { width: 100%; border-collapse: collapse; font-size: 10.5px; }
  thead tr { background: ${CO.color}; color: #fff; }
  thead th {
    padding: 7px 9px; text-align: left;
    font-weight: 700; font-size: 10px; letter-spacing: 0.04em; text-transform: uppercase;
  }
  thead th.right { text-align: right; }
  tbody tr { border-bottom: 1px solid #e8edf2; }
  tbody tr:nth-child(even) { background: #f5f8fc; }
  tbody tr:last-child { border-bottom: none; }
  td { padding: 6px 9px; color: #333; vertical-align: middle; }
  td.tr { text-align: right; font-weight: 500; color: #1a1a1a; }
  td.ded { border-left: 1px solid #d0dce8; }

  .totals-row {
    display: grid; grid-template-columns: 1fr 1fr;
    background: #e8f0fb; border-top: 2px solid ${CO.color};
  }
  .totals-row .half {
    padding: 8px 9px; display: flex;
    justify-content: space-between; align-items: center;
    font-size: 11px; font-weight: 700; color: ${CO.color};
  }
  .totals-row .half + .half { border-left: 1px solid #c0d0e8; }

  .net-wrap { margin-top: 10px; border: 1.5px solid ${CO.color}; border-radius: 5px; overflow: hidden; }
  .net-header { display: grid; grid-template-columns: 1fr 1fr; }
  .net-header .nh {
    background: ${CO.color}; color: #fff; padding: 7px 10px;
    font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em;
  }
  .net-header .nh + .nh { border-left: 1px solid rgba(255,255,255,0.25); }
  .net-body { display: grid; grid-template-columns: 1fr 1fr; }
  .net-body .nb { padding: 9px 10px; font-size: 12px; font-weight: 700; color: ${CO.color}; }
  .net-body .nb + .nb { border-left: 1px solid #d0dce8; }

  .words-wrap {
    margin-top: 8px; background: #f0f5fc; border: 1px solid #c8d8ee;
    border-radius: 4px; padding: 7px 12px; font-size: 10px; color: #333;
  }
  .words-wrap span { font-weight: 700; color: ${CO.color}; }

  .info-strip {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 5px 14px; margin-top: 10px; padding: 8px 12px;
    background: #f7f9fc; border: 1px solid #dce6f0;
    border-radius: 4px; font-size: 9.5px;
  }
  .info-strip .irow { display: flex; gap: 4px; }
  .info-strip .irow .ik { color: #777; min-width: 75px; }
  .info-strip .irow .iv { font-weight: 600; color: #222; }

  .note-line {
    position: absolute;
    bottom: 50mm;
    left: 12mm;
    right: 12mm;
    text-align: left;
    font-size: 9.5px;
    color: #555;
    font-style: italic;
  }

  .save-btn-wrap {
    position: fixed;
    top: 16px;
    right: 24px;
    z-index: 9999;
  }
  .save-btn {
    background: #1a3c6e;
    color: #fff;
    border: none;
    border-radius: 6px;
    padding: 10px 22px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 2px 10px rgba(0,0,0,0.18);
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: 'Inter', Arial, sans-serif;
  }
  .save-btn:hover { background: #245096; }

  @media print {
    html, body { margin: 0; padding: 0; background: none; width: 210mm; height: 297mm; }
    .page {
      box-shadow: none !important;
      width: 210mm !important;
      height: 297mm !important;
      overflow: hidden !important;
      page-break-after: avoid;
    }
    .save-btn-wrap { display: none; }
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  }
  @page { size: 210mm 297mm; margin: 0; }
</style>
</head>
<body>
<div class="save-btn-wrap">
  <button class="save-btn" onclick="window.print()">
    ⬇ Save as PDF
  </button>
</div>
<div class="page">

  <img class="bg-img" src="${bgImage}" alt="" />

  <div class="content">

    <div class="title-wrap">
      <h1>Pay Slip</h1>
      <div class="pay-period">Pay Period: ${payPeriod}</div>
    </div>
    <div class="divider"></div>

    <div class="emp-grid">
      <div class="row"><span class="key">Employee Name</span><span class="val">: ${ps.emp_name || '—'}</span></div>
      <div class="row"><span class="key">Employee ID</span><span class="val">: ${ps.emp_id || '—'}</span></div>
      <div class="row"><span class="key">Designation</span><span class="val">: ${ps.designation || '—'}</span></div>
      <div class="row"><span class="key">Department</span><span class="val">: ${ps.department || '—'}</span></div>
      <div class="row"><span class="key">Bank Name</span><span class="val">: ${ps.bank_name || '—'}</span></div>
      <div class="row"><span class="key">Account No</span><span class="val">: ${ps.account_no || '—'}</span></div>
    </div>

    <div class="attend-strip">
      <div class="abox"><div class="ak">Working Days</div><div class="av">${ps.working_days || '—'}</div></div>
      <div class="abox"><div class="ak">Paid Days</div><div class="av">${ps.paid_days || ps.working_days || '—'}</div></div>
      <div class="abox"><div class="ak">LOP Days</div><div class="av">${ps.lop || '0'}</div></div>
      <div class="abox"><div class="ak">Leave Balance</div><div class="av">${ps.pl || '—'}</div></div>
    </div>

    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Earnings</th><th class="right">Amount (₹)</th>
            <th>Deductions</th><th class="right">Amount (₹)</th>
          </tr>
        </thead>
        <tbody>${tableRows}</tbody>
      </table>
      <div class="totals-row">
        <div class="half"><span>Gross Salary</span><span>₹ ${fmt(totalEarnings)}</span></div>
        <div class="half"><span>Total Deductions</span><span>₹ ${fmt(totalDeductions)}</span></div>
      </div>
    </div>

    <div class="net-wrap">
      <div class="net-header">
        <div class="nh">Net Pay</div><div class="nh">Amount (₹)</div>
      </div>
      <div class="net-body">
        <div class="nb">Net Salary Payable</div><div class="nb">₹ ${fmt(netPay)}</div>
      </div>
    </div>

    <div class="words-wrap">
      Net Salary in Words: <span>${toWords(netPay)} Only</span>
    </div>

    <div class="info-strip">
      <div class="irow"><span class="ik">UAN Number</span><span class="iv">: ${ps.uan_number || '—'}</span></div>
      <div class="irow"><span class="ik">PF Number</span><span class="iv">: ${ps.pf_number || '—'}</span></div>
      <div class="irow"><span class="ik">PAN Number</span><span class="iv">: ${ps.pan_number || '—'}</span></div>
      <div class="irow"><span class="ik">Aadhar No</span><span class="iv">: ${ps.adhar_number || '—'}</span></div>
      <div class="irow"><span class="ik">Month / Year</span><span class="iv">: ${ps.month} ${ps.year}</span></div>
      <div class="irow"><span class="ik">Annual Gross</span><span class="iv">: ₹ ${fmt((ps.monthly_gross || 0) * 12)}</span></div>
    </div>

    <div class="note-line">
      Note: This is a computer-generated slip, signature is not required.
    </div>

  </div>
</div>
</body>
</html>`)

  win.document.close()
}