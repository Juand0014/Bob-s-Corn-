type Messages = typeof import('./src/locales/en/common.json') &
  typeof import('./src/locales/en/purchase.json');

declare interface IntlMessages extends Messages {}
