import { getTicketProject } from "@/services/ticketsService"
import { useQuery } from "@tanstack/react-query"

export default function useProject({projectID}: {projectID: string | undefined} ){

    const {data: project, isPending, isError, error} = useQuery({
        queryKey: ['projectID'],
        queryFn: () => getTicketProject(projectID)
    })

  return {project, isPending, isError, error}
}
