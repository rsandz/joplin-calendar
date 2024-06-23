import Note from "@constants/Note";
import MsgType from "@constants/messageTypes";
import { useQuery } from "@tanstack/react-query";
import useWebviewApiOnMessage from "./useWebViewApiOnMessage";
import { boolean } from "yargs";

function useSelectedNote() {
  const { data, refetch } = useQuery<Note>({
    queryKey: ["selectedNote"],
    queryFn: async () => {
      return await webviewApi.postMessage({
        type: MsgType.GetSelectedNote,
      });
    },
  });

  useWebviewApiOnMessage((data) => {
    const message = data.message;
    if (message.type === MsgType.NoteChanged) {
      refetch();
    }
  });

  return { selectedNote: data, refetch };
}

export default useSelectedNote;
