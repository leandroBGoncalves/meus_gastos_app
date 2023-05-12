
const convertMoneyTextMask = (value) => {
    if (value) {
      const stringOnlyNumbers = `${Number(value).toFixed(2)}`.replace(/\D/g, '');
      if (!stringOnlyNumbers) {
        return 'R$ 0,00';
      }
  
      const { length } = stringOnlyNumbers;
  
      if (length === 1) {
        return value >= 0
          ? `R$ 0,0${stringOnlyNumbers}`
          : `R$ -0,0${stringOnlyNumbers}`;
      }
      if (length === 2) {
        return value >= 0
          ? `R$ 0,${stringOnlyNumbers}`
          : `R$ -0,${stringOnlyNumbers}`;
      }
      let moneyMask = '';
  
      for (let i = length - 1; i >= 0; i -= 1) {
        if (i === length - 2) {
          moneyMask = `,${stringOnlyNumbers[i]}${moneyMask}`;
        } else if (i < length - 5 && (i - length - 3) % 3 === 0) {
          moneyMask = `${stringOnlyNumbers[i]}.${moneyMask}`;
        } else {
          moneyMask = `${stringOnlyNumbers[i]}${moneyMask}`;
        }
      }
  
      return value >= 0 ? `R$ ${moneyMask}` : `R$ -${moneyMask}`;
    }
    return 'R$ 0,00';
  };

  export default {
    convertMoneyTextMask
  };