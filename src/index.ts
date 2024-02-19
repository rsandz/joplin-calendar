import joplin from "api";
import handlePanelMessage from "./handlers/PanelMessageHandler";
import { notifyNoteChanged } from "./handlers/JoplinEventHandlers";
import { TOGGLE_CALENDAR_COMMAND, registerCommands } from "./commands";
import { ToolbarButtonLocation } from "api/types";
import {
  registerSettings,
  triggerAllSettingsCallbacks,
  onSettingChange,
  registerPanelAlertOnSettingChange,
} from "./settings";
import { SHOW_CALENDAR_BUTTON } from "@constants/Settings";

joplin.plugins.register({
  onStart: async function () {
    const panel = await joplin.views.panels.create("calendar_panel");
    await joplin.views.panels.onMessage(panel, handlePanelMessage);
    await joplin.views.panels.addScript(panel, "gui/index.js");
    await joplin.workspace.onNoteSelectionChange(() =>
      notifyNoteChanged(panel)
    );

    await registerCommands(panel);
    await registerSettings();

    await onSettingChange(SHOW_CALENDAR_BUTTON, async (value) => {
      if (value) {
        try {
          await joplin.views.toolbarButtons.create(
            "calendarToggleButton",
            TOGGLE_CALENDAR_COMMAND,
            ToolbarButtonLocation.NoteToolbar
          );
        } catch (e) {
          // Joplin doesn't allow checking if a button already exists.
          // This means button already exists and we don't need to do anything.
          return;
        }
      }
    });

    await registerPanelAlertOnSettingChange(panel);

    await triggerAllSettingsCallbacks();
  },
});
