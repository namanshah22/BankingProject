async function generateAndSendPDF() {
    const email = document.getElementById('emailInput').value.trim();
    const accNo = document.getElementById('accountInput').value.trim();

    if (!email.includes('@') || !accNo) {
        alert("Please enter valid email and account number.");
        return;
    }

    const res = await fetch(`http://localhost:9010/api/transactions`);
    const transactions = await res.json();
    const filtered = transactions.filter(txn => txn.accNo == accNo);

    if (filtered.length === 0) {
        alert(`No transactions found for account: ${accNo}`);
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(`Transaction Report`, 14, 15);
    doc.setFontSize(12);
    doc.text(`Account Number: ${accNo}`, 14, 23);

    const tableData = filtered.map(txn => [
        txn.transactionId,
        txn.accNo,
        txn.destAccNo || 'SELF',
        `₹${txn.transAmount}`,
        txn.transDate,
        txn.transactionMode
    ]);

    doc.autoTable({
        startY: 30,
        head: [['Txn ID', 'From', 'To', 'Amount', 'Date', 'Mode']],
        body: tableData,
        styles: { fontSize: 10 },
        theme: 'grid'
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
        document.getElementById('statusMessage').innerText = "📤 PDF sent successfully to " + email;
    })
    .catch(err => {
        console.error(err);
        document.getElementById('statusMessage').innerText = "❌ Failed to send PDF.";
    });
}
