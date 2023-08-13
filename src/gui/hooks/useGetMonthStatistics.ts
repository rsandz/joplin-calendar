import MonthStatistics from "@constants/MonthStatistics";
import MsgType from "@constants/messageTypes";
import { useQuery } from "@tanstack/react-query";
import { Moment } from "moment";

function useGetMonthStatistics(month: Moment) {
  const { data, refetch } = useQuery<MonthStatistics>({
    queryKey: ["monthStatistics", month.format("MMYYYY")],
    queryFn: async () => {
      console.debug(`Fetching month statistics for ${month.toLocaleString()}`);
      return await webviewApi.postMessage({
        type: MsgType.GetMonthStatistics,
        date: month.toISOString(),
      });
    },
  });
  return { data, refetch };
}

export default useGetMonthStatistics;
