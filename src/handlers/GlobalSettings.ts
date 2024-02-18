import joplin from "api";

const DATE_FORMAT_KEY = "dateFormat";

/**
 * Get's the user's date format.
 *
 * @see https://github.com/laurent22/joplin/blob/dev/packages/lib/models/Setting.ts#L799
 */
export async function getDateFormat() {
  return (await joplin.settings.globalValue(DATE_FORMAT_KEY)) as string;
}
