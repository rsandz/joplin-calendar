import joplin from "api";
import { SettingItemType } from "api/types";

const SETTINGS_SECTION_ID = "joplinCalendarSection";

export const SHOW_CALENDAR_BUTTON = "showCalendarToggleOnToolbar";
export const SHOW_MODIFIED_NOTES = "showModifiedNotes";

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
  });

  await joplin.settings.onChange(async ({ keys }) => {
    keys.forEach((key) => {
      settingObservers[key]?.forEach(async (callback) => {
        callback(await joplin.settings.value(key));
      });
    });
  });
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
