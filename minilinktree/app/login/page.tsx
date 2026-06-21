import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

type Props = {}

export default function LoginPage({ }: Props) {
    return (
        <div className='min-w-full min-h-full flex flex-1 items-center'>
            <div className='w-120 h-200 bg-white rounded-md mx-auto p-4'>
                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="fieldgroup-name">Name</FieldLabel>
                        <Input id="fieldgroup-name" placeholder="Jordan Lee" />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="fieldgroup-email">Email</FieldLabel>
                        <Input
                            id="fieldgroup-email"
                            type="email"
                            placeholder="name@example.com"
                        />
                        <FieldDescription>
                            We&apos;ll send updates to this address.
                        </FieldDescription>
                    </Field>
                    <Field orientation="horizontal">
                    </Field>
                </FieldGroup>
            </div>

        </div>
    )
}