declare namespace webviewApi {
  function postMessage(msg: any): Promise<any>;
  function onMessage(msg: any): void;
}
