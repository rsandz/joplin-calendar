import joplin from "api";

export function registerCommands(panelHandle: string) {
  joplin.commands.register({
    name: "toggleCalendar",
    label: "Toggle Calendar",
    iconName: "fas fa-calendar",
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
      commandName: "toggleCalendar",
      accelerator: "CmdOrCtrl+Shift+`",
    },
  ]);
}
