function censorEmail(email) {
  const firstThreeLetters = email.slice(0, 3);
  const finalEmail = firstThreeLetters + "*".repeat(email.length - 3);

  return finalEmail;
}

module.exports = censorEmail;
