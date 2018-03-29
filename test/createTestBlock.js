export default name => ({
  name,
  state: {
    success: false,
    list: [
      { value: 'someValue' },
      { value: 'someOtherValue' },
    ],
    staticValue: 'static',
    text: 'test',
  },
  actions: {
    testAction: success => success,
    action2: success => !success,
  },
  reducers: {
    testAction: (draft, payload) => {
      draft.success = payload;
    },
    action2: (draft, payload) => {
      draft.success = payload;
      draft.list.push({ value: 'someNewValue' });
      draft.list[0].value = 'someChangedValue';
    },
  },
  selectors: {
    text: state => state.text,
  },
});
