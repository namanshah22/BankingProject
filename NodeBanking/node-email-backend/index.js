require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const upload = multer();
const path = require('path');
const sendEmailWithAttachment = require('./mailer');

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/send-pdf', upload.single('pdf'), async (req, res) => {
    try {
        const email = req.body.email;
        const pdfBuffer = req.file.buffer;
        await sendEmailWithAttachment(email, 'Your Account Statement', 'Attached is your PDF statement.', pdfBuffer);
        res.send('PDF sent successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to send PDF');
    }
});

app.listen(process.env.PORT, () => {
    console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
});
