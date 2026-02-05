const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1Y3Ph69ETG1OVQ1cJwPveDTajcYxMsmpp0sDMye2WNPg/export?format=csv&gid=0';

async function generateCertificate() {
    const certId = document.getElementById('certId').value.trim();
    
    if (!certId) {
        alert('Please enter Certificate ID');
        return;
    }
    
    try {
        const response = await fetch(SHEET_URL);
        const csvText = await response.text();
        
        const lines = csvText.split('\n');
        const headers = lines[0].split(',');
        
        let found = false;
        for (let i = 1; i < lines.length; i++) {
            const row = lines[i].split(',');
            if (row[0] === certId) {
                const name = row[1] || 'Participant';
                const course = row[2] || 'Course';
                const subject = row[3] || 'Subject';
                
                document.getElementById('certificate-container').innerHTML = `
                    <div class="certificate">
                        <div class="overlay-name">${name}</div>
                        <div class="overlay-id">Certificate ID:</div>
                        <div class="overlay-id-value">${certId}</div>
                        <div class="overlay-course-name">${subject}</div>
                    </div>
                    <div style="text-align: center; margin-top: 20px;">
                        <button onclick="downloadCertificate()" style="background: linear-gradient(135deg, #10b981, #047857); color: white; border: none; padding: 15px 25px; border-radius: 15px; font-size: 16px; cursor: pointer; margin: 10px;">Download Certificate</button>
                    </div>
                `;
                found = true;
                break;
            }
        }
        
        if (!found) {
            alert('Certificate ID not found');
        }
    } catch (error) {
        alert('Error loading data');
    }
}

function downloadCertificate() {
    const certificate = document.querySelector('.certificate');
    if (!certificate) return;
    
    html2canvas(certificate, {
        scale: 2,
        useCORS: true,
        allowTaint: true
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'certificate.png';
        link.href = canvas.toDataURL();
        link.click();
    });
}
