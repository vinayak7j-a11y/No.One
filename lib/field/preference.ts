const KEY = "noone:field";
const EVENT = "noone:field-preference";

/** The visitor's choice to run the field at all. On unless they turned it off. */
export function getFieldEnabled(): boolean {
  try {
    return window.localStorage.getItem(KEY) !== "off";
  } catch {
    return true;
  }
}

export function setFieldEnabled(enabled: boolean) {
  try {
    window.localStorage.setItem(KEY, enabled ? "on" : "off");
  } catch {
    // Storage can be blocked (private windows). The change still applies
    // for this page view through the event below.
  }
  window.dispatchEvent(new Event(EVENT));
}

export function subscribeFieldPreference(listener: () => void) {
  window.addEventListener(EVENT, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}
