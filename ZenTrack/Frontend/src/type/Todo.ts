export type Todo = {
    id: string, 
    title: string, 
    description: string | null,
    energy: "BAJA" | "MEDIA" | "ALTA",
    comments: [] | null, 
    position: number,
    check: boolean,
    endDate: string | null,
    cardId: string,
}