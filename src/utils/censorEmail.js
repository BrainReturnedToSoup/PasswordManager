function censorEmail(email) {
  const firstTwoLetters = email.slice(0, 1);
  const finalEmail = firstTwoLetters + "*".repeat(email.length - 2);

  return finalEmail;
}

module.exports = censorEmail;
