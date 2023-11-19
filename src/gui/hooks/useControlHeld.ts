import { useState, useEffect } from "react";

/**
 * Returns a boolean indicating whether the control key is currently being held down.
 */
function useControlHeld() {
  const [controlHeld, setControlHeld] = useState(false);

  useEffect(() => {
    const keyDownEventListener = (event: KeyboardEvent) => {
      if (event.ctrlKey && !event.repeat) {
        setControlHeld(true);
      }
    };
    window.addEventListener("keydown", keyDownEventListener);
    return () => window.removeEventListener("keydown", keyDownEventListener);
  });

  useEffect(() => {
    const keyUpEventListener = (event: KeyboardEvent) => {
      if (!event.ctrlKey && !event.repeat) {
        setControlHeld(false);
      }
    };
    window.addEventListener("keyup", keyUpEventListener);
    return () => window.removeEventListener("keyup", keyUpEventListener);
  });

  return controlHeld;
}

export default useControlHeld;
