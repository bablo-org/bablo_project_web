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
  },
  avatar: {
    title: 'Загрузите аватар',
    errorTypeTitle:
      "Расширение выбранного файла должно быть 'jpeg', 'bmp', 'png' или 'gif'",
    errorSizeTitle: 'Размер выбранного файла должен быть не более 1 Mbyte',
  },
  tgName: {
    title: 'Введите публичное имя telegram без @',
    errorTitle:
      'Введенное имя пользвателя не обнаружено в чат боте, проверьте введенное имя и убедитесь что написали нашему боту',
  },
};
