// eslint-disable-next-line import/prefer-default-export
export const toInputField = (str) => str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
