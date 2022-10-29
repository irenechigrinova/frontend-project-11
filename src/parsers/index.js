import xmlParser from './xmlParser';

export default (data, format) => {
  switch (format) {
    case 'xml':
      return xmlParser(data);
    default:
      return data;
  }
};
