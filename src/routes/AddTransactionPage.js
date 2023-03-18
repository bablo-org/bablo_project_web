import { Fragment } from 'react';
import AvatarsList from '../components/AvatarsList/AvatarsList';
import classes from '../components/Header/Header.module.css';

const AddTransactionPage = (props) => {
  return (
    <Fragment>
      <label className={classes.addDebtlabel}>Кто кому дает за щеку?</label>
      <div>
        <AvatarsList/>
        <AvatarsList/>
      </div>
    </Fragment>
  );
};

export default AddTransactionPage;
