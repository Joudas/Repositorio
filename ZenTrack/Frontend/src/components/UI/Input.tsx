interface Props extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = (props: Props) => {
  return (
    <input
      className="h-12 border border-brand-muted rounded-sm p-3 focus:outline-none focus:ring-0 focus:border-brand-dark focus:text-brand-dark"
      {...props}
    />
  );
};
