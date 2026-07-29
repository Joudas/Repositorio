type Props = {
    e: React.ChangeEvent<HTMLInputElement>;
    colorOne: string;
    colorTwo: string;
    createThemeMutation: ;
}
export const handleImageUpload = ({e, colorOne, colorTwo, createThemeMutation}: Props) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
    const base64String = reader.result as string;
        createThemeMutation.mutate({
        name: "Custom Theme",
        mode: "IMAGE",
        color_one: colorOne,
        color_two: colorTwo,
        image: base64String
        });
    };
  reader.readAsDataURL(file);
};