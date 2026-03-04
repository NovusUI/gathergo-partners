export const isValidEmail = (value) => {
  const email = String(value || '').trim();
  if (!email) return false;
  // Practical email validation for client-side checks.
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
};
