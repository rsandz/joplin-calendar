/**
 * Note object returned by plugin.
 */
interface Note {
  id: string;
  parent_id: string;
  title: string;
  createdTime: string;
  updatedTime: string;
}

export default Note;
