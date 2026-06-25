'use client'
import Image from "next/image";
import Link from "next/link";
import {
    Field,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import ProviderSignIn from "@/components/providerSignIn";
import { registerUser } from "../actions/registerUser";

export default function FormData() {
    const {SignUp} = registerUser();

  return (
    <>
        <div className="flex flex-col items-center">
            <Image src="/mini_tree.webp" alt="Logo" width={300} height={300} />
            <h2 className="text-2xl font-bold -mt-4">
                Mini LinkTree
            </h2>
        </div>
        <form action={SignUp} className="my-6 space-y-2">
            <FieldGroup className="space-y-2">
                <Field>
                    <FieldLabel htmlFor="fieldgroup-name">Name</FieldLabel>
                    <Input id="fieldgroup-name" type="text" name="name" placeholder="name"/>
                </Field>
                <Field>
                    <FieldLabel htmlFor="fieldgroup-email">Email</FieldLabel>
                    <Input
                        id="fieldgroup-email"
                        type="email"
                        placeholder="name@example.com"
                        name="email"
                    />
                </Field>
                <Field>
                    <FieldLabel htmlFor="fieldgroup-password">Password</FieldLabel>
                    <Input id="fieldgroup-password" type="password" name="password" placeholder="••••••" />
                </Field>
                <Field orientation="horizontal">
                </Field>
            </FieldGroup>
            <div>
                <button className="w-full mb-2 cursor-pointer bg-charcola font-semibold py-2 px-4 border border-gray-400 rounded shadow ease transition-all duration-300">
                    Sign Up
                </button>
                <span className="cursor-pointer  hover:text-blue-500">
                    <Link href="/login">
                        Do you already have an account?
                    </Link>
                </span>
            </div>
        </form>
        <ProviderSignIn message="Up"/>
    </>
  )
}
