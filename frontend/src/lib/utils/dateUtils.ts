export const getMonthLabel = (dateInput: string | Date): string => {
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);

  const options: Intl.DateTimeFormatOptions = {
    month: 'short', // "Jan", "Fev", "Mar", etc.
  };

  const formatter = new Intl.DateTimeFormat('pt-BR', options);
  let label = formatter.format(date);
  label = label.replace('.', '');
  return label.charAt(0).toUpperCase() + label.slice(1);
};