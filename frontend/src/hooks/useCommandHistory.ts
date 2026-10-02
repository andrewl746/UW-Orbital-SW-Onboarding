import { useQuery } from "@tanstack/react-query";
import type { UseQueryResult } from "@tanstack/react-query";
import type { CommandHistory } from "../utils/types";

const REFETCH_INTERVAL_MS = 5000;

export function useCommandHistory(
  commandId: string,
): UseQueryResult<CommandHistory[]> {
  return useQuery({
    queryKey: ["commandHistory", commandId],
    queryFn: async () => {
      const res = await fetch(
        `http://localhost:8001/api/commands/${commandId}/history`,
      );

      if (!res.ok) {
        throw new Error(`Failed to fetch history (${res.status})`);
      }

      const body = await res.json();

      return body.data;
    },
    enabled: commandId !== "",
    refetchInterval: REFETCH_INTERVAL_MS,
  });
}
