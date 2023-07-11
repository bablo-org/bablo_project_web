import { TranslationKeys } from '../services/i18n';

const ru: TranslationKeys = {
  homePage: {
    welcome: 'дарова',
  },
  authorizedLayout: {
    addTransactionsLabel: 'Добавить транзакцию',
    transactionsLabels: {
      menuLabel: 'Транзакции',
      actualLabel: 'Актуальные',
      declinedLabel: 'Отклоненные',
      completedLabel: 'Завершенные',
    },
    summaryLabel: 'Итоги',
    profileLabel: 'Профиль',
    contactsLabel: 'Контакты',
    logOutLabel: 'Выйти',
  },
  transactionsPage: {
    noTransactionsFoundByFilter:
      'Транзакций не найдено, попробуйте изменить настройки фильтрации',
    clearFilter: 'Сбросить фильтр',
    transactionLayout: {
      filterButton: 'Фильтр',
      sortButton: 'Сортировать',
      searchField: 'Поиск',
      transactionStatusLabels: {
        pending: 'Ожидающие',
        approved: 'Подтвержденные',
      },
    },
    filterCollapse: {
      contactsFilter: 'Фильтр контактов',
      contactsFilterHelper: 'Контакты',
      currencyFilter: 'Фильтр валют',
      statusFilter: {
        incoming: 'Входящие',
        outcoming: 'Исходящие',
        all: 'Все',
      },
    },
    sortMenu: {
      date: 'Дата',
      sum: 'Сумма',
    },
    noTransactionsFound: 'Транзакции не найдены',
  },
};

export default ru;
