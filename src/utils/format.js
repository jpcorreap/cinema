// Define locale as English
const locale = 'en-US';

// Curency formatter
let colombianPesoFormatter = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
});

// Define options
const options = { 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric', 
  hour: '2-digit', 
  minute: '2-digit' 
};

export const formatCurrencyToColombianPeso = (price) => `${colombianPesoFormatter.format(price)}`;

export const formatDate = (date) => `${date.toLocaleString(locale, options)}`;
