import { useState } from 'react';
import { useRegister } from '../context/RegisterContext';

const ConfirmPasswordPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmMessage, setConfirmMessage] = useState('');
  const { handleState, validatePassword, submitRegister, isPending } = useRegister();

  const onSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!confirmPassword.trim()) {
      setConfirmMessage('Campo vacío o inválido');
      return;
    }

    if(!validatePassword(confirmPassword, setConfirmMessage)) return;
    setConfirmMessage('');
    submitRegister();

  }

  const backPage = () => {
    handleState(2);
  }

  const handleConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
  };


  return (
    <div className="relative grid min-h-screen grid-cols-1">
      <div onClick={() => backPage()} className="absolute top-4 left-4 cursor-pointer btn-back rounded-full p-1">
        <svg width="32px" height="32px" fill="currentColor" viewBox="-7 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>left</title> <path d="M7.094 15.938l7.688 7.688-3.719 3.563-11.063-11.063 11.313-11.344 3.531 3.5z"></path> </g></svg>
      </div>
      <div className="min-h-screen w-full flex justify-center items-center">
        <div>
          <svg fill="#000000" viewBox="-8.5 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>left</title> <path d="M7.094 15.938l7.688 7.688-3.719 3.563-11.063-11.063 11.313-11.344 3.531 3.5z"></path> </g></svg>
        </div>
        <div className="w-[30%] flex flex-col justify-center">
          <div className="px-4">
            <p className="font-bold text-2xl">Confirmar Contraseña</p>
            <p className="text-sm text-gray-400">Ingresa Nuevamente tu Contraseña</p>
          </div>
          <div>
            <form className="grid gap-18 mt-16 text-base" onSubmit={onSubmit}>
              <div className="grid grid-cols-1 gap-2">
                <div className="relative">
                  <input
                    value={confirmPassword}
                    onChange={handleConfirmPassword}
                    type={showPassword ? 'text' : 'password'}
                    className="border-b text-sm border-gray-300 py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-100 focus:rounded-sm"
                    placeholder="*****"
                  />
                  <span className="text-sm text-red-500">{confirmMessage != '' ? confirmMessage : ''}</span>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isPending}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:cursor-not-allowed disabled:text-gray-300"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-4.753 4.753m7.228-10.862A10.025 10.025 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.064 10.064 0 01-5.891 5.891M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>

              </div>
              <div className="grid grid-cols-1 gap-4">
                <button type="submit" disabled={isPending} className="w-full h-10 btn-base cursor-pointer disabled:cursor-not-allowed disabled:opacity-70">
                  {isPending ? 'Registrando...' : 'Continuar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="h-full w-full"></div>
    </div>
  );
};

export default ConfirmPasswordPage;
