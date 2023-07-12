const en = {
  homePage: {
    welcome: 'hello',
  },
  languageMenu: {
    languageSettings: 'Language settings',
  },
  accountMenu: {
    accountSettings: 'Account settings',
    myProfile: 'My profile',
    logout: 'Logout',
    tryLater: 'Error, try again later...',
  },
  authorizedLayout: {
    addTransactionsLabel: 'Create new transaction',
    transactionsLabels: {
      menuLabel: 'Transactions',
      actualLabel: 'Actual',
      declinedLabel: 'Declined',
      completedLabel: 'Completed',
    },
    summaryLabel: 'Summary',
    profileLabel: 'Profile',
    contactsLabel: 'Contacts',
  },
  transactionsPage: {
    noTransactionsFoundByFilter:
      'No transactions found, try to change filter settings',
    clearFilter: 'Clear filter settings',
    transactionLayout: {
      filterButton: 'Filter',
      sortButton: 'Sort',
      searchField: 'Search',
      transactionStatusLabels: {
        pending: 'Pending',
        approved: 'Approved',
      },
      transactionCard: {
        approveButton: 'Approve',
        declineButton: 'Decline',
        completeButton: 'Complete',
      },
    },
    filterCollapse: {
      contactsFilter: 'Contacts filter',
      contactsFilterHelper: 'Contacts',
      currencyFilter: 'Currency filter',
      statusFilter: {
        incoming: 'Incoming',
        outcoming: 'Outcoming',
        all: 'All',
      },
    },
    sortMenu: {
      date: ' By date',
      sum: 'By sum',
    },
    noTransactionsFound: 'No transactions found',
  },
  summaryPage: {
    pageHeader: 'Approved transactions',
    currencyConverter: {
      converterHeader: 'Currency converter',
      defaultValue: 'All currencies',
      helperText: 'Select currency ',
      loading: 'Loading...',
      notFound: 'Nothing found',
    },
    summaryTable: {
      countRow: 'Qty',
      userRow: 'User',
      valueGainRow: 'I get',
      valueLostRow: 'I owe',
      totalRow: 'Total',
      grandTotal: 'Grand total',
      transactionList: {
        date: 'Date',
        description: 'Description',
        amount: 'Amount',
      },
    },
    noApprovedTransactions: 'No approved transactions ',
  },
};

export default en;
