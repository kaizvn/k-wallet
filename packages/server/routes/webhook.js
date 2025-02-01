import { Router } from 'express';

import {
  TX_CONFIRMATION,
  TX_FORWARDS,
  TX_NO_FORWARDS
} from '../types/blockcypherEvents';
import {
  TYPE_TX_DEPOSIT,
  TYPE_TX_WITHDRAW
} from '../graphql/enums/transactionType';
import {
  depositERC20Handler,
  depositWalletNoPFHandler,
  depositWalletPFHandler,
  withdrawERC20Handler,
  withdrawalWalletHandler
} from './webhook.handlers';

const router = Router();

router.post(
  '/revhooks/erc20/:coinId/:type/:trackingId/:event',
  async (req, res, next) => {
    console.log('params:', req.params);
    const { type } = req.params;

    try {
      switch (+type) {
        case TYPE_TX_DEPOSIT: {
          return depositERC20Handler(req, res);
        }
        case TYPE_TX_WITHDRAW: {
          return withdrawERC20Handler(req, res);
        }
        default: {
          res.json({ message: 'not supported' });
        }
      }
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/revhooks/:coinId/:type/:trackingId/:event',
  async (req, res, next) => {
    const type = +req.params.type;
    const event = req.params.event;

    try {
      switch (type) {
        case TYPE_TX_DEPOSIT: {
          if (event === TX_FORWARDS) {
            return depositWalletPFHandler(req, res);
          } else if (event === TX_CONFIRMATION) {
            return;
          } else if (event === TX_NO_FORWARDS) {
            return depositWalletNoPFHandler(req, res);
          }
          break;
        }
        case TYPE_TX_WITHDRAW: {
          return withdrawalWalletHandler(req, res);
        }
        default: {
          res.json({ message: 'not supported' });
        }
      }
    } catch (error) {
      next(error);
    }
  }
);

export default router;
