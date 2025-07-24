async function generateAndSendPDF() {
    const email = document.getElementById('emailInput').value.trim();
    if (!email.includes('@')) {
        alert("Enter valid email");
        return;
    }

    const res = await fetch('http://localhost:9010/api/transactions');
    const transactions = await res.json();

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Transaction Report", 20, 20);
    doc.setFontSize(12);
    
    let y = 40;
    transactions.forEach(txn => {
        doc.text(`ID: ${txn.transactionId}, From: ${txn.accNo}, To: ${txn.destAccNo || 'N/A'}, Amount: ₹${txn.transAmount}, Date: ${txn.transDate}`, 10, y);

        y += 10;
        if (y > 280) {
            doc.addPage();
            y = 20;
        }
    });

    const pdfBlob = doc.output("blob");

    const formData = new FormData();
    formData.append('pdf', pdfBlob, 'TransactionReport.pdf');
    formData.append('email', email);

    fetch('http://localhost:3000/send-pdf', {
        method: 'POST',
        body: formData
    })
    .then(() => {
        document.getElementById('statusMessage').innerText = "PDF sent successfully to " + email;
    })
    .catch(err => {
        console.error(err);
        document.getElementById('statusMessage').innerText = "Failed to send PDF.";
    });
}
