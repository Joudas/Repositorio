interface Props extends React.FormHTMLAttributes<HTMLFormElement> {
  title?: string;
  subtitle?: string;
}

export function Form({ title = "Login Template", subtitle = "Enter your acount to sing in", children, ...props }: Props) {
  return (
    <div className="w-full text-brand-muted flex justify-center items-center flex-col p-12 h-full">
      <div className="mb-4">
        <p className="text-3xl font-semibold text-brand-dark text-center">{title}</p>
        <p className="text-sm text-center">{subtitle}</p>
      </div>
      <form className="grid gap-4 w-full" {...props}>
        {children}
      </form>
    </div>
  );
}

export function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="w-full flex flex-col">
      <label className="font-semibold pl-2 self-start">{label}</label>
      {children}
    </div>
  );
}

export function FormRow({ children }: { children: React.ReactNode }) {
  return <div className="flex gap-2 w-full">{children}</div>;
}
