import joplin from "api";
import { SettingItemType } from "api/types";
import MsgType from "@constants/messageTypes";
import {
  SHOW_CALENDAR_BUTTON,
  SHOW_MODIFIED_NOTES,
  SHOW_RELATED_NOTES,
  WEEK_START_DAY,
  WeekStartDay,
} from "@constants/Settings";
import { getDateFormat } from "./handlers/GlobalSettings";

const SETTINGS_SECTION_ID = "joplinCalendarSection";

const settingObservers: Record<string, Array<(value: any) => void>> = {};

export async function registerSettings() {
  await joplin.settings.registerSection(SETTINGS_SECTION_ID, {
    label: "Joplin Calendar",
    iconName: "far fa-calendar",
  });

  await joplin.settings.registerSettings({
    [SHOW_CALENDAR_BUTTON]: {
      label: "Show Calendar Toggle Button",
      description:
        "Show a button on the top-right of the note editor for toggling the calendar. Restart required on change.",
      public: true,
      type: SettingItemType.Bool,
      value: true,
      section: SETTINGS_SECTION_ID,
    },
    [SHOW_MODIFIED_NOTES]: {
      label: "Show Modified Notes in Note List",
      description:
        "Show notes in the note list if their last modified day was on the same day",
      public: true,
      type: SettingItemType.Bool,
      value: true,
      section: SETTINGS_SECTION_ID,
    },
    [SHOW_RELATED_NOTES]: {
      label: "Show Related Notes in Note List",
      description: `Show notes that have the date in the title. The Joplin date
      format is used for this. Currently, it is set to: ${await getDateFormat()}. Note,
      this feature is experimental and may impact performance with large
      notebooks.`,
      public: true,
      type: SettingItemType.Bool,
      value: false,
      section: SETTINGS_SECTION_ID,
    },
    [WEEK_START_DAY]: {
      label: "Week Start Day",
      description: "Which day the week starts on",
      public: true,
      isEnum: true,
      type: SettingItemType.String,
      options: WeekStartDay,
      value: WeekStartDay.Sunday,
      section: SETTINGS_SECTION_ID,
    },
  });

  await joplin.settings.onChange(async ({ keys }) => {
    keys.forEach((key) => {
      settingObservers[key]?.forEach(async (callback) => {
        callback(await joplin.settings.value(key));
      });
    });
  });
}

/**
 * Alerts panel when certain settings change.
 */
export async function registerPanelAlertOnSettingChange(panelHandle: string) {
  await onSettingChangeAlertPanel(panelHandle, SHOW_MODIFIED_NOTES);
  await onSettingChangeAlertPanel(panelHandle, SHOW_RELATED_NOTES);
  await onSettingChangeAlertPanel(panelHandle, WEEK_START_DAY);
}

export async function triggerAllSettingsCallbacks() {
  Object.entries(settingObservers).forEach(async ([key, callbacks]) => {
    callbacks.forEach(async (callback) => {
      callback(await joplin.settings.value(key));
    });
  });
}

export async function onSettingChange(
  key: string,
  callback: (value: any) => void
) {
  settingObservers[key] = settingObservers[key] || [];
  settingObservers[key].push(callback);
}

/**
 * Post a SettingsChanged message to webview whenever settings change.
 *
 * @param handle The handle of the webview
 * @param key The key of the setting that changed
 *
 * @see {MsgType.SettingsChanged} For post message type.
 */
export async function onSettingChangeAlertPanel(handle: string, key: string) {
  await onSettingChange(key, (value) => {
    joplin.views.panels.postMessage(handle, {
      type: MsgType.SettingChanged,
      key,
      value,
    });
  });
}
