export const validationProps = {
  sum: {
    testSum: (enteredSum) => /^(?:0|[1-9]\d*)(?:\.\d{1,2})?$/.test(enteredSum),
    testSumInput: (enteredSum) => /^\d+(\.\d{0,2})?$/.test(enteredSum),
    inputPropsPattern: '(?:0|[1-9]\\d*)(?:\\.\\d{1,2})?',
    title: 'Введите сумму',
    errorTitle:
      'Введеная сумма должна быть в формате xxx.xx и не начинаться с 0 если это не дробь вида 0.хх',
    errorRemainsTitle:
      'Введена сумма не может быть больше общей суммы транзакции',
    errorRemainsSumTitle:
      'Сумма всех полей не моджет быть больше общей суммы транзакции',
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
    errorTitle: 'Адрес электронной почты должен быть вида xxxxx@xxx.xx',
  },
  avatar: {
    title: 'Загрузите аватар',
    errorTypeTitle:
      "Расширение выбранного файла должно быть 'jpeg', 'bmp', 'png' или 'gif'",
    errorSizeTitle: 'Размер выбранного файла должен быть не более 1 Mbyte',
  },
  tgName: {
    title: 'Введите публичное имя telegram',
    errorTitle:
      'Введенное имя пользвателя не обнаружено в чат боте, проверьте введенное имя и убедитесь что написали нашему боту',
    inputPropsPattern: '^@?[a-zA-Z0-9_]{5,}$',
    errorPatternTitle:
      'Вы можете использовать символы a-z, 0-9 и подчёркивания. Минимальная длина - 5 символов',
    testTgName: (tgName) => {
      return !/^@?[a-zA-Z0-9_]{5,}$/.test(tgName);
    },
  },
};
