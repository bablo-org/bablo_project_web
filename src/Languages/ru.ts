import { TranslationKeys } from '../services/i18n';

const ru: TranslationKeys = {
  homePage: {
    welcome: 'дарова',
  },
  languageMenu: {
    languageSettings: 'Настройки языка',
  },
  accountMenu: {
    accountSettings: 'Настройки аккаунта',
    myProfile: 'Мой профиль',
    logout: 'Выйти',
    tryLater: 'Ошибка, попробуйте позже...',
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
      transactionCard: {
        approveButton: 'Подтвердить',
        declineButton: 'Отклонить',
        completeButton: 'Завершить',
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
