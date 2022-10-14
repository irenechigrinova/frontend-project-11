export default {
  string: {
    url: () => ({ key: 'badUrl' }),
  },
  mixed: {
    required: () => ({ key: 'required' }),
    notOneOf: () => ({ key: 'exists' }),
  },
};
