import '../LoginForm/LoginForm.css';

const InputForm = () => {
  return (
    <form
      onSubmit={() => {
        alert(`биба и боба`);
      }}
    >
      <div className="form-control">
        <label>Почта</label>
        <input type="email" id="email"></input>
        <label>Пароль</label>
        <input type="password" id="password"></input>
      </div>
      <div className="form-actions">
        <button>Войти</button>
      </div>
    </form>
  );
};

export default InputForm;
