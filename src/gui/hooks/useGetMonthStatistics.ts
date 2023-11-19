import MonthStatistics from "@constants/MonthStatistics";
import NoteSearchTypes from "@constants/NoteSearchTypes";
import MsgType from "@constants/messageTypes";
import { useQuery } from "@tanstack/react-query";
import { Moment } from "moment";

function useGetMonthStatistics(
  month: Moment,
  noteSearchTypes: NoteSearchTypes[]
) {
  const { data, refetch } = useQuery<MonthStatistics>({
    queryKey: ["monthStatistics", month.format("MMYYYY")],
    queryFn: async () => {
      console.debug(`Fetching month statistics for ${month.toLocaleString()}`);
      return await webviewApi.postMessage({
        type: MsgType.GetMonthStatistics,
        date: month.toISOString(),
        noteSearchTypes: noteSearchTypes,
      });
    },
  });
  return { data, refetch };
}

export default useGetMonthStatistics;
