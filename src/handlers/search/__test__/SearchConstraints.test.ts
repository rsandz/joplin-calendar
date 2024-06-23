import { buildSearchConstraints } from "../SearchConstraints";
import joplin from "api";

jest.mock(
  "api",
  () => ({
    workspace: {
      selectedFolder: jest.fn(),
    },
    settings: {
      value: jest.fn(),
    },
  }),
  { virtual: true }
);

const mockedJoplin = jest.mocked(joplin);

describe("SearchConstraints", () => {
  const testTitle = "testTitle";
  const testFolder = {
    title: testTitle,
  };

  it("builds search constraints with no notebook filter", async () => {
    mockedJoplin.settings.value.mockResolvedValueOnce(false);
    expect(await buildSearchConstraints()).toStrictEqual({
      notebook: null,
    });
  });

  it("builds search constraints with notebook filter", async () => {
    mockedJoplin.settings.value.mockResolvedValueOnce(true);
    mockedJoplin.workspace.selectedFolder.mockResolvedValueOnce(testFolder);
    expect(await buildSearchConstraints()).toStrictEqual({
      notebook: testTitle,
    });
  });
});
