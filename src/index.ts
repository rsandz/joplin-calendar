import joplin from "api";
import handlePanelMessage from "./handlers/PanelMessageHandler";
import { notifyNoteChanged } from "./handlers/JoplinEventHandlers";

joplin.plugins.register({
  onStart: async function () {
    const panel = await joplin.views.panels.create("calendar_panel");
    await joplin.views.panels.onMessage(panel, handlePanelMessage);
    await joplin.views.panels.addScript(panel, "gui/index.js");
    await joplin.workspace.onNoteSelectionChange(() =>
      notifyNoteChanged(panel)
    );
  },
});
