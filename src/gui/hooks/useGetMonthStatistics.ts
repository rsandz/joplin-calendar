import MonthStatistics from "@constants/MonthStatistics";
import NoteSearchTypes from "@constants/NoteSearchTypes";
import MsgType from "@constants/messageTypes";
import { useQuery } from "@tanstack/react-query";
import { Moment } from "moment";
import useSelectedNote from "./useSelectedNote";
import { useEffect, useState } from "react";

function useGetMonthStatistics(
  month: Moment,
  noteSearchTypes: NoteSearchTypes[]
) {
  const { data, refetch } = useQuery<MonthStatistics>({
    queryKey: ["monthStatistics", month.format("MMYYYY")],
    queryFn: async () => {
      return await webviewApi.postMessage({
        type: MsgType.GetMonthStatistics,
        date: month.toISOString(),
        noteSearchTypes: noteSearchTypes,
      });
    },
  });

  const { selectedNote } = useSelectedNote();
  const [currentParentId, setCurrentParentId] = useState("");

  useEffect(() => {
    // If selected notebook changes, fetch statistics again.
    if (selectedNote && selectedNote.parent_id != currentParentId) {
      setCurrentParentId(selectedNote.parent_id);
      refetch();
    }
  });

  return { data, refetch };
}

export default useGetMonthStatistics;
