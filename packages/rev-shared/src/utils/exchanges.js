const ROUNDED = 6;

const getRound = (round = ROUNDED) => Math.pow(10, round);

export const convertCurrencyByIORate = ({
  inputCurrencyAmount,
  rate,
  percentage,
  rounded
}) => {
  percentage = percentage / 100;
  if (percentage) {
    rate = rate * (1 - percentage);
  }

  return (
    Math.round((inputCurrencyAmount / rate) * getRound(rounded)) /
    getRound(rounded)
  );
};

export const convertCurrencyByOIRate = ({
  inputCurrencyAmount,
  rate,
  percentage
}) => {
  let roundedIORate = convertCurrencyByIORate({
    inputCurrencyAmount: 1,
    rate,
    rounded: 6
  });

  return convertCurrencyByIORate({
    inputCurrencyAmount,
    rate: roundedIORate,
    percentage
  });
};

export const addBonusPercentage = ({ value, percentage = 0 }) => {
  const makeupPercentage = 1 + percentage || 1;
  return Math.floor(value * makeupPercentage * getRound()) / getRound();
};

export const reduceBonusPercentage = ({ value, percentage = 0 }) => {
  percentage = percentage / 100;

  const makeupPercentage = percentage ? 1 - percentage : 1;
  return Math.floor(value * makeupPercentage * getRound()) / getRound();
};

export const calculateCurrencyByPercentage = ({
  inputCurrencyAmount,
  percentage
}) => {
  percentage = percentage / 100;

  return Math.floor(inputCurrencyAmount * percentage * getRound()) / getRound();
};

export const roundFloat = (value, roundNumber = ROUNDED) => {
  return Math.floor(value * getRound(roundNumber)) / getRound(roundNumber);
};

export const convertUSDToCurrency = ({
  amountUSD,
  currentPriceNetwork,
  marginPercentage = 0,
  rounded = 8
}) => {
  const makeupAmountByMargin =
    (currentPriceNetwork * (marginPercentage / 100)) / currentPriceNetwork;
  const amountCurrency = amountUSD / currentPriceNetwork;
  const finalAmount = makeupAmountByMargin + amountCurrency;
  return Math.floor(finalAmount * getRound(rounded)) / getRound(rounded) || 0;
};
