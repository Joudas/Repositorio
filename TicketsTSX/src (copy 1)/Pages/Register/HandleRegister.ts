import React, { useContext } from 'react';
import RegisterContext from '../../Context/Register/RegisterContext';
import RegisterPage from './RegisterPage';
import PasswordPage from './PasswordPage';
import ConfirmPasswordPage from './ConfirmPasswordPage';

const HandleRegister = () => {
  const { state } = useContext(RegisterContext);

  return (
    <>
      {state === 1 && <RegisterPage />}
      {state === 2 && <PasswordPage />}
      {state === 3 && <ConfirmPasswordPage />}
    </>
  )
}

export default HandleRegister;