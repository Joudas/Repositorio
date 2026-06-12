import PasswordPage from './PasswordPage';
import ConfirmPasswordPage from './ConfirmPasswordPage';
import RegisterScreen from './RegisterScreen';
import { useRegister } from '../context/RegisterContext';

const RegisterFlow = () => {
  const { state } = useRegister();

  return (
    <>
      {state === 1 && <RegisterScreen />}
      {state === 2 && <PasswordPage />}
      {state === 3 && <ConfirmPasswordPage />}
    </>
  );
};

export default RegisterFlow;