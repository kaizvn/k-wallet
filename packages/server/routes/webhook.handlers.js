import {
  depositWalletNoPF,
  depositERC20,
  depositWalletPF
} from './depositHandlers';
import { withdrawalWallet, withdrawERC20 } from './withdrawHandler';

export const depositWalletPFHandler = depositWalletPF;

export const withdrawalWalletHandler = withdrawalWallet;

export const depositWalletNoPFHandler = depositWalletNoPF;

export const depositERC20Handler = depositERC20;

export const withdrawERC20Handler = withdrawERC20;
