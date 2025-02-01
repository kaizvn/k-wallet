import templateBillEN from './bill-en';
import templateBillJP from './bill-jp';

export const getBillTemplate = (language, billData) => {
  switch (language) {
    case 'en':
      return templateBillEN(billData);
    case 'jp':
      return templateBillJP(billData);
    default:
      return templateBillEN(billData);
  }
};
