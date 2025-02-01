import * as templateEN from './en';
import * as templateJP from './jp';

export const getTemplate = (language, templateName) => {
  switch (language) {
    case 'en':
      return templateEN[templateName];
    case 'jp':
      return templateJP[templateName];
    default:
      return templateEN[templateName];
  }
};
