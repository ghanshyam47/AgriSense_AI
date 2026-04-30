import crypto from 'crypto';

/** Generate a hash from an object (for cache keys) */
export const hashObject = (obj) => {
  return crypto.createHash('md5').update(JSON.stringify(obj)).digest('hex').slice(0, 12);
};

/** Format price in INR */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
};
