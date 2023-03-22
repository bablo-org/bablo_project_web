import { Fragment } from 'react';
import classes from '../components/Header/Header.module.css';
import DebtForm from '../components/DebtForm/DebtForm';


const AddTransactionPage = (props) => {
  return (
    <Fragment>
      <label className={classes.addDebtlabel}>Кто кому дает за щеку?</label>
        <DebtForm/>
    </Fragment>
  );
};

export default AddTransactionPage;
