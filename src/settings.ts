import joplin from "api";
import { SettingItemType } from "api/types";

const SETTINGS_SECTION_ID = "joplinCalendarSection";

const SHOW_CALENDAR_BUTTON = "showCalendarToggleOnToolbar";

const showCalendarButtonObservers: Array<(value: boolean) => void> = [];

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
  });

  await joplin.settings.onChange(async ({ keys }) => {
    if (keys.includes(SHOW_CALENDAR_BUTTON)) {
      showCalendarButtonObservers.forEach(async (callback) => {
        callback(await joplin.settings.value(SHOW_CALENDAR_BUTTON));
      });
    }
  });
}

export async function triggerAllSettingsCallbacks() {
  showCalendarButtonObservers.forEach(async (callback) => {
    callback(await joplin.settings.value(SHOW_CALENDAR_BUTTON));
  });
}

export async function onShowCalendarButtonChange(
  callback: (value: boolean) => void
) {
  showCalendarButtonObservers.push(callback);
}
