import joplin from "api";
import handlePanelMessage from "./handlers/PanelMessageHandler";
import { notifyNoteChanged } from "./handlers/JoplinEventHandlers";
import { TOGGLE_CALENDAR_COMMAND, registerCommands } from "./commands";
import { ToolbarButtonLocation } from "api/types";
import {
  onShowCalendarButtonChange,
  registerSettings,
  triggerAllSettingsCallbacks,
} from "./settings";

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

    onShowCalendarButtonChange(async (value) => {
      if (value) {
        await joplin.views.toolbarButtons.create(
          "calendarToggleButton",
          TOGGLE_CALENDAR_COMMAND,
          ToolbarButtonLocation.NoteToolbar
        );
      }
    });

    await triggerAllSettingsCallbacks();
  },
});
