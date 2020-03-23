module.exports = () => {
  let otp = "";
  const number = "0123456789";
  const len = number.length-1;
  for (let i = 0; i < 6; i++) {
    otp += number[Math.round(Math.random() * len)];
  }
  return otp
}
