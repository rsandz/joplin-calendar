import MsgType from "./messageTypes";

/**
 * Sent by plugin backend using postMessage.
 */
export interface PluginPostMessage {
  message: {
    type: MsgType;
  };
}
