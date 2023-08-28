import joplin from "api";

export const TOGGLE_CALENDAR_COMMAND = "toggleCalendar";

export async function registerCommands(panelHandle: string) {
  await joplin.commands.register({
    name: TOGGLE_CALENDAR_COMMAND,
    label: "Toggle Calendar",
    iconName: "far fa-calendar",
    execute: async () => {
      if (await joplin.views.panels.visible(panelHandle)) {
        await joplin.views.panels.hide(panelHandle);
      } else {
        await joplin.views.panels.show(panelHandle);
      }
    },
  });

  joplin.views.menus.create("calendar-menu", "Calendar", [
    {
      label: "Toggle Calendar",
      commandName: TOGGLE_CALENDAR_COMMAND,
      accelerator: "CmdOrCtrl+Shift+`",
    },
  ]);
}
