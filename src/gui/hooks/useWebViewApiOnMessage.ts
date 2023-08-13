import { PluginPostMessage } from "@constants/pluginMessageTypes";
import { useEffect } from "react";

const callbacks: Function[] = [];

function useWebviewApiOnMessage(cb: (message: PluginPostMessage) => void) {
  useEffect(() => {
    callbacks.push(cb);
    return () => {
      callbacks.splice(callbacks.indexOf(cb), 1);
    };
  }, [cb]);

  webviewApi.onMessage((message: PluginPostMessage) => {
    console.log(`Calling OnMessage for '${callbacks.length}' callbacks.`);
    callbacks.forEach((callback) => {
      callback(message);
    });
  });
}

export default useWebviewApiOnMessage;
