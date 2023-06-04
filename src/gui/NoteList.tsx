import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import React from "react";
import MsgType from "@constants/messageTypes";

export interface NoteListProps {
  currentDate: moment.Moment;
}

function NoteList(props: NoteListProps) {
  const currentDate = props.currentDate.clone();

  const { isLoading, data } = useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      console.debug(`Requesting notes for ${currentDate.toLocaleString()}`);
      return await webviewApi.postMessage({
        type: MsgType.GetNotes,
        currentDate: currentDate.toISOString(),
      });
    },
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  console.log(data);
  return (
    <>
      <h1>{currentDate.format("MM D, YYYY")}</h1>
      {...data.map((note) => {
        return <p>{note.title}</p>;
      })}
    </>
  );
}

export default NoteList;
