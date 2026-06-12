import { QueryClient } from '@tanstack/react-query'

const queryClient = new QueryClient();

export function useQueryClient() {
    return queryClient;
}
