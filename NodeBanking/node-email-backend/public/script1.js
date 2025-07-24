async function generateAndSendPDF() {
    const email = document.getElementById('emailInput').value.trim();
    const accNo = document.getElementById('accountInput').value.trim();
    if (!email.includes('@')) {
        alert("Enter valid email");
        return;
    }

    const res = await fetch(`http://localhost:9010/api/transactions/account/${accNo}`);


    //const res = await fetch('http://localhost:9010/api/transactions');
    const transactions = await res.json();

    const filtered = transactions.filter(txn => txn.accNo == accNo);

    if (filtered.length === 0) {
        alert(`No transactions found for account: ${accNo}`);
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Transaction Report for Account ${accNo}`, 20, 20);
    doc.setFontSize(12);
    
    // let y = 40;
    // filtered.forEach(txn => {
    //     doc.text(`ID: ${txn.transactionId}, From: ${txn.accNo}, To: ${txn.destAccNo || 'N/A'}, Amount: ₹${txn.transAmount}, Date: ${txn.transDate}, Mode: ${txn.transactionMode}`, 10, y);
    //     y += 10;
    //     if (y > 280) {
    //         doc.addPage();
    //         y = 20;
    //     }
    // });

    const tableData = filtered.map(txn => [
        txn.transactionId,
        txn.accNo,
        txn.destAccNo || 'SELF',
        `₹${txn.transAmount}`,
        txn.transDate,
        txn.transactionMode
    ]);
    
    doc.autoTable({
        head: [['Transaction ID', 'From', 'To', 'Amount', 'Date', 'Mode']],
        body: tableData,
        startY: 30,
        theme: 'striped',
        headStyles: { fillColor: [46, 125, 50], textColor: 255 },
        alternateRowStyles: { fillColor: [240, 240, 240] },
        styles: { fontSize: 10, cellPadding: 3 }
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
