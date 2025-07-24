const otpStore = {};

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function setOTP(email, otp) {
    otpStore[email] = otp;
    setTimeout(() => { delete otpStore[email]; }, 5 * 60 * 1000); // Expires in 5 mins
}

function verifyOTP(email, otp) {
    return otpStore[email] === otp;
}

module.exports = { generateOTP, setOTP, verifyOTP };
