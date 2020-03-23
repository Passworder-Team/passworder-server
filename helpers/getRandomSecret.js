module.exports = () => {
  let randomSecret = "";
  const word = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const len = word.length;
  for (let i = 0; i < 6; i++) {
    randomSecret += word[Math.round(Math.random() * len)];
  }
  return randomSecret
}