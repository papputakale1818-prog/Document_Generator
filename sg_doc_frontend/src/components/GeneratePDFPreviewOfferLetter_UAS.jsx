
// import { useEffect, useRef } from 'react'
// import bgImage from '../assets/UAS_backGround.jpeg'
// import stamp1Image from '../assets/uas_stamp1.png'
// import stamp2Image from '../assets/uas_stamp2.png'

// // ─── Company Config ────────────────────────────────────────────────────────
// const CO = {
//   fullName:      'UAS IT Consultancy Services PVT LTD',
//   website:       'www.uasit.org',
//   email:         'hr@uasit.org',
//   address:       'Office No. 204, Khandagale Complex<br>Near EON Hospital, Kharadi Bypass<br>Pune 411014',
//   gstin:         '27ABJCS4985R1Z4',
//   tan:           'PNES82511C',
//   themeColor:    '#1a237e',
// }

// // ─── Helpers ───────────────────────────────────────────────────────────────
// const ones = ['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen']
// const tens  = ['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety']
// function hw(n) { if(n<20) return ones[n]; if(n<100) return tens[Math.floor(n/10)]+(n%10?' '+ones[n%10]:''); return ones[Math.floor(n/100)]+' Hundred'+(n%100?' '+hw(n%100):'') }
// function toWords(n) { n=Math.round(n); if(!n) return 'Zero Rupees'; const cr=Math.floor(n/10000000),lk=Math.floor((n%10000000)/100000),th=Math.floor((n%100000)/1000),rest=n%1000; let r=''; if(cr) r+=hw(cr)+' Crore '; if(lk) r+=hw(lk)+' Lakh '; if(th) r+=hw(th)+' Thousand '; if(rest) r+=hw(rest); return r.trim()+' Rupees' }
// function fmtNum(n) { if(n===null||n===undefined||isNaN(n)) return '0'; return Math.round(n).toLocaleString('en-IN') }
// function fmtDate(d) { if(!d) return '—'; return new Date(d).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'}) }

// // ─── HTML Builder ──────────────────────────────────────────────────────────
// // Converts background image to base64 dataURL and builds full 4-page HTML
// function buildOfferLetterHTML({ form, salaryRows, calculations, bgDataUrl, stamp1Url, stamp2Url }) {
//   const { ctcA, netM, monthly, esiApplicable } = calculations

//   const bgStyle = bgDataUrl
//     ? `background-image:url('${bgDataUrl}');background-size:cover;background-repeat:no-repeat;background-position:center top;`
//     : ''

//   const pgStyle = `
//     width:210mm;
//     min-height:297mm;
//     margin:0 auto;
//     ${bgStyle}
//     padding:50mm 20mm 30mm;
//     font-family:'Segoe UI',Arial,sans-serif;
//     font-size:11pt;
//     color:#1a1a2e;
//     font-family:'Calibri','Segoe UI',Arial,sans-serif;
//     line-height:1.7;
//     position:relative;
//   `

//   const headerInfo = ``

//   const footerHTML = `
//     <div style="position:absolute;bottom:25mm;left:20mm;right:20mm;padding-top:8px;border-top:1.5px solid #1a237e;text-align:center;font-size:9pt;color:#37474f;line-height:1.6;font-family:'Calibri',Arial,sans-serif;">
//       Address: Office No:204, Khandagale Complex, Near EON Hospital, Kharadi Bypass, Pune 411014<br>
//       Website: <a href="https://www.uasit.org" style="color:${CO.themeColor}">www.uasit.org</a>
//       &nbsp;|&nbsp; Email: <a href="mailto:${CO.email}" style="color:${CO.themeColor}">${CO.email}</a>
//     </div>`

//   // ── Salary table rows ──
//   const rHTML = salaryRows.map(({ label, naNote, m, y, type }) => {
//     const st = {
//       gross:          `background:#c5cae9;font-weight:700;color:#1a237e`,
//       deduct:         `background:#fff;color:#333`,
//       'deduct-total': `background:#c5cae9;font-weight:700;color:#1a237e`,
//       net:            `background:#c5cae9;font-weight:700;color:#1a237e`,
//       employer:       `background:#fff;color:#333`,
//       na:             `color:#333;background:#fff`,
//     }[type] || `background:#fff;color:#333`
//     const labelHTML = naNote
//       ? `${label}<br><span style="color:#c62828;font-size:9pt;font-weight:400;">(${naNote})</span>`
//       : label
//     return `<tr style="${st}">
//       <td style="padding:2px 8px;border:1px solid #9fa8da;font-size:10pt;font-family:'Calibri',Arial,sans-serif;">${labelHTML}</td>
//       <td style="padding:2px 8px;border:1px solid #9fa8da;text-align:right;font-family:'Calibri',Arial,sans-serif;font-size:10pt;">${m!==null?fmtNum(m):'-'}</td>
//       <td style="padding:2px 8px;border:1px solid #9fa8da;text-align:right;font-family:'Calibri',Arial,sans-serif;font-size:10pt;">${y!==null?fmtNum(y):'-'}</td>
//     </tr>`
//   }).join('')

//   // ── PAGE 1: Offer Cum Appointment Of Employment ──
//   const page1 = `
//   <div style="${pgStyle}">
//     ${headerInfo}
//     <div style="text-align:right;margin-bottom:16px;color:#1a1a2e;font-size:11pt;font-weight:600;font-family:'Calibri',Arial,sans-serif;">${fmtDate(form.offerDate)}</div>
//     <h1 style="text-align:center;font-size:14pt;font-weight:700;text-decoration:underline;margin:20px 0 24px;font-family:'Calibri',Arial,sans-serif;letter-spacing:0.03em;color:#1a237e;">Offer Cum Appointment Of Employment</h1>

//     <p style="margin-bottom:14px;line-height:1.8"><strong>Dear</strong> ${(form.fullName || '[Employee Name]').split(' ')[0]},</p>

//     <p style="margin-bottom:10px;line-height:1.8">We are pleased to offer you an employment at the post of &ldquo;<strong>${form.designation || '[Designation]'}</strong>&rdquo; in our Company <strong>UAS IT Consultancy Services Pvt. Ltd.</strong></p>
//     <p style="margin-bottom:10px;line-height:1.8">Once you are part of the team, the Company management will initially provide a period of indoctrination training to familiarize you with the Company&rsquo;s procedures and processes.</p>
//     <p style="margin-bottom:18px;line-height:1.8">We offer you this employment on the following terms and conditions:</p>

//     <ol style="padding-left:20px;line-height:1.85;font-size:13px">
//       <li style="margin-bottom:14px">
//         <strong>Date of Joining: ${fmtDate(form.joiningDate)}</strong>, except if otherwise extended by the Company and communicated to you in writing. Please submit all the documents mentioned in Annexure A at the time of joining. On the day of joining, please come to the work location mentioned above at 10:30 am. Human Resources department will be very happy to walk you through our facility, familiarizing you with our work culture, guide you through our work environment and introduce you to your team.
//       </li>
//     </ol>

//     <p style="margin-bottom:12px;line-height:1.85;font-size:13px"><strong>2. Probation Period:</strong> (6 months) At the discretion of the Company, the probation period may be extended, if it is found that the services provided by you are not satisfactory.</p>

//     <p style="margin-bottom:12px;line-height:1.85;font-size:13px"><strong>3. Location:</strong> You will be based in ${form.location || 'Pune'}. However, depending upon the company&rsquo;s requirements, you may be required to travel and/or be posted temporarily or permanently at other offices/locations.</p>

//     <p style="margin-bottom:12px;line-height:1.85;font-size:13px"><strong>4. Remuneration:</strong> Your Annual Cost to Company shall be Rs <strong>${fmtNum(ctcA)}/- (${toWords(ctcA)} Only)</strong> subject to applicable statutory deductions. The detailed break up of your salary structure is provided in Annexure B.</p>

//     <p style="margin-bottom:12px;line-height:1.85;font-size:13px"><strong>5. Working Hours and Leave:</strong> The normal working days will be [five (5) days] a week. You may be required to work more than or outside normal working days as necessary to perform your duties and responsibilities.</p>

//     ${footerHTML}
//   </div>`

//   // ── PAGE 2: Clauses 6 & 7 + Sign-off ──
//   const page2 = `
//   <div style="page-break-before:always;width:210mm;min-height:297mm;margin:0 auto;${bgStyle}padding:69mm 20mm 30mm;font-family:'Calibri','Segoe UI',Arial,sans-serif;font-size:11pt;color:#1a1a2e;line-height:1.7;position:relative;">
//     ${headerInfo}

//     <p style="margin-bottom:14px;line-height:1.85;font-size:13px">The salary payable to you hereunder is an adequate compensation in case you are required to work for any additional hours, and you shall not be entitled to any additional payment in this regard. You will be entitled to a certain amount of paid leave annually as per the prevalent policies of the Company.</p>

//     <p style="margin-bottom:14px;line-height:1.85;font-size:13px"><strong>6. Confidentiality:</strong> The contents of this Offer Letter are strictly confidential to the Company and the Company treats the contents of this Offer Letter as its confidential information. Irrespective of whether or not you accept this offer, you shall at all times maintain absolute confidentiality of the content of this offer as well as any information which was disclosed to you pursuant to your discussions with the Company. Any disclosure of the contents of this offer to any third party will be construed as a serious breach and the Company may initiate appropriate legal action against you. The Company may revoke this offer of employment any-time. Similarly, after accepting this offer, if you do not intend to join the Company, you shall have a right to inform your intentions any-time before your joining date.</p>

//     <p style="margin-bottom:20px;line-height:1.85;font-size:13px"><strong>7. Verification:</strong> As part of our process, we will conduct a reference check and antecedent verification of your medical records, and all the data or information produced by you before and during the interview process. If it is found at any time that any information furnished by you to the Company is incorrect or false or if you are found to have willfully suppressed or concealed any material information, the Company will have the right to withdraw the offer and you will be liable to removal from the services without any notice and compensation in lieu thereof.</p>

//     <p style="margin-bottom:28px;line-height:1.85;font-size:13px">We are eager to welcome you to the family!</p>

//     <p style="margin-bottom:6px;font-size:13px">Yours truly,</p>
//     <p style="margin-bottom:4px;font-size:13px;font-weight:700">For UAS IT Consultancy Services Pvt. Ltd.</p>
//     <p style="margin-bottom:4px;font-size:13px">HR Manager</p>

//     ${footerHTML}
//   </div>`

//   // ── PAGE 3: Acceptance / Sign-off Page ──
//   const page3_acceptance = `
//   <div style="page-break-before:always;width:210mm;min-height:297mm;margin:0 auto;${bgStyle}padding:69mm 20mm 30mm;font-family:'Calibri','Segoe UI',Arial,sans-serif;font-size:11pt;color:#1a1a2e;line-height:1.7;position:relative;">
//     ${headerInfo}

//     <div style="margin-top:0px;margin-bottom:40px">
//       <p style="font-size:13px;font-weight:700;line-height:1.85;margin-bottom:30px">This Offer is valid for 4 days. You are requested to return the duplicate copy of this letter, duly signed by you in token of your acceptance of the above Offer.</p>
//     </div>

//     <div style="display:flex;justify-content:space-between;margin-top:80px;padding:0 10px">
//       <div style="text-align:left;min-width:200px">
//         <p style="font-size:13px;margin-bottom:6px">Yours truly,</p>
//         <p style="font-size:13px;font-weight:700;margin-bottom:6px">For UAS IT Consultancy Services Pvt. Ltd.</p>
//         <p style="font-size:13px;margin-bottom:10px">HR Manager</p>
//         <div style="position:relative;width:180px;height:160px;margin-top:8px;">
//           <img src="${stamp1Url}" alt="Signature" style="position:absolute;top:0;left:0;width:100px;height:auto;z-index:2;" />
//           <img src="${stamp2Url}" alt="Stamp" style="position:absolute;bottom:0;left:0;width:140px;height:auto;z-index:1;" />
//         </div>

//       </div>
//       <div style="text-align:left;min-width:200px">
//         <p style="font-size:13px;font-weight:700;margin-bottom:6px">Agreed and Accepted</p>
//         <p style="font-size:13px;margin-bottom:60px">${form.fullName || '[Employee Name]'}</p>
//         <div style="border-top:1px solid #555;width:160px;padding-top:4px">
//           <p style="font-size:11px;color:#555">Signature</p>
//         </div>
//         <p style="font-size:13px;margin-top:20px"><strong>Date:</strong> ___________________</p>
//       </div>
//     </div>

//     ${footerHTML}
//   </div>`

//   // ── PAGE 3: Annexure A – List of Documents ──
//   const page3 = `
//   <div style="page-break-before:always;width:210mm;min-height:297mm;margin:0 auto;${bgStyle}padding:50mm 20mm 30mm;font-family:'Calibri','Segoe UI',Arial,sans-serif;font-size:11pt;color:#1a1a2e;line-height:1.7;position:relative;">
//     ${headerInfo}
//     <div style="text-align:center;margin:0 0 16px">
//       <div style="font-size:13pt;font-weight:700;text-decoration:underline;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px;font-family:'Calibri',Arial,sans-serif;color:#1a237e;">ANNEXURE &lsquo;A&rsquo;</div>
//       <div style="font-size:11pt;text-decoration:underline;margin-top:4px;font-family:'Calibri',Arial,sans-serif;color:#37474f;">List Of Documents</div>
//     </div>

//     <ol class="tight-list" style="padding-left:20px;margin-top:4px">
//       <li style="margin-bottom:0"><strong>Latest/updated Resume</strong></li>

//       <li style="margin-bottom:0"><strong>Identity Proof: (Any one)</strong>
//         <ol type="a" style="padding-left:18px;margin-top:0">
//           <li>Passport</li>
//           <li>Aadhar Card</li>
//           <li>Voter&rsquo;s card or Driving License</li>
//         </ol>
//       </li>

//       <li style="margin-bottom:0"><strong>Current and Permanent Address Proof - (Any One)</strong>
//         <ol type="a" style="padding-left:18px;margin-top:0">
//           <li>Aadhar Card</li>
//           <li>Voter ID</li>
//           <li>Electricity bill</li>
//           <li>Telephone bills</li>
//           <li>Corporation tax receipt</li>
//         </ol>
//       </li>

//       <li style="margin-bottom:0"><strong>Educational Information: All documents</strong>
//         <ol type="a" style="padding-left:18px;margin-top:0">
//           <li>SSC mark sheet &amp; certificate</li>
//           <li>HSC mark sheet &amp; certificate</li>
//           <li>Graduation (if applicable): Semester (if applicable): Semester wise mark sheets or a consolidated mark sheet and Certificate (Passing Certificate / Convocation Certificate/Provisional Passing Certificate)</li>
//           <li>Post-graduation (if applicable): Semester wise mark sheets or a consolidated mark sheet and Certificate (Passing Certificate / Convocation Certificate/Provisional Passing Certificate)</li>
//         </ol>
//       </li>

//       <li style="margin-bottom:0"><strong>Professional Information: (as applicable)</strong>
//         <ol type="a" style="padding-left:18px;margin-top:0">
//           <li>Previous employment offer letter</li>
//           <li>Previous employment Appraisal letter</li>
//           <li>Previous employment Relieving Letter/Experience Certificate / Service Certificate from all previous employers (if applicable)</li>
//           <li>Resignation Acceptance Letter / Email / Relieving Letter / Experience Certificate from current employer (if not currently available, it is mandatory to submit the same on the date of Joining)</li>
//           <li>Last three (3) months&rsquo; salary slip/salary certificate</li>
//         </ol>
//       </li>

//       <li style="margin-bottom:0"><strong>One (1) passport size photograph</strong></li>

//       <li style="margin-bottom:0"><strong>PAN Card (Mandatory)</strong></li>
//     </ol>

//     ${footerHTML}
//   </div>`

//   // ── PAGE 4: Annexure B – Salary Distribution ──
//   const page4 = `
//   <div style="page-break-before:always;width:210mm;min-height:297mm;margin:0 auto;${bgStyle}padding:50mm 20mm 30mm;font-family:'Calibri','Segoe UI',Arial,sans-serif;font-size:11pt;color:#1a1a2e;line-height:1.7;position:relative;">
//     ${headerInfo}
//     <div style="text-align:center;margin:24px 0 6px">
//       <div style="font-size:15px;font-weight:700;text-decoration:underline;text-transform:uppercase;letter-spacing:.06em">ANNEXURE &lsquo;B&rsquo;</div>
//       <div style="font-size:13px;text-decoration:underline;margin-top:6px">SALARY DISTRIBUTION</div>
//     </div>
//     <table style="width:100%;border-collapse:collapse;margin:20px 0;font-size:12px">
//       <thead>
//         <tr>
//           <th style="background:${CO.themeColor};color:#fff;padding:4px 8px;font-size:10pt;letter-spacing:0.06em;text-transform:uppercase;font-family:'Calibri',Arial,sans-serif;text-align:left;border:1px solid #9fa8da">Particulars</th>
//           <th style="background:${CO.themeColor};color:#fff;padding:4px 8px;font-size:10pt;letter-spacing:0.06em;text-transform:uppercase;font-family:'Calibri',Arial,sans-serif;text-align:right;border:1px solid #9fa8da">Monthly Salary</th>
//           <th style="background:${CO.themeColor};color:#fff;padding:4px 8px;font-size:10pt;letter-spacing:0.06em;text-transform:uppercase;font-family:'Calibri',Arial,sans-serif;text-align:right;border:1px solid #9fa8da">Yearly Salary</th>
//         </tr>
//       </thead>
//       <tbody>${rHTML}</tbody>
//     </table>
//     <div style="background:#e8eaf6;border:1px solid #c5cae9;border-radius:6px;padding:10px 16px;margin-top:24px;margin-bottom:20px">
//       <div style="font-size:11px;font-weight:700;color:#37474f;text-transform:uppercase;letter-spacing:.08em;margin-bottom:3px">Annual CTC in Words</div>
//       <div style="font-size:13px;font-weight:600;color:${CO.themeColor}">${toWords(ctcA)} Only</div>
//     </div>
//     ${footerHTML}
//   </div>`

//   return `<!DOCTYPE html><html><head>
// <meta charset="UTF-8">
// <meta name="viewport" content="width=device-width, initial-scale=1.0">
// <title>Offer Letter — ${form.fullName || 'Employee'} — ${CO.fullName}</title>
// <link href="https://fonts.googleapis.com/css2?family=Calibri:wght@400;600;700&family=Times+New+Roman:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
// <style>
//   *{box-sizing:border-box;margin:0;padding:0}
//   body{
//     font-family:'Calibri','Segoe UI',Arial,sans-serif;
//     color:#1a1a2e;
//     font-size:11pt;
//     background:#f5f5f5;
//     line-height:1.6;
//   }
//   @page{size:A4 portrait;margin:0}
//   @media print{
//     html,body{width:210mm;margin:0;background:white}
//     .no-print{display:none!important}
//     *{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}
//     div[style*="page-break-before"]{page-break-before:always}
//   }
//   /* Each page div fixed to exact A4 size */
//   body > div[style*="width:210mm"] {
//     width:210mm !important;
//     height:297mm !important;
//     min-height:unset !important;
//     overflow:hidden;
//     page-break-after:always;
//     margin:0 auto 8px auto;
//     box-shadow:0 2px 8px rgba(0,0,0,0.15);
//   }
//   p{margin-bottom:10px;line-height:1.7;font-size:11pt;text-align:justify;}
//   ol li{line-height:1.7;font-size:11pt;text-align:justify;}
//   ol.tight-list li, ol.tight-list ol li{line-height:normal!important;font-size:10.5pt!important;margin-bottom:0!important;}
//   strong{font-weight:700;}
//   h1{font-family:'Calibri','Segoe UI',Arial,sans-serif;letter-spacing:0.02em;}
//   table{font-family:'Calibri','Segoe UI',Arial,sans-serif;}
//   td,th{font-size:10.5pt;}
// </style>
// </head><body>
// ${page1}${page2}${page3}${page4}${page3_acceptance}

// <!-- Bottom bar (visible on screen only, hides on print) -->
// <div class="no-print" style="position:fixed;bottom:0;left:0;right:0;background:linear-gradient(135deg,#1e293b,#0f172a);border-top:2px solid #3949ab;padding:16px 28px;display:flex;align-items:center;justify-content:space-between;z-index:9999;font-family:'Segoe UI',sans-serif;">
//   <div>
//     <div style="color:#fff;font-size:14px;font-weight:600;margin-bottom:3px">✅ Offer Letter Ready!</div>
//     <div style="color:#64748b;font-size:12px">👇 <strong style="color:#7986cb">"Save as PDF"</strong> निवडा</div>
//   </div>
//   <div style="display:flex;gap:10px">
//     <button onclick="window.print()" style="background:linear-gradient(135deg,#1a237e,#283593);color:#fff;border:none;padding:11px 28px;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer">⬇️ Save as PDF</button>
//     <button onclick="window.close()" style="background:rgba(255,255,255,0.06);color:#64748b;border:1px solid rgba(255,255,255,0.1);padding:11px 16px;border-radius:10px;font-size:13px;cursor:pointer">✕</button>
//   </div>
// </div>
// </body></html>`
// }

// // ─── Main Component ───────────────────────────────────────────────────────────
// // Props:
// //   form         — { fullName, designation, department, offerDate, joiningDate,
// //                    appointDate, contractPeriod, location, annualGross, ... }
// //   salaryRows   — array of { label, m, y, type }
// //   calculations — { annual, monthly, ctcA, netM, esiApplicable, ... }
// //   onClose      — () => void
// export default function GeneratePDFPreviewOfferLetter_UAS({ form, salaryRows, calculations, onClose }) {
//   const iframeRef = useRef(null)

//   // Helper: convert an image src → base64 dataURL
//   function toDataUrl(src) {
//     return new Promise((resolve) => {
//       const img = new Image()
//       img.src = src
//       img.onload = () => {
//         const canvas = document.createElement('canvas')
//         canvas.width  = img.naturalWidth  || 794
//         canvas.height = img.naturalHeight || 1123
//         canvas.getContext('2d').drawImage(img, 0, 0)
//         resolve(canvas.toDataURL('image/png'))
//       }
//       img.onerror = () => resolve('')
//     })
//   }

//   // Convert background image → base64 dataURL → write HTML into iframe
//   useEffect(() => {
//     if (!iframeRef.current) return

//     Promise.all([toDataUrl(bgImage), toDataUrl(stamp1Image), toDataUrl(stamp2Image)])
//       .then(([bgDataUrl, stamp1Url, stamp2Url]) => {
//         const html = buildOfferLetterHTML({ form, salaryRows, calculations, bgDataUrl, stamp1Url, stamp2Url })
//         const iframe = iframeRef.current
//         if (!iframe) return
//         iframe.srcdoc = html
//       })
//   }, [form, salaryRows, calculations])

//   // Open in new window for print (popup)
//   const handlePrint = () => {
//     Promise.all([toDataUrl(bgImage), toDataUrl(stamp1Image), toDataUrl(stamp2Image)])
//       .then(([bgDataUrl, stamp1Url, stamp2Url]) => {
//         const html = buildOfferLetterHTML({ form, salaryRows, calculations, bgDataUrl, stamp1Url, stamp2Url })
//         const pw = window.open('', '_blank')
//         if (!pw) return
//         pw.document.write(html)
//         pw.document.close()
//       })
//   }

//   return (
//     // ── Full screen overlay ──
//     <div className="fixed inset-0 z-50 flex flex-col bg-[#0f172a]">

//       {/* ── Top bar ── */}
//       <div className="flex items-center justify-between px-5 py-3 bg-[#1e293b] border-b border-white/10 flex-shrink-0">

//         {/* Left: Employee info */}
//         <div className="flex items-center gap-3">
//           <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-700 to-indigo-800 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
//             {form.fullName?.charAt(0)?.toUpperCase() || 'U'}
//           </div>
//           <div>
//             <div className="text-white font-semibold text-sm">{form.fullName || 'Employee'}</div>
//             <div className="text-gray-400 text-xs">
//               {form.designation || '—'}
//               {form.department ? ` · ${form.department}` : ''}
//               <span className="ml-2 text-gray-600">· UAS IT Consultancy · 4 Pages</span>
//             </div>
//           </div>
//         </div>

//         {/* Right: Actions */}
//         <div className="flex items-center gap-2">
//           {/* Save as PDF */}
//           <button
//             onClick={handlePrint}
//             className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 text-white text-sm font-semibold hover:scale-105 active:scale-95 transition-all shadow-lg"
//           >
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
//             </svg>
//             Save as PDF
//           </button>

//           {/* Close */}
//           <button
//             onClick={onClose}
//             className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
//           >
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
//             </svg>
//           </button>
//         </div>
//       </div>

//       {/* ── iframe — full screen PDF preview ── */}
//       <iframe
//         ref={iframeRef}
//         title={`Offer Letter — ${form.fullName || 'Employee'}`}
//         className="flex-1 w-full border-0 bg-[#f5f5f5]"
//         sandbox="allow-same-origin allow-scripts allow-modals"
//       />
//     </div>
//   )
// }


import { useEffect, useRef } from 'react'
import bgImage from '../assets/UAS_backGround.jpeg'
import stamp1Image from '../assets/uas_stamp1.png'
import stamp2Image from '../assets/uas_stamp2.png'

// ─── Company Config ────────────────────────────────────────────────────────
const CO = {
  fullName:      'UAS IT Consultancy Services PVT LTD',
  website:       'www.uasit.org',
  email:         'hr@uasit.org',
  address:       'Office No. 204, Khandagale Complex<br>Near EON Hospital, Kharadi Bypass<br>Pune 411014',
  gstin:         '27ABJCS4985R1Z4',
  tan:           'PNES82511C',
  themeColor:    '#1a237e',
}

// ─── Helpers ───────────────────────────────────────────────────────────────
const ones = ['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen']
const tens  = ['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety']
function hw(n) { if(n<20) return ones[n]; if(n<100) return tens[Math.floor(n/10)]+(n%10?' '+ones[n%10]:''); return ones[Math.floor(n/100)]+' Hundred'+(n%100?' '+hw(n%100):'') }
function toWords(n) { n=Math.round(n); if(!n) return 'Zero Rupees'; const cr=Math.floor(n/10000000),lk=Math.floor((n%10000000)/100000),th=Math.floor((n%100000)/1000),rest=n%1000; let r=''; if(cr) r+=hw(cr)+' Crore '; if(lk) r+=hw(lk)+' Lakh '; if(th) r+=hw(th)+' Thousand '; if(rest) r+=hw(rest); return r.trim()+' Rupees' }
function fmtNum(n) { if(n===null||n===undefined||isNaN(n)) return '0'; return Math.round(n).toLocaleString('en-IN') }
function fmtDate(d) { if(!d) return '—'; return new Date(d).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'}) }

// ─── HTML Builder ──────────────────────────────────────────────────────────
// Converts background image to base64 dataURL and builds full 4-page HTML
function buildOfferLetterHTML({ form, salaryRows, calculations, bgDataUrl, stamp1Url, stamp2Url }) {
  const { ctcA, netM, monthly, esiApplicable } = calculations

  const bgStyle = bgDataUrl
    ? `background-image:url('${bgDataUrl}');background-size:cover;background-repeat:no-repeat;background-position:center top;`
    : ''

  const pgStyle = `
    width:210mm;
    min-height:297mm;
    margin:0 auto;
    ${bgStyle}
    padding:50mm 20mm 30mm;
    font-family:'Segoe UI',Arial,sans-serif;
    font-size:11pt;
    color:#1a1a2e;
    font-family:'Calibri','Segoe UI',Arial,sans-serif;
    line-height:1.7;
    position:relative;
  `

  const headerInfo = ``

  const footerHTML = `
    <div style="position:absolute;bottom:25mm;left:20mm;right:20mm;padding-top:8px;border-top:1.5px solid #1a237e;text-align:center;font-size:9pt;color:#37474f;line-height:1.6;font-family:'Calibri',Arial,sans-serif;">
      Address: Office No:204, Khandagale Complex, Near EON Hospital, Kharadi Bypass, Pune 411014<br>
      Website: <a href="https://www.uasit.org" style="color:${CO.themeColor}">www.uasit.org</a>
      &nbsp;|&nbsp; Email: <a href="mailto:${CO.email}" style="color:${CO.themeColor}">${CO.email}</a>
    </div>`

  // ── Salary table rows ──
  const rHTML = salaryRows.map(({ label, naNote, m, y, type }) => {
    const st = {
      gross:          `background:#c5cae9;font-weight:700;color:#1a237e`,
      deduct:         `background:#fff;color:#333`,
      'deduct-total': `background:#c5cae9;font-weight:700;color:#1a237e`,
      net:            `background:#c5cae9;font-weight:700;color:#1a237e`,
      employer:       `background:#fff;color:#333`,
      na:             `color:#333;background:#fff`,
    }[type] || `background:#fff;color:#333`
    const labelHTML = naNote
      ? `${label}<br><span style="color:#c62828;font-size:9pt;font-weight:400;">(${naNote})</span>`
      : label
    return `<tr style="${st}">
      <td style="padding:2px 8px;border:1px solid #9fa8da;font-size:10pt;font-family:'Calibri',Arial,sans-serif;">${labelHTML}</td>
      <td style="padding:2px 8px;border:1px solid #9fa8da;text-align:right;font-family:'Calibri',Arial,sans-serif;font-size:10pt;">${m!==null?fmtNum(m):'-'}</td>
      <td style="padding:2px 8px;border:1px solid #9fa8da;text-align:right;font-family:'Calibri',Arial,sans-serif;font-size:10pt;">${y!==null?fmtNum(y):'-'}</td>
    </tr>`
  }).join('')

  // ── PAGE 1: Offer Cum Appointment Of Employment ──
  const page1 = `
  <div style="${pgStyle}">
    ${headerInfo}
    <div style="text-align:right;margin-bottom:16px;color:#1a1a2e;font-size:11pt;font-weight:600;font-family:'Calibri',Arial,sans-serif;">${fmtDate(form.offerDate)}</div>
    <h1 style="text-align:center;font-size:14pt;font-weight:700;text-decoration:underline;margin:20px 0 24px;font-family:'Calibri',Arial,sans-serif;letter-spacing:0.03em;color:#1a237e;">Offer Cum Appointment Of Employment</h1>

    <p style="margin-bottom:14px;line-height:1.8"><strong>Dear</strong> ${(form.fullName || '[Employee Name]').split(' ')[0]},</p>

    <p style="margin-bottom:10px;line-height:1.8">We are pleased to offer you an employment at the post of &ldquo;<strong>${form.designation || '[Designation]'}</strong>&rdquo; in our Company <strong>UAS IT Consultancy Services Pvt. Ltd.</strong></p>
    <p style="margin-bottom:10px;line-height:1.8">Once you are part of the team, the Company management will initially provide a period of indoctrination training to familiarize you with the Company&rsquo;s procedures and processes.</p>
    <p style="margin-bottom:18px;line-height:1.8">We offer you this employment on the following terms and conditions:</p>

    <ol style="padding-left:20px;line-height:1.85;font-size:13px">
      <li style="margin-bottom:14px">
        <strong>Date of Joining: ${fmtDate(form.joiningDate)}</strong>, except if otherwise extended by the Company and communicated to you in writing. Please submit all the documents mentioned in Annexure A at the time of joining. On the day of joining, please come to the work location mentioned above at 10:30 am. Human Resources department will be very happy to walk you through our facility, familiarizing you with our work culture, guide you through our work environment and introduce you to your team.
      </li>
    </ol>

    <p style="margin-bottom:12px;line-height:1.85;font-size:13px"><strong>2. Probation Period:</strong> (6 months) At the discretion of the Company, the probation period may be extended, if it is found that the services provided by you are not satisfactory.</p>

    <p style="margin-bottom:12px;line-height:1.85;font-size:13px"><strong>3. Location:</strong> You will be based in ${form.location || 'Pune'}. However, depending upon the company&rsquo;s requirements, you may be required to travel and/or be posted temporarily or permanently at other offices/locations.</p>

    <p style="margin-bottom:12px;line-height:1.85;font-size:13px"><strong>4. Remuneration:</strong> Your Annual Cost to Company shall be Rs <strong>${fmtNum(ctcA)}/- (${toWords(ctcA)} Only)</strong> subject to applicable statutory deductions. The detailed break up of your salary structure is provided in Annexure B.</p>

    <p style="margin-bottom:12px;line-height:1.85;font-size:13px"><strong>5. Working Hours and Leave:</strong> The normal working days will be [five (5) days] a week. You may be required to work more than or outside normal working days as necessary to perform your duties and responsibilities.</p>

    ${footerHTML}
  </div>`

  // ── PAGE 2: Clauses 6 & 7 + Sign-off ──
  const page2 = `
  <div style="page-break-before:always;width:210mm;min-height:297mm;margin:0 auto;${bgStyle}padding:69mm 20mm 30mm;font-family:'Calibri','Segoe UI',Arial,sans-serif;font-size:11pt;color:#1a1a2e;line-height:1.7;position:relative;">
    ${headerInfo}

    <p style="margin-bottom:14px;line-height:1.85;font-size:13px">The salary payable to you hereunder is an adequate compensation in case you are required to work for any additional hours, and you shall not be entitled to any additional payment in this regard. You will be entitled to a certain amount of paid leave annually as per the prevalent policies of the Company.</p>

    <p style="margin-bottom:14px;line-height:1.85;font-size:13px"><strong>6. Confidentiality:</strong> The contents of this Offer Letter are strictly confidential to the Company and the Company treats the contents of this Offer Letter as its confidential information. Irrespective of whether or not you accept this offer, you shall at all times maintain absolute confidentiality of the content of this offer as well as any information which was disclosed to you pursuant to your discussions with the Company. Any disclosure of the contents of this offer to any third party will be construed as a serious breach and the Company may initiate appropriate legal action against you. The Company may revoke this offer of employment any-time. Similarly, after accepting this offer, if you do not intend to join the Company, you shall have a right to inform your intentions any-time before your joining date.</p>

    <p style="margin-bottom:20px;line-height:1.85;font-size:13px"><strong>7. Verification:</strong> As part of our process, we will conduct a reference check and antecedent verification of your medical records, and all the data or information produced by you before and during the interview process. If it is found at any time that any information furnished by you to the Company is incorrect or false or if you are found to have willfully suppressed or concealed any material information, the Company will have the right to withdraw the offer and you will be liable to removal from the services without any notice and compensation in lieu thereof.</p>

    <p style="margin-bottom:28px;line-height:1.85;font-size:13px">We are eager to welcome you to the family!</p>

    <p style="margin-bottom:6px;font-size:13px">Yours truly,</p>
    <p style="margin-bottom:4px;font-size:13px;font-weight:700">For UAS IT Consultancy Services Pvt. Ltd.</p>
    <p style="margin-bottom:4px;font-size:13px">HR Manager</p>

    ${footerHTML}
  </div>`

  // ── PAGE 3: Acceptance / Sign-off Page ──
  const page3_acceptance = `
  <div style="page-break-before:always;width:210mm;min-height:297mm;margin:0 auto;${bgStyle}padding:69mm 20mm 30mm;font-family:'Calibri','Segoe UI',Arial,sans-serif;font-size:11pt;color:#1a1a2e;line-height:1.7;position:relative;">
    ${headerInfo}

    <div style="margin-top:0px;margin-bottom:40px">
      <p style="font-size:13px;font-weight:700;line-height:1.85;margin-bottom:30px">This Offer is valid for 4 days. You are requested to return the duplicate copy of this letter, duly signed by you in token of your acceptance of the above Offer.</p>
    </div>

    <div style="display:flex;justify-content:space-between;margin-top:80px;padding:0 10px">
      <div style="text-align:left;min-width:200px">
        <p style="font-size:13px;margin-bottom:6px">Yours truly,</p>
        <p style="font-size:13px;font-weight:700;margin-bottom:6px">For UAS IT Consultancy Services Pvt. Ltd.</p>
        <p style="font-size:13px;margin-bottom:10px">HR Manager</p>
        <div style="position:relative;width:180px;height:160px;margin-top:8px;">
          <img src="${stamp1Url}" alt="Signature" style="position:absolute;top:0;left:0;width:100px;height:auto;z-index:2;" />
          <img src="${stamp2Url}" alt="Stamp" style="position:absolute;bottom:0;left:0;width:140px;height:auto;z-index:1;" />
        </div>

      </div>
      <div style="text-align:left;min-width:200px">
        <p style="font-size:13px;font-weight:700;margin-bottom:6px">Agreed and Accepted</p>
        <p style="font-size:13px;margin-bottom:60px">${form.fullName || '[Employee Name]'}</p>
        <div style="border-top:1px solid #555;width:160px;padding-top:4px">
          <p style="font-size:11px;color:#555">Signature</p>
        </div>
        <p style="font-size:13px;margin-top:20px"><strong>Date:</strong> ___________________</p>
      </div>
    </div>

    ${footerHTML}
  </div>`

  // ── PAGE 3: Annexure A – List of Documents ──
  const page3 = `
  <div style="page-break-before:always;width:210mm;min-height:297mm;margin:0 auto;${bgStyle}padding:50mm 20mm 55mm;font-family:'Calibri','Segoe UI',Arial,sans-serif;font-size:11pt;color:#1a1a2e;line-height:normal;position:relative;overflow:hidden;">
    ${headerInfo}
    <div style="text-align:center;margin:0 0 16px;">
      <div style="font-size:13pt;font-weight:700;text-decoration:underline;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px;font-family:'Calibri',Arial,sans-serif;color:#1a237e;">ANNEXURE &lsquo;A&rsquo;</div>
      <div style="font-size:11pt;text-decoration:underline;margin-top:4px;font-family:'Calibri',Arial,sans-serif;color:#37474f;">List Of Documents</div>
    </div>

    <ol style="padding-left:20px;margin-top:4px;">
      <li style="margin-bottom:0;"><strong>Latest/updated Resume</strong></li>

      <li style="margin-bottom:0;"><strong>Identity Proof: (Any one)</strong>
        <ol type="a" style="padding-left:18px;margin-top:0;">
          <li>Passport</li>
          <li>Aadhar Card</li>
          <li>Voter&rsquo;s card or Driving License</li>
        </ol>
      </li>

      <li style="margin-bottom:0;"><strong>Current and Permanent Address Proof - (Any One)</strong>
        <ol type="a" style="padding-left:18px;margin-top:0;">
          <li>Aadhar Card</li>
          <li>Voter ID</li>
          <li>Electricity bill</li>
          <li>Telephone bills</li>
          <li>Corporation tax receipt</li>
        </ol>
      </li>

      <li style="margin-bottom:0;"><strong>Educational Information: All documents</strong>
        <ol type="a" style="padding-left:18px;margin-top:0;">
          <li>SSC mark sheet &amp; certificate</li>
          <li>HSC mark sheet &amp; certificate</li>
          <li>Graduation (if applicable): Semester (if applicable): Semester wise mark sheets or a consolidated mark sheet and Certificate (Passing Certificate / Convocation Certificate/Provisional Passing Certificate)</li>
          <li>Post-graduation (if applicable): Semester wise mark sheets or a consolidated mark sheet and Certificate (Passing Certificate / Convocation Certificate/Provisional Passing Certificate)</li>
        </ol>
      </li>

      <li style="margin-bottom:0;"><strong>Professional Information: (as applicable)</strong>
        <ol type="a" style="padding-left:18px;margin-top:0;">
          <li>Previous employment offer letter</li>
          <li>Previous employment Appraisal letter</li>
          <li>Previous employment Relieving Letter/Experience Certificate / Service Certificate from all previous employers (if applicable)</li>
          <li>Resignation Acceptance Letter / Email / Relieving Letter / Experience Certificate from current employer (if not currently available, it is mandatory to submit the same on the date of Joining)</li>
          <li>Last three (3) months&rsquo; salary slip/salary certificate</li>
        </ol>
      </li>

      <li style="margin-bottom:0;"><strong>One (1) passport size photograph</strong></li>

      <li style="margin-bottom:0;"><strong>PAN Card (Mandatory)</strong></li>
    </ol>

    ${footerHTML}
  </div>`

  // ── PAGE 4: Annexure B – Salary Distribution ──
  const page4 = `
  <div style="page-break-before:always;width:210mm;min-height:297mm;margin:0 auto;${bgStyle}padding:50mm 20mm 30mm;font-family:'Calibri','Segoe UI',Arial,sans-serif;font-size:11pt;color:#1a1a2e;line-height:1.7;position:relative;">
    ${headerInfo}
    <div style="text-align:center;margin:24px 0 6px">
      <div style="font-size:15px;font-weight:700;text-decoration:underline;text-transform:uppercase;letter-spacing:.06em">ANNEXURE &lsquo;B&rsquo;</div>
      <div style="font-size:13px;text-decoration:underline;margin-top:6px">SALARY DISTRIBUTION</div>
    </div>
    <table style="width:100%;border-collapse:collapse;margin:20px 0;font-size:12px">
      <thead>
        <tr>
          <th style="background:${CO.themeColor};color:#fff;padding:4px 8px;font-size:10pt;letter-spacing:0.06em;text-transform:uppercase;font-family:'Calibri',Arial,sans-serif;text-align:left;border:1px solid #9fa8da">Particulars</th>
          <th style="background:${CO.themeColor};color:#fff;padding:4px 8px;font-size:10pt;letter-spacing:0.06em;text-transform:uppercase;font-family:'Calibri',Arial,sans-serif;text-align:right;border:1px solid #9fa8da">Monthly Salary</th>
          <th style="background:${CO.themeColor};color:#fff;padding:4px 8px;font-size:10pt;letter-spacing:0.06em;text-transform:uppercase;font-family:'Calibri',Arial,sans-serif;text-align:right;border:1px solid #9fa8da">Yearly Salary</th>
        </tr>
      </thead>
      <tbody>${rHTML}</tbody>
    </table>
    <div style="background:#e8eaf6;border:1px solid #c5cae9;border-radius:6px;padding:10px 16px;margin-top:24px;margin-bottom:20px">
      <div style="font-size:11px;font-weight:700;color:#37474f;text-transform:uppercase;letter-spacing:.08em;margin-bottom:3px">Annual CTC in Words</div>
      <div style="font-size:13px;font-weight:600;color:${CO.themeColor}">${toWords(ctcA)} Only</div>
    </div>
    ${footerHTML}
  </div>`

  return `<!DOCTYPE html><html><head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Offer Letter — ${form.fullName || 'Employee'} — ${CO.fullName}</title>
<link href="https://fonts.googleapis.com/css2?family=Calibri:wght@400;600;700&family=Times+New+Roman:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{
    font-family:'Calibri','Segoe UI',Arial,sans-serif;
    color:#1a1a2e;
    font-size:11pt;
    background:#f5f5f5;
    line-height:1.6;
  }
  @page{size:A4 portrait;margin:0}
  @media print{
    html,body{width:210mm;margin:0;background:white}
    .no-print{display:none!important}
    *{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}
    div[style*="page-break-before"]{page-break-before:always}
  }
  /* Each page div fixed to exact A4 size */
  body > div[style*="width:210mm"] {
    width:210mm !important;
    height:297mm !important;
    min-height:unset !important;
    overflow:hidden;
    page-break-after:always;
    margin:0 auto 8px auto;
    box-shadow:0 2px 8px rgba(0,0,0,0.15);
  }
  p{margin-bottom:10px;line-height:1.7;font-size:11pt;text-align:justify;}
  ol li{line-height:1.7;font-size:11pt;text-align:justify;}
  ol.tight-list li, ol.tight-list ol li{line-height:normal!important;font-size:10.5pt!important;margin-bottom:0!important;}
  strong{font-weight:700;}
  h1{font-family:'Calibri','Segoe UI',Arial,sans-serif;letter-spacing:0.02em;}
  table{font-family:'Calibri','Segoe UI',Arial,sans-serif;}
  td,th{font-size:10.5pt;}
</style>
</head><body>
${page1}${page2}${page3}${page4}${page3_acceptance}

<!-- Bottom bar (visible on screen only, hides on print) -->
<div class="no-print" style="position:fixed;bottom:0;left:0;right:0;background:linear-gradient(135deg,#1e293b,#0f172a);border-top:2px solid #3949ab;padding:16px 28px;display:flex;align-items:center;justify-content:space-between;z-index:9999;font-family:'Segoe UI',sans-serif;">
  <div>
    <div style="color:#fff;font-size:14px;font-weight:600;margin-bottom:3px">✅ Offer Letter Ready!</div>
    <div style="color:#64748b;font-size:12px">👇 <strong style="color:#7986cb">"Save as PDF"</strong> निवडा</div>
  </div>
  <div style="display:flex;gap:10px">
    <button onclick="window.print()" style="background:linear-gradient(135deg,#1a237e,#283593);color:#fff;border:none;padding:11px 28px;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer">⬇️ Save as PDF</button>
    <button onclick="window.close()" style="background:rgba(255,255,255,0.06);color:#64748b;border:1px solid rgba(255,255,255,0.1);padding:11px 16px;border-radius:10px;font-size:13px;cursor:pointer">✕</button>
  </div>
</div>
</body></html>`
}

// ─── Main Component ───────────────────────────────────────────────────────────
// Props:
//   form         — { fullName, designation, department, offerDate, joiningDate,
//                    appointDate, contractPeriod, location, annualGross, ... }
//   salaryRows   — array of { label, m, y, type }
//   calculations — { annual, monthly, ctcA, netM, esiApplicable, ... }
//   onClose      — () => void
export default function GeneratePDFPreviewOfferLetter_UAS({ form, salaryRows, calculations, onClose }) {
  const iframeRef = useRef(null)

  // Helper: convert an image src → base64 dataURL
  function toDataUrl(src) {
    return new Promise((resolve) => {
      const img = new Image()
      img.src = src
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width  = img.naturalWidth  || 794
        canvas.height = img.naturalHeight || 1123
        canvas.getContext('2d').drawImage(img, 0, 0)
        resolve(canvas.toDataURL('image/png'))
      }
      img.onerror = () => resolve('')
    })
  }

  // Convert background image → base64 dataURL → write HTML into iframe
  useEffect(() => {
    if (!iframeRef.current) return

    Promise.all([toDataUrl(bgImage), toDataUrl(stamp1Image), toDataUrl(stamp2Image)])
      .then(([bgDataUrl, stamp1Url, stamp2Url]) => {
        const html = buildOfferLetterHTML({ form, salaryRows, calculations, bgDataUrl, stamp1Url, stamp2Url })
        const iframe = iframeRef.current
        if (!iframe) return
        iframe.srcdoc = html
      })
  }, [form, salaryRows, calculations])

  // Open in new window for print (popup)
  const handlePrint = () => {
    Promise.all([toDataUrl(bgImage), toDataUrl(stamp1Image), toDataUrl(stamp2Image)])
      .then(([bgDataUrl, stamp1Url, stamp2Url]) => {
        const html = buildOfferLetterHTML({ form, salaryRows, calculations, bgDataUrl, stamp1Url, stamp2Url })
        const pw = window.open('', '_blank')
        if (!pw) return
        pw.document.write(html)
        pw.document.close()
      })
  }

  return (
    // ── Full screen overlay ──
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0f172a]">

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-5 py-3 bg-[#1e293b] border-b border-white/10 flex-shrink-0">

        {/* Left: Employee info */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-700 to-indigo-800 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {form.fullName?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div>
            <div className="text-white font-semibold text-sm">{form.fullName || 'Employee'}</div>
            <div className="text-gray-400 text-xs">
              {form.designation || '—'}
              {form.department ? ` · ${form.department}` : ''}
              <span className="ml-2 text-gray-600">· UAS IT Consultancy · 4 Pages</span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Save as PDF */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 text-white text-sm font-semibold hover:scale-105 active:scale-95 transition-all shadow-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            Save as PDF
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ── iframe — full screen PDF preview ── */}
      <iframe
        ref={iframeRef}
        title={`Offer Letter — ${form.fullName || 'Employee'}`}
        className="flex-1 w-full border-0 bg-[#f5f5f5]"
        sandbox="allow-same-origin allow-scripts allow-modals"
      />
    </div>
  )
}