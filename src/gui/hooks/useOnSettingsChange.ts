import MsgType from "@constants/messageTypes";
import { useEffect, useState } from "react";
import useWebviewApiOnMessage from "./useWebViewApiOnMessage";

/**
 * Providers the settings value for the given settings key.
 *
 * @template SettingType The type of the settings value
 *
 * @param settingKey The settings key
 * @returns The settings value
 */
function useOnSettingsChange<SettingType>(
  settingKey: string,
  defaultValue: SettingType = null
): SettingType {
  const [settingValue, setSettingValue] = useState<SettingType>(defaultValue);

  // Trigger all settings callbacks once initialized
  // to prevent any race conditions.
  useEffect(() => {
    webviewApi.postMessage({
      type: MsgType.TriggerAllSettingsCallbacks,
    });
  }, []);

  useWebviewApiOnMessage((data) => {
    const message = data.message;

    if (!message.type) {
      return;
    }
    if (message.type !== MsgType.SettingChanged) {
      return;
    }

    const settingMessage = message as any;

    if (settingMessage.key !== settingKey) {
      return;
    }
    setSettingValue((message as any).value);
  });

  return settingValue;
}

export default useOnSettingsChange;
