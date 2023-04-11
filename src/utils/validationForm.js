export const validationProps = {
  sum: {
    testSum: (enteredSum) => !/^(?:0|[1-9]\d*)(?:\.\d{1,2})?$/.test(enteredSum),
    inputPropsPattern: '(?:0|[1-9]\\d*)(?:\\.\\d{1,2})?',
    title: 'Введите сумму',
    errorTitle:
      'Введеная сумма должна быть в формате xxx.xx и не начинаться с 0 если это не дробь вида 0.хх',
  },
  description: {
    title: 'Введите описание',
  },
  date: {
    title: 'Выберите дату',
  },
  email: {
    testEmail: (email) => {
      return !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
    },
    inputPropsPattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$',
    title: 'Введите Ваш e-mail',
    errorTitle: 'Адрес электронной почты должен содержать символ "@"',
  },
};
