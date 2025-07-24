const nodemailer = require('nodemailer');

module.exports = async function sendEmailWithAttachment(to, subject, text, pdfBuffer) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // const mailOptions = {
    //     from: process.env.EMAIL_USER,
    //     to,
    //     subject,
    //     text,
    //     attachments: [{
    //         filename: 'TransactionReport.pdf',
    //         content: pdfBuffer
    //     }]
    // };

    // const mailOptions = {
    //     from: process.env.EMAIL_USER,
    //     to,
    //     subject,
    //     html: `
    //         <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
    //             <h2 style="color: #2e7d32;">Your Transaction Statement</h2>
    //             <p>Hello,</p>
    //             <p>Attached is your transaction report in PDF format.</p>
    //             <p style="margin-top: 20px;">Thanks,<br><strong>Your Djokovic Bank Team</strong></p>
    //         </div>
    //     `,
    //     attachments: [{
    //         filename: 'TransactionReport.pdf',
    //         content: pdfBuffer
    //     }]
    // };

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        html: `
        <div style="font-family: Arial, sans-serif; padding: 0; margin: 0; background-color: #f6f6f6;">
          <table align="center" width="600" style="border-collapse: collapse; background-color: #ffffff; margin-top: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); overflow: hidden;">
            <tr>
              <td style="background-color: #2e7d32; color: #ffffff; padding: 20px; text-align: center;">
                <h2 style="margin: 0;">Djokovic Bank</h2>
                <p style="margin: 5px 0;">Your Trusted Financial Partner</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 30px;">
                <h3 style="color: #2e7d32;">Dear Customer,</h3>
                <p>We are pleased to share your <strong>Transaction Statement</strong> for your account.</p>
                <p>Please find the attached PDF document containing your recent transactions.</p>
                <p>If you did not request this statement, please contact our support team immediately.</p>
                <p style="margin-top: 30px;">Regards,<br><strong>Djokovic Bank Team</strong></p>
              </td>
            </tr>
            <tr>
              <td style="background-color: #f0f0f0; padding: 20px; text-align: center; font-size: 12px; color: #555;">
                © ${new Date().getFullYear()} Djokovic Bank. All rights reserved.<br>
                This is an automated message. Please do not reply.
              </td>
            </tr>
          </table>
        </div>
        `,
        attachments: [{
            filename: 'TransactionReport.pdf',
            content: pdfBuffer
        }]
    };
        

    await transporter.sendMail(mailOptions);
};
