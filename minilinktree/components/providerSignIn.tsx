import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useProviderSignIn } from "@/hooks/useProviderSignIn";
export default function ProviderSignIn({message}: {message:string}) {
    const {gitHubSignUp, googleSignUp} = useProviderSignIn();
  return (
    <>
        <div className="w-full gap-4 grid grid-cols-2">
            <button 
            onClick={googleSignUp}
            className="flex justify-center items-center gap-1 w-full cursor-pointer bg-white bg-charcola-hover ease transition-all duration-300 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
                <FcGoogle />
                Sing {message} with Google
            </button>
            <button 
            onClick={gitHubSignUp}
            className="flex justify-center items-center gap-1 w-full cursor-pointer bg-white bg-charcola-hover ease transition-all duration-300 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
                <FaGithub />
                Sing {message} with GitHub
            </button>
        </div>
    </>
  )
}
