const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1Y3Ph69ETG1OVQ1cJwPveDTajcYxMsmpp0sDMye2WNPg/export?format=csv&gid=0';

function sanitizeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

async function generateCertificate() {
    const certId = document.getElementById('certId').value.trim();
    if (!certId) return alert('Please enter a Certificate ID');

    try {
        const response = await fetch(SHEET_URL);
        if (!response.ok) throw new Error('Failed to fetch data');
        const csvText = await response.text();
        
        Papa.parse(csvText, {
            header: true,
            complete: (results) => {
                const data = results.data.filter(row => Object.values(row).some(val => String(val || '').trim()));
                
                const certificatesDiv = document.getElementById('certificates');
                const actionsDiv = document.getElementById('actions');
                
                if (data.length === 0) {
                    certificatesDiv.textContent = 'No valid data found in the spreadsheet';
                    actionsDiv.style.display = 'none';
                    return;
                }
                
                const idColumn = Object.keys(data[0] || {}).find(col => col.toLowerCase().includes('id'));
                const record = data.find(row => row[idColumn] === certId);
                
                if (record) {
                    certificatesDiv.innerHTML = '';
                    certificatesDiv.appendChild(createCertificate(record, Object.keys(data[0] || {})));
                    actionsDiv.style.display = 'block';
                } else {
                    certificatesDiv.textContent = `Certificate not found for ID: ${certId}`;
                    actionsDiv.style.display = 'none';
                }
            }
        });
    } catch (error) {
        alert('Error loading data: ' + error.message);
    }
}

function createCertificate(data, columns) {
    const nameCol = columns.find(col => col.toLowerCase().includes('name')) || columns[0];
    const courseCol = columns.find(col => col.toLowerCase().includes('course')) || columns[1];
    const idCol = columns.find(col => col.toLowerCase().includes('id')) || columns[2];
    const dateCol = columns.find(col => col.toLowerCase().includes('date'));
    
    const getName = () => sanitizeHTML(data[nameCol] || 'Participant');
    const getCourse = () => sanitizeHTML(data[courseCol] || 'Course');
    const getId = () => sanitizeHTML(data[idCol] || 'N/A');
    const getDate = () => sanitizeHTML(data[dateCol] || new Date().toLocaleDateString());
    
    const cert = document.createElement('div');
    cert.className = 'certificate';
    cert.id = 'certificate-to-print';
    
    cert.innerHTML = `
        <!-- Corners & accents -->
        <div class="corner-tr"></div>
        <div class="corner-bl"></div>
        <div class="accent-left"></div>
        <div class="accent-right"></div>

        <!-- Dot grids -->
        <div class="dots dots-tl" id="dots-tl"></div>
        <div class="dots dots-br" id="dots-br"></div>

       <!-- Logo -->
<div class="logo-area">
    <img src="logo1.jpeg" alt="Code Sikha Logo" style="height: 60px; width: auto; object-fit: contain;">
    <div class="logo-text"></div>
</div>


        <!-- Title -->
        <div class="title-main">Certificate</div>
        <div class="title-sub">of Completion</div>

        <div class="certify-text">This is to certify that</div>

        <!-- Name -->
        <div class="name-wrap">
            <div class="recipient-name">${getName()}</div>
            <div class="name-line"></div>
        </div>

        <!-- Completion text -->
        <div class="completion-text">
            has successfully completed the <strong>${getCourse()}</strong><br/>
            course from <strong>Code Sikha Institute</strong>.
        </div>

        <div class="signature-block">
    <div class="sig-hand">R Gour</div>
    <div class="sig-line"></div>
    <div class="sig-name">Rajesh Gour</div>
    <div class="sig-title">Director</div>
</div>


        <!-- Certificate ID -->
        <div class="cert-id">
            <strong>Certificate ID –</strong><br/>
            <em>${getId()}</em>
        </div>
    `;

    // Add dots after DOM insertion
    setTimeout(() => {
        fillDots('dots-tl', 5, 6);
        fillDots('dots-br', 5, 6);
    }, 0);
    
    return cert;
}

function fillDots(id, rows, cols) {
    const el = document.getElementById(id);
    if (el) {
        el.innerHTML = '';
        for (let i = 0; i < rows * cols; i++) {
            const dot = document.createElement('div');
            dot.className = 'dot';
            el.appendChild(dot);
        }
    }
}

function printCertificate() {
    const certificate = document.getElementById('certificate-to-print');
    if (!certificate) return alert('No certificate to print');
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) return alert('Please allow popups and try again');
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Certificate</title>
            <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Cinzel:wght@400;700&family=Raleway:wght@300;400;600;700;800&display=swap" rel="stylesheet">
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { 
                    min-height: 100vh; display: flex; align-items: center; justify-content: center;
                    background: #dde1e8; font-family: 'Raleway', sans-serif; padding: 40px 20px;
                }
                .certificate {
                    position: relative; width: 960px; height: 670px; background: #f3f5f7;
                    box-shadow: 0 8px 40px rgba(0,0,0,0.18); overflow: hidden;
                    display: flex; flex-direction: column; align-items: center; justify-content: center;
                    padding: 40px 60px 36px;
                }
                .certificate::before {
                    content: ''; position: absolute; inset: 0;
                    background-image: linear-gradient(rgba(170,205,235,0.22) 1px, transparent 1px), linear-gradient(90deg, rgba(170,205,235,0.22) 1px, transparent 1px);
                    background-size: 36px 36px; pointer-events: none; z-index: 0;
                }
                .certificate > * { position: relative; z-index: 1; }
                .corner-tr { position: absolute; top: 0; right: 0; width: 0; height: 0; border-top: 140px solid #1a4fd4; border-left: 170px solid transparent; z-index: 0; }
                .corner-bl { position: absolute; bottom: 0; left: 0; width: 0; height: 0; border-bottom: 140px solid #1a4fd4; border-right: 170px solid transparent; z-index: 0; }
                .accent-left { position: absolute; top: 55px; left: 0; width: 26px; height: 175px; z-index: 0; background: #1a4fd4; clip-path: polygon(35% 0%, 100% 5%, 100% 95%, 35% 100%); }
                .accent-right { position: absolute; bottom: 55px; right: 0; width: 26px; height: 175px; z-index: 0; background: #1a4fd4; clip-path: polygon(0% 5%, 65% 0%, 65% 100%, 0% 95%); }
                .dots { position: absolute; display: grid; gap: 8px; z-index: 0; }
                .dots .dot { width: 5px; height: 5px; border-radius: 50%; background: #a8c4db; }
                .dots-tl { top: 22px; left: 22px; grid-template-columns: repeat(6, 5px); }
                .dots-br { bottom: 22px; right: 22px; grid-template-columns: repeat(6, 5px); }
                .logo-area { display: flex; align-items: center; justify-content: center; gap: 11px; margin-bottom: 16px; }
                .logo-text { font-family: 'Raleway', sans-serif; font-size: 23px; font-weight: 800; color: #1a1a2e; }
                .title-main { font-family: 'Cinzel', serif; font-size: 64px; font-weight: 700; color: #1a4fd4; text-transform: uppercase; letter-spacing: 5px; line-height: 1; text-align: center; margin-bottom: 4px; }
                .title-sub { font-family: 'Raleway', sans-serif; font-size: 19px; font-weight: 300; color: #2c3e50; letter-spacing: 9px; text-transform: uppercase; text-align: center; margin-bottom: 22px; }
                .certify-text { font-size: 16px; font-weight: 600; color: #2c3e50; text-align: center; margin-bottom: 8px; }
                .name-wrap { text-align: center; margin-bottom: 6px; }
.recipient-name { font-family: 'Cinzel', serif; font-size: 48px; color: #1a1a2e; line-height: 1.1; }
                .name-line { width: 350px; height: 1.5px; background: #2c3e50; margin: 2px auto 0; }
                .completion-text { font-size: 15.5px; color: #2c3e50; text-align: center; margin-top: 16px; margin-bottom: 26px; }
                .completion-text strong { font-weight: 700; }
                .signature-block { text-align: center; }
                .sig-line { width: 170px; height: 1.5px; background: #2c3e50; margin: 0 auto 5px; }
                .sig-name { font-size: 15px; font-weight: 700; color: #1a1a2e; }
                .sig-title { font-size: 13px; color: #5a6a7a; margin-top: 2px; }
              .cert-id { position: absolute; bottom: 16px; left: 34px; z-index: 1; font-size: 11px; color: #1a1a2e; line-height: 1.5; }
.cert-id strong { font-weight: 700; color: #1a1a2e; }

            </style>
        </head>
        <body>${certificate.outerHTML}</body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

function downloadCertificate() {
    const certificate = document.getElementById('certificate-to-print');
    if (!certificate) return alert('No certificate to download');
    
    html2canvas(certificate, {
        scale: 3,
        backgroundColor: '#f3f5f7',
        width: 960,
        height: 670,
        useCORS: true,
        allowTaint: true,
        logging: false
    }).then(canvas => {
        const link = document.createElement('a');
        const name = certificate.querySelector('.recipient-name').textContent.trim();
        link.download = `Certificate_${name.replace(/\s+/g, '_')}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
    }).catch(error => {
        alert('Failed to generate certificate image: ' + error.message);
    });
}
