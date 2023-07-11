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
  summaryPage: {
    pageHeader: 'Подтвержденные транзакции',
    currencyConverter: {
      converterHeader: 'Конвертер валют',
      defaultValue: 'Все валюты',
      helperText: 'Выберите валюту ',
    },
    summaryTable: {
      countRow: 'Кол-во',
      userRow: 'Пользователь',
      valueGainRow: 'Я получу',
      valueLostRow: 'Я должен',
      totalRow: 'Итоги',
      grandTotal: 'Итоговая сумма',
      transactionList: {
        date: 'Дата',
        description: 'Описание',
        amount: 'Сумма',
      },
    },
    noApprovedTransactions: 'Нет подтвержденных транзакций',
  },
};

export default ru;
