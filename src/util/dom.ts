export function viewport() {
  var e = window,
    a = "inner";
  if (!("innerWidth" in window)) {
    a = "client";
    // @ts-ignore
    e = document.documentElement || document.body;
  }
  // @ts-ignore
  return { width: e[a + "Width"], height: e[a + "Height"] };
}
