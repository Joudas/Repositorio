export type Todo = {
    id: string, 
    title: string, 
    description: string,
    energy: "BAJA" | "MEDIA" | "ALTA",
    comments: string,
    position: number,
    check: boolean,
    endDate: string,
}