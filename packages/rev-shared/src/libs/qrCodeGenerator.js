import Jimp from 'jimp';
import QRCode from 'qrcode';
import dataUriToBuffer from 'data-uri-to-buffer';

const LOGO_RATIO = 6;
let cachedLogo;

// TODO: update logo url later
Jimp.read('/static/assets/img/icon-150.png', (err, img) => {
  if (err) {
    console.error(err);
  }
  cachedLogo = img;
});

const getResizedLogo = (width, height) => {
  let _width;
  let _height;

  if (height > width) {
    _width = Jimp.AUTO;
    _height = height;
  } else {
    _width = width;
    _height = Jimp.AUTO;
  }

  return cachedLogo.resize(_width, _height);
};

const createImageFromDataUri = dataUri => {
  return new Promise((resolve, reject) => {
    new Jimp(dataUriToBuffer(dataUri), (err, img) => {
      if (err) {
        reject(err);
      }
      resolve(img);
    });
  });
};

const createQRCode = async ({ text, width, height }) => {
  try {
    const opt = { errorCorrectionLevel: 'M', margin: 2, width, height };
    const qrcode = await QRCode.toDataURL(text, opt);

    return createImageFromDataUri(qrcode, width, height);
  } catch (e) {
    throw e;
  }
};

export const generateQrcode = async (
  text,
  { width = 200, height = 200 } = {}
) => {
  try {
    let qrImg;
    const img = await createQRCode({ text, width, height });

    if (img && cachedLogo) {
      const logo = await getResizedLogo(
        Math.floor(img.bitmap.width / LOGO_RATIO),
        Math.floor(img.bitmap.height / LOGO_RATIO)
      );

      // Center the logo
      const x = Math.floor((img.bitmap.width - logo.bitmap.width) / 2);
      const y = Math.floor((img.bitmap.height - logo.bitmap.height) / 2);

      // Apply on the QRCode
      qrImg = img.composite(logo, x, y);
    } else {
      qrImg = img;
    }

    return qrImg.getBase64Async(Jimp.MIME_PNG);
  } catch (error) {
    throw error;
  }
};
