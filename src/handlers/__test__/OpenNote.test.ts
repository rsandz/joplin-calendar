import joplin from "api";
import handlePanelMessage from "../PanelMessageHandler";
import MsgType from "@constants/messageTypes";

jest.mock(
  "api",
  () => ({
    commands: {
      execute: jest.fn(),
    },
  }),
  { virtual: true }
);
const mockedJoplin = jest.mocked(joplin);

describe("OpenNote", () => {
  it("calls the open note command using the passed in id", async () => {
    await handlePanelMessage({
      type: MsgType.OpenNote,
      id: "testid",
    });

    expect(joplin.commands.execute).toHaveBeenCalledWith("openNote", "testid");
  });

  it("handles when no ID is provided", async () => {
    await handlePanelMessage({
      type: MsgType.OpenNote,
    });
  });
});
