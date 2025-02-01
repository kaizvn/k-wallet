import Bills from '../models/bill';
import { BILL_EXPIRED } from '../graphql/enums/billStatus';

const BILL_DEPOSIT_LIFESPAN = +process.env.BILL_DEPOSIT_LIFESPAN || 86400000;

export const handleDepositExpires = bill => {
  const lifespan = new Date() - bill.created_at;
  if (lifespan >= BILL_DEPOSIT_LIFESPAN) {
    bill.status = BILL_EXPIRED;
    return bill.save();
  }
};

export default Bills;
