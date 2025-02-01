import axios from 'axios';
import moment from 'moment';
import { DATE_FORMAT } from '../utils';

const DIRO_API_URL = process.env.DIRO_API_URL || 'https://api.dirolabs.com';
const DIRO_HASH_ALGORITHM = process.env.DIRO_HASH_ALGORITHM || 'base64';
const DIRO_API_KEY =
  process.env.DIRO_API_KEY || '81f19db74d3359f475e4057596c0fb4e';
const DIRO_TOKEN =
  process.env.DIRO_TOKEN ||
  'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJodW5nbmgxNzA0QGdtYWlsLmNvbSIsImFwaWtleSI6IjgxZjE5ZGI3NGQzMzU5ZjQ3NWU0MDU3NTk2YzBmYjRlIn0.2JRKNwUakPfdq0P4DXhu-tr9puiGd8hyu3ykD20Spx8_0qfr4sPeivapOhlsHb-aNm4oVtwgUZQ8OLy_BRvaow';

const createDiroUrl = url => DIRO_API_URL + url;

const formatDiroDob = dateString => {
  const date = new moment(dateString, DATE_FORMAT);
  if (!date.isValid()) {
    throw new Error('birthdate is not valid');
  }
  return date.format('YYYY-MM-DD');
};

export const createUserToDiro = async ({
  phone,
  first_name,
  last_name,
  birth_date,
  mcc_code
}) => {
  const mobile = phone;
  const firstname = first_name;
  const lastname = last_name;
  const dob = formatDiroDob(birth_date);
  const mcc = mcc_code;

  return axios.post(createDiroUrl('/user/create'), {
    firstname,
    lastname,
    dob,
    mobile,
    mcc,
    apikey: DIRO_API_KEY
  });
};

export const checkKYCInfo = ({ firstname, mobile, mcc }) =>
  axios.post(createDiroUrl('/user/getkycinfo'), {
    firstname,
    mobile,
    mcc,
    apikey: DIRO_API_KEY
  });

export const uploadDocumentToDiro = ({
  mcc,
  category, //idproof
  file,
  mimetype,
  extension, //jpeg, .pdf
  mobile,
  filename
}) =>
  axios.post(createDiroUrl('/document/upload'), {
    apikey: DIRO_API_KEY,
    token: DIRO_TOKEN,
    category,
    file, //base 64 file
    mobile,
    mcc,
    mimetype,
    extension,
    hashalgorithm: DIRO_HASH_ALGORITHM,
    filename
  });

export const downloadDocumentFromDiro = ({ mobile, mcc, docid }) =>
  axios.post(createDiroUrl('/document/download'), {
    apikey: DIRO_API_KEY,
    token: DIRO_TOKEN,
    mobile,
    mcc,
    docid
  });
