import FormData from "@/features/login/components/FormData"

type Props = {}

export default function LoginPage({ }: Props) {
    return (
        <div className='min-w-full min-h-screen flex items-center justify-center'>
            <div className='w-120 min-h-180 bg-white rounded-md p-8'>
                <FormData/>
            </div>

        </div>
    )
}