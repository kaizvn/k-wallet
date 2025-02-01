import { find, flatten, flow, get, map } from 'lodash/fp';
import secp256k1 from 'secp256k1';

export const getSenderAddresses = flow(
  get('inputs'),
  map('addresses'),
  flatten
);

export const getReceivedAddresses = flow(
  get('outputs'),
  map('addresses'),
  flatten
);

export const formatEtherAddress = (address) => {
  if (!address) {
    return '';
  }

  const has0xPrefix = address.substr(0, 2) === '0x';
  return has0xPrefix ? address : '0x' + address;
};

export const formatBCEtherAddress = (address) => {
  if (!address) {
    return '';
  }

  const has0xPrefix = address.substr(0, 2) === '0x';
  return has0xPrefix ? address.substr(2) : address;
};

export const getDepositDataOfAddress = (address) => {
  return flow(
    get('outputs'),
    find((output) => output && output.addresses.includes(address))
  );
};

export const signTx = (TxSkeleton, privKey) => {
  const signedTxSkeleton = {
    signatures: [],
    pubkeys: [],
    ...TxSkeleton
  };

  signedTxSkeleton.tosign.forEach((tosign) => {
    const toSignHex = Buffer.from(tosign, 'hex');
    const privKeyHex = Buffer.from(privKey, 'hex');

    const signature = secp256k1
      .signatureExport(secp256k1.sign(toSignHex, privKeyHex).signature)
      .toString('hex');

    const pubkey = secp256k1.publicKeyCreate(privKeyHex).toString('hex');

    signedTxSkeleton.signatures.push(signature);
    signedTxSkeleton.pubkeys.push(pubkey);
  });

  return signedTxSkeleton;
};

export const getNetworkFee = get('tx.fees');
