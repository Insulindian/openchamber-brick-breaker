(() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  // node_modules/@openchamber/sdk/dist/api-version.js
  var OPENCHAMBER_SDK_CHANNEL = "openchamber.sdk";
  var OPENCHAMBER_SDK_API_VERSION = 1;

  // node_modules/@openchamber/sdk/dist/scrollbar-style.js
  var GUEST_SCROLLING_ATTRIBUTE = "data-oc-scrolling";
  var GUEST_SCROLLBAR_CSS = `
:root {
  /* Quiet at rest like the app's own thumbs; hover gives a clear grab target. */
  --oc-scrollbar-thumb: color-mix(in srgb, var(--oc-muted, currentColor) 18%, transparent);
  --oc-scrollbar-thumb-hover: color-mix(in srgb, var(--oc-muted, currentColor) 36%, transparent);
  scrollbar-gutter: stable;
}
* {
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
}
:hover, [${GUEST_SCROLLING_ATTRIBUTE}] {
  scrollbar-color: var(--oc-scrollbar-thumb) transparent;
}
/* Chromium's standard scrollbar properties otherwise override its pseudo-elements. */
@supports selector(::-webkit-scrollbar) {
  *, :hover, [${GUEST_SCROLLING_ATTRIBUTE}] { scrollbar-width: auto; scrollbar-color: auto; }
  ::-webkit-scrollbar { width: 6px; height: 6px; background: transparent; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb {
    background: transparent;
    border-radius: 999px;
    min-width: 24px;
    min-height: 24px;
  }
  :hover::-webkit-scrollbar-thumb, [${GUEST_SCROLLING_ATTRIBUTE}]::-webkit-scrollbar-thumb { background: var(--oc-scrollbar-thumb); }
  ::-webkit-scrollbar-thumb:hover { background: var(--oc-scrollbar-thumb-hover); }
  ::-webkit-scrollbar-corner { background: transparent; }
  ::-webkit-scrollbar-button { display: none; width: 0; height: 0; }
}
@media (forced-colors: active) {
  *, :hover, [${GUEST_SCROLLING_ATTRIBUTE}] { scrollbar-color: auto; }
  ::-webkit-scrollbar-thumb, ::-webkit-scrollbar-thumb:hover { background: CanvasText; }
}
`;
  function installGuestScrollbarActivity(doc) {
    const root = doc.documentElement;
    if (root.hasAttribute("data-oc-scrollbar-activity"))
      return;
    root.setAttribute("data-oc-scrollbar-activity", "");
    const timers = /* @__PURE__ */ new WeakMap();
    doc.addEventListener("scroll", (event) => {
      const target = event.target === doc ? root : event.target;
      if (!(target instanceof Element))
        return;
      if (!target.hasAttribute("data-oc-scrolling"))
        target.setAttribute("data-oc-scrolling", "");
      const pending = timers.get(target);
      if (pending !== void 0)
        clearTimeout(pending);
      timers.set(target, setTimeout(() => {
        timers.delete(target);
        target.removeAttribute("data-oc-scrolling");
      }, 1e3));
    }, { capture: true, passive: true });
  }
  var GUEST_SCROLLBAR_SCRIPT = `(${installGuestScrollbarActivity.toString()})(document);`;

  // node_modules/@openchamber/sdk/dist/workspace.js
  var GUEST_STORAGE_KEY_MAX = 128;
  var GUEST_STORAGE_VALUE_BYTES = 65536;

  // node_modules/@openchamber/sdk/dist/shells.js
  var GUEST_SHELL_ID_MAX = 128;
  var GUEST_SHELL_OUTPUT_TAIL_MAX = 65536;

  // node_modules/@openchamber/sdk/dist/status-controls.js
  var GUEST_STATUS_CONTROLS_MAX = 4;
  var GUEST_STATUS_CONTROL_ID = /^[a-z][a-z0-9-]{0,39}$/;
  var GUEST_STATUS_CONTROL_LABEL_MAX = 60;
  var GUEST_STATUS_CONTROL_OPTIONS_MAX = 16;
  var GUEST_STATUS_CONTROL_VALUE_MAX = 80;
  var isControlObject = (value) => Object(value) === value && !Array.isArray(value);
  var hasOnlyKeys = (value, keys) => Object.keys(value).every((key) => keys.includes(key));
  var isLabel = (value) => String(value) === value && value.length >= 1 && value.length <= GUEST_STATUS_CONTROL_LABEL_MAX;
  var isValue = (value) => String(value) === value && value.length >= 1 && value.length <= GUEST_STATUS_CONTROL_VALUE_MAX;
  var isGuestStatusControls = (controls) => {
    if (!Array.isArray(controls) || controls.length > GUEST_STATUS_CONTROLS_MAX)
      return false;
    const ids = /* @__PURE__ */ new Set();
    for (const control of controls) {
      if (!isControlObject(control) || !GUEST_STATUS_CONTROL_ID.test(control.id) || !isLabel(control.label))
        return false;
      if (control.disabled !== void 0 && control.disabled !== true && control.disabled !== false)
        return false;
      if (ids.has(control.id))
        return false;
      ids.add(control.id);
      if (control.kind === "button") {
        if (!hasOnlyKeys(control, ["kind", "id", "label", "disabled"]))
          return false;
        continue;
      }
      if (control.kind !== "select" || !hasOnlyKeys(control, ["kind", "id", "label", "value", "options", "disabled"]))
        return false;
      if (!isValue(control.value) || !Array.isArray(control.options) || control.options.length < 1 || control.options.length > GUEST_STATUS_CONTROL_OPTIONS_MAX)
        return false;
      const values = /* @__PURE__ */ new Set();
      for (const option of control.options) {
        if (!isControlObject(option) || !hasOnlyKeys(option, ["value", "label"]) || !isValue(option.value) || !isLabel(option.label) || values.has(option.value))
          return false;
        values.add(option.value);
      }
      if (!values.has(control.value))
        return false;
    }
    return true;
  };

  // node_modules/@openchamber/sdk/dist/manifest.js
  var TRACKER_URL_TOKENS = ["{id}", "{segment}", "{segments+}"];
  var TRACKER_URL_TOKEN_SET = new Set(TRACKER_URL_TOKENS);

  // node_modules/@openchamber/sdk/dist/session-events.js
  var GUEST_SESSION_EVENT_TYPES = [
    "turn-finished",
    "turn-failed",
    "permission-asked",
    "question-asked",
    "turn-started",
    "session-created",
    "session-archived",
    "session-deleted"
  ];
  var SESSION_EVENTS_IDLE_MS = 10 * 6e4;
  var EVENT_TYPES = new Set(GUEST_SESSION_EVENT_TYPES);

  // node_modules/@openchamber/sdk/dist/service-host.js
  var SERVICE_SCHEDULE_IDLE_MS = 10 * 6e4;
  var MENTIONS_IDLE_MS = 10 * 6e4;

  // node_modules/@openchamber/sdk/dist/file-editor.js
  var GUEST_FILE_EDITOR_CONTENT_MAX = 2e7;
  var GUEST_FILE_EDITOR_VERSION_MAX = 256;
  var fileEditorPayloadSize = (value) => "bytes" in value ? value.bytes.byteLength : value.content.length;
  var sameFileEditorDocument = (left, right) => {
    if (left.path !== right.path || left.readOnly !== right.readOnly)
      return false;
    if (left.encoding === "text" || right.encoding === "text") {
      return left.encoding === "text" && right.encoding === "text" && left.content === right.content;
    }
    if (left.bytes.byteLength !== right.bytes.byteLength)
      return false;
    for (let index = 0; index < left.bytes.byteLength; index += 1) {
      if (left.bytes[index] !== right.bytes[index])
        return false;
    }
    return true;
  };

  // node_modules/@openchamber/sdk/dist/popover.js
  var GUEST_POPOVER_ID = /^[A-Za-z0-9_-]{1,80}$/;
  var GUEST_POPOVER_COORDINATE_MAX = 1e5;
  var GUEST_POPOVER_WIDTH_MIN = 160;
  var GUEST_POPOVER_WIDTH_MAX = 640;
  var GUEST_POPOVER_HEIGHT_MIN = 48;
  var GUEST_POPOVER_HEIGHT_MAX = 480;
  var GUEST_POPOVER_DATA_MAX = 16e3;
  var GUEST_POPOVER_DATA_DEPTH_MAX = 32;
  var GUEST_POPOVER_SIDES = ["left", "right", "top", "bottom"];
  var hasBoundedJsonTree = (value, depth = 0, budget = { remaining: GUEST_POPOVER_DATA_MAX }) => {
    if (--budget.remaining < 0 || depth >= GUEST_POPOVER_DATA_DEPTH_MAX)
      return false;
    if (value === null)
      return true;
    const children = Array.isArray(value) ? value : Object(value) === value ? Object.values(value) : [];
    for (const item of children) {
      if (!hasBoundedJsonTree(item, depth + 1, budget))
        return false;
    }
    return true;
  };
  var isFiniteJson = (value) => {
    if (value === null || value === true || value === false)
      return true;
    if (Array.isArray(value))
      return Object.keys(value).every((key) => /^(0|[1-9]\d*)$/.test(key) && Number(key) < value.length) && value.every(isFiniteJson);
    if (Object(value) === value) {
      const prototype = Object.getPrototypeOf(value);
      return (prototype === null || prototype === Object.prototype) && Object.values(value).every(isFiniteJson);
    }
    return String(value) === value || Number.isFinite(value);
  };
  var isGuestPopoverRequest = (request) => {
    try {
      if (String(request.id) !== request.id || !GUEST_POPOVER_ID.test(request.id) || !Number.isFinite(request.anchor.x) || Math.abs(request.anchor.x) > GUEST_POPOVER_COORDINATE_MAX || !Number.isFinite(request.anchor.y) || Math.abs(request.anchor.y) > GUEST_POPOVER_COORDINATE_MAX || !Number.isFinite(request.anchor.width) || !Number.isFinite(request.anchor.height) || request.anchor.width <= 0 || request.anchor.height <= 0 || request.anchor.width > GUEST_POPOVER_COORDINATE_MAX || request.anchor.height > GUEST_POPOVER_COORDINATE_MAX || !Number.isInteger(request.width) || request.width < GUEST_POPOVER_WIDTH_MIN || request.width > GUEST_POPOVER_WIDTH_MAX || !Number.isInteger(request.height) || request.height < GUEST_POPOVER_HEIGHT_MIN || request.height > GUEST_POPOVER_HEIGHT_MAX || request.side !== void 0 && !GUEST_POPOVER_SIDES.includes(request.side) || request.focus !== void 0 && request.focus !== true && request.focus !== false || !hasBoundedJsonTree(request.data) || !isFiniteJson(request.data))
        return false;
      return JSON.stringify(request.data).length <= GUEST_POPOVER_DATA_MAX;
    } catch {
      return false;
    }
  };

  // node_modules/@openchamber/sdk/dist/contract.js
  var GUEST_BLOCK_ANSWER_MAX = 2e3;
  var GUEST_FILE_STAT_KINDS = ["file", "directory", "other", "missing"];
  var isStartSessionResult = (value) => Boolean(value && "sessionId" in value);
  var isPromptResult = (value) => Boolean(value && "sent" in value && !("sessionId" in value));
  var GUEST_COMMIT_SHA = /^[0-9a-f]{7,64}$/i;
  var isGuestCommitSha = (value) => GUEST_COMMIT_SHA.test(value);
  var GUEST_TOAST_MAX = 500;
  var GUEST_CLIPBOARD_TEXT_MAX = 32e3;
  var GUEST_COMPOSE_TEXT_MAX = 16e3;
  var GUEST_ATTACH_ID_MAX = 128;
  var GUEST_ATTACH_TITLE_MAX = 200;
  var GUEST_ATTACH_URL_MAX = 2e3;
  var GUEST_ATTACH_TEXT_MAX = 16e3;
  var GUEST_ATTACH_AUTHOR_MAX = 80;
  var GUEST_ATTACH_BRANCH_MAX = 200;
  var GUEST_ATTACH_DATA_MAX = 16e3;
  var GUEST_REQUEST_PATH_MAX = 2e3;
  var GUEST_REQUEST_TIMEOUT_MS = 2e4;
  var GUEST_FILE_PATH_MAX = 1024;
  var GUEST_FILE_CONTENT_MAX = 2e6;
  var GUEST_GENERATE_PROMPT_MAX = 64e3;
  var GUEST_GENERATE_SYSTEM_MAX = 8e3;
  var GUEST_GENERATE_OUTPUT_TOKENS_MAX = 4e3;
  var GUEST_GENERATE_TIMEOUT_MS = 96e4;
  var GUEST_GENERATE_LATE_KEEP_MS = 60 * 6e4;
  var GUEST_BADGE_MAX = 999;
  var GUEST_FRAME_HEIGHT_MAX = 1e4;
  var GUEST_RESOLVE_ERROR_MAX = 500;
  var HOST_REQUEST_ERROR_CODES = [
    "HOST_UNAVAILABLE",
    "HOST_TIMEOUT",
    "HOST_REJECTED",
    "DISCONNECTED",
    "DISABLED",
    "BAD_PATH",
    "NO_INTEGRATION",
    "NO_SERVICE",
    "SERVICE_FAILED",
    "REQUEST_FAILED",
    "RESPONSE_TOO_LARGE",
    "NO_SESSION",
    "SESSION_BUSY",
    "NOT_GRANTED",
    "NO_DIRECTORY",
    "NOT_FOUND",
    "FILE_TOO_LARGE",
    "DENIED",
    "NO_MODEL",
    "MODEL_FAILED",
    "UNSUPPORTED"
  ];
  var SERVICE_STATUS_VALUES = ["stopped", "starting", "ready", "failed"];
  var hostRequestErrorCodeSet = new Set(HOST_REQUEST_ERROR_CODES);
  var isHostRequestErrorCode = (value) => hostRequestErrorCodeSet.has(value);
  var resolveHostRequestErrorCode = (value) => value && isHostRequestErrorCode(value) ? value : "HOST_REJECTED";
  var isJsonValue = (value) => {
    if (value === void 0)
      return false;
    if (value === null || value === true || value === false)
      return true;
    if (String(value) === value)
      return true;
    if (Number(value) === value)
      return Number.isFinite(value);
    if (Array.isArray(value))
      return value.every(isJsonValue);
    if (Object(value) === value)
      return Object.values(value).every(isJsonValue);
    return false;
  };
  var isAttachData = (value) => isJsonValue(value) && JSON.stringify(value).length <= GUEST_ATTACH_DATA_MAX;
  var clampBranch = (value) => value?.trim().slice(0, GUEST_ATTACH_BRANCH_MAX) ?? "";
  var clampAttachRequest = (request) => {
    const id = request.id.trim().slice(0, GUEST_ATTACH_ID_MAX);
    const title = request.title.trim().slice(0, GUEST_ATTACH_TITLE_MAX);
    const url = request.url.trim().slice(0, GUEST_ATTACH_URL_MAX);
    const text = request.text?.trim().slice(0, GUEST_ATTACH_TEXT_MAX);
    const author = request.author?.trim().slice(0, GUEST_ATTACH_AUTHOR_MAX);
    const kind = request.kind === "pull" ? "pull" : "issue";
    const next = {
      providerId: request.providerId.trim(),
      id,
      title: title || id,
      url,
      kind
    };
    if (text) {
      next.text = text;
    }
    if (author) {
      next.author = author;
    }
    if (kind === "pull") {
      const head = clampBranch(request.branches?.head);
      const base = clampBranch(request.branches?.base);
      if (head && base) {
        next.branches = { head, base };
      }
    }
    if (isAttachData(request.data)) {
      next.data = request.data;
    }
    return next;
  };
  var clampStartSessionRequest = (request) => {
    const next = clampAttachRequest(request);
    if (request.projectId)
      next.projectId = request.projectId;
    if (request.navigation)
      next.navigation = request.navigation;
    if (request.worktree) {
      next.worktree = request.worktree;
    }
    return next;
  };
  var clampPromptRequest = (request) => {
    const next = {
      text: request.text.trim().slice(0, GUEST_COMPOSE_TEXT_MAX)
    };
    if (request.send) {
      next.send = true;
    }
    return next;
  };
  var clampBadgeCount = (count) => {
    if (count === null || !Number.isFinite(count))
      return null;
    return Math.min(GUEST_BADGE_MAX, Math.max(0, Math.round(count)));
  };
  var clampFrameHeight = (height) => {
    if (!Number.isFinite(height))
      return 0;
    return Math.min(GUEST_FRAME_HEIGHT_MAX, Math.max(0, Math.ceil(height)));
  };
  var isGuestFilePath = (value) => value.length > 0 && value.length <= GUEST_FILE_PATH_MAX && !value.includes("\0") && !value.includes("\\");
  var isGuestRequestPath = (value) => {
    if (!value.startsWith("/") || value.includes("\0") || value.includes("\\") || value.includes("://")) {
      return false;
    }
    if (value.length > GUEST_REQUEST_PATH_MAX) {
      return false;
    }
    const segments = value.split("/");
    return !segments.some((segment) => segment === "." || segment === "..");
  };
  var serviceStatusSet = new Set(SERVICE_STATUS_VALUES);
  var isServiceStatusResult = (value) => Boolean(value && "status" in value && serviceStatusSet.has(String(value.status)) && !("body" in value));
  var isGuestRequestResult = (value) => Boolean(value && "status" in value && "body" in value && Number.isInteger(value.status));
  var isFileReadResult = (value) => Boolean(value && "content" in value && String(value.content) === value.content);
  var isFileWriteResult = (value) => Boolean(value && "written" in value && value.written === true);
  var isFileListResult = (value) => Boolean(value && "entries" in value && Array.isArray(value.entries));
  var fileStatKindSet = new Set(GUEST_FILE_STAT_KINDS);
  var isFileStatResult = (value) => Boolean(value && "kind" in value && "size" in value && fileStatKindSet.has(String(value.kind)) && Number.isFinite(value.size));
  var isGenerateResult = (value) => Boolean(value && "text" in value && String(value.text) === value.text && !("status" in value));
  var HOST_PUSH_TYPES = /* @__PURE__ */ new Set([
    "workspace",
    "shells",
    "ready",
    "directory",
    "session",
    "connection",
    "settings",
    "session-lifecycle",
    "item",
    "resolve",
    "action",
    "service-event",
    "status-control-event",
    "popover-closed",
    "file-open",
    "file-snapshot",
    "file-saved",
    "generate-late"
  ]);
  var asWireRecord = (data) => Object(data) === data ? data : null;
  var isNonEmptyString = (value) => String(value) === value && value.length > 0;
  var readResultMessage = (wire) => {
    if (!isNonEmptyString(wire.id))
      return null;
    if (wire.ok === true) {
      const message = {
        channel: OPENCHAMBER_SDK_CHANNEL,
        v: OPENCHAMBER_SDK_API_VERSION,
        type: "result",
        id: wire.id,
        ok: true
      };
      if (Object(wire.payload) === wire.payload) {
        message.payload = wire.payload;
      }
      return message;
    }
    if (wire.ok === false && isNonEmptyString(wire.error)) {
      return {
        channel: OPENCHAMBER_SDK_CHANNEL,
        v: OPENCHAMBER_SDK_API_VERSION,
        type: "result",
        id: wire.id,
        ok: false,
        error: wire.error,
        code: resolveHostRequestErrorCode(isNonEmptyString(wire.code) ? wire.code : void 0)
      };
    }
    return null;
  };
  var readHostMessage = (data) => {
    const wire = asWireRecord(data);
    if (!wire || wire.channel !== OPENCHAMBER_SDK_CHANNEL || wire.v !== OPENCHAMBER_SDK_API_VERSION)
      return null;
    if (wire.type === "result")
      return readResultMessage(wire);
    if (!HOST_PUSH_TYPES.has(String(wire.type)) || Object(wire.payload) !== wire.payload)
      return null;
    return wire;
  };

  // node_modules/@openchamber/sdk/dist/host.js
  var isKeyEvent = (event) => "key" in event && "metaKey" in event && "ctrlKey" in event;
  var isSaveShortcut = (event) => (event.metaKey || event.ctrlKey) && !event.altKey && !event.shiftKey && event.key.toLowerCase() === "s";
  var HostRequestError = class extends Error {
    constructor(code, message) {
      super(message);
      __publicField(this, "code");
      this.name = "HostRequestError";
      this.code = code;
    }
  };
  var rejectBadPath = () => Promise.reject(new HostRequestError("BAD_PATH", 'Request path must start with "/" and stay on the declared origin.'));
  var rejectBadFilePath = () => Promise.reject(new HostRequestError("BAD_PATH", `File path must be 1 to ${GUEST_FILE_PATH_MAX} characters without NUL or backslash.`));
  var deviceStorageScope = (options) => {
    if (options === void 0)
      return void 0;
    if (Object(options) !== options || Array.isArray(options) || options.scope !== void 0 && options.scope !== "instance" && options.scope !== "device") {
      throw new HostRequestError("HOST_REJECTED", 'Storage scope must be "instance" or "device".');
    }
    return options.scope === "device" ? "device" : void 0;
  };
  var nextId = (n) => {
    n.value += 1;
    return `oc-${n.value}`;
  };
  var connectHost = (options = {}) => {
    const target = options.target ?? ("window" in globalThis ? window : null);
    if (!target) {
      throw new HostRequestError("HOST_UNAVAILABLE", "No window. connectHost runs in a browser frame.");
    }
    const acceptSource = options.acceptSource ?? ((source) => source === target.parent);
    const requestTimeoutMs = options.requestTimeoutMs ?? GUEST_REQUEST_TIMEOUT_MS;
    const readyListeners = /* @__PURE__ */ new Set();
    const directoryListeners = /* @__PURE__ */ new Set();
    const sessionListeners = /* @__PURE__ */ new Set();
    const lifecycleListeners = /* @__PURE__ */ new Set();
    const connectionListeners = /* @__PURE__ */ new Set();
    const settingsListeners = /* @__PURE__ */ new Set();
    const itemListeners = /* @__PURE__ */ new Set();
    const blockListeners = /* @__PURE__ */ new Set();
    const serviceEventListeners = /* @__PURE__ */ new Set();
    const statusControlListeners = /* @__PURE__ */ new Set();
    const popoverClosedListeners = /* @__PURE__ */ new Set();
    const lateGenerateListeners = /* @__PURE__ */ new Set();
    const unclaimedLateGenerate = [];
    let resolveHandler = null;
    let actionHandler = null;
    const fileOpenListeners = /* @__PURE__ */ new Set();
    const fileSavedListeners = /* @__PURE__ */ new Set();
    let fileSnapshotHandler = null;
    let lastFile = null;
    let saveShortcutInstalled = false;
    const pending = /* @__PURE__ */ new Map();
    const workspaceListeners = /* @__PURE__ */ new Map();
    const shellsListeners = /* @__PURE__ */ new Map();
    let disposed = false;
    const ids = { value: 0 };
    let lastReady = null;
    let lastLifecycle = null;
    let popoverPointerActive = false;
    let popoverFocusActive = false;
    let popoverActivityReported = null;
    const lifecycleFromSession = (session) => {
      if (!session)
        return null;
      return {
        sessionId: session.id,
        phase: session.busy ? "started" : "completed"
      };
    };
    const post = (message) => {
      target.parent.postMessage(message, "*");
    };
    const listenForLateGenerate = () => {
      if (disposed || target.parent === target || lateGenerateListeners.size === 0 || lastReady?.features?.lateGenerateResults !== true)
        return;
      post({ channel: OPENCHAMBER_SDK_CHANNEL, v: OPENCHAMBER_SDK_API_VERSION, type: "generate-late-listen" });
    };
    const emit = (listeners, value) => {
      for (const listener of listeners) {
        try {
          listener(value);
        } catch (error) {
          console.error(error);
        }
      }
    };
    const onMessage = (event) => {
      if (!(event instanceof MessageEvent))
        return;
      if (!acceptSource(event.source))
        return;
      const message = readHostMessage(event.data);
      if (!message)
        return;
      if (message.type === "workspace") {
        const listener = workspaceListeners.get(message.payload.subscriptionId);
        if (listener)
          emit([listener], message.payload.snapshot);
        return;
      }
      if (message.type === "shells") {
        const listener = shellsListeners.get(message.payload.subscriptionId);
        if (listener)
          emit([listener], message.payload.snapshot);
        return;
      }
      if (message.type === "ready") {
        lastReady = message.payload;
        lastLifecycle = lifecycleFromSession(message.payload.session);
        emit(readyListeners, message.payload);
        emit(directoryListeners, message.payload.directory);
        emit(sessionListeners, message.payload.session);
        if (lastLifecycle) {
          emit(lifecycleListeners, lastLifecycle);
        }
        emit(connectionListeners, message.payload.connection);
        emit(settingsListeners, message.payload.settings);
        emit(itemListeners, message.payload.item);
        if (message.payload.block)
          emit(blockListeners, message.payload.block);
        listenForLateGenerate();
        return;
      }
      if (message.type === "service-event") {
        emit(serviceEventListeners, message.payload);
        return;
      }
      if (message.type === "generate-late") {
        if (lateGenerateListeners.size === 0)
          unclaimedLateGenerate.push(message.payload);
        else
          emit(lateGenerateListeners, message.payload);
        return;
      }
      if (message.type === "directory") {
        if (lastReady) {
          lastReady = { ...lastReady, directory: message.payload.directory };
        }
        emit(directoryListeners, message.payload.directory);
        return;
      }
      if (message.type === "session") {
        if (lastReady) {
          lastReady = { ...lastReady, session: message.payload.session };
        }
        if (!message.payload.session) {
          lastLifecycle = null;
        } else if (lastLifecycle?.sessionId !== message.payload.session.id) {
          lastLifecycle = lifecycleFromSession(message.payload.session);
        }
        emit(sessionListeners, message.payload.session);
        return;
      }
      if (message.type === "session-lifecycle") {
        lastLifecycle = message.payload;
        emit(lifecycleListeners, message.payload);
        return;
      }
      if (message.type === "connection") {
        if (lastReady) {
          lastReady = { ...lastReady, connection: message.payload.connection };
        }
        emit(connectionListeners, message.payload.connection);
        return;
      }
      if (message.type === "settings") {
        if (lastReady) {
          lastReady = { ...lastReady, settings: message.payload.settings };
        }
        emit(settingsListeners, message.payload.settings);
        return;
      }
      if (message.type === "item") {
        if (lastReady) {
          lastReady = { ...lastReady, item: message.payload.item };
        }
        emit(itemListeners, message.payload.item);
        return;
      }
      if (message.type === "status-control-event") {
        emit(statusControlListeners, message.payload);
        return;
      }
      if (message.type === "popover-closed") {
        emit(popoverClosedListeners, message.payload);
        return;
      }
      if (message.type === "action") {
        const answer = (payload) => {
          if (!disposed)
            post({
              channel: OPENCHAMBER_SDK_CHANNEL,
              v: OPENCHAMBER_SDK_API_VERSION,
              type: "action-result",
              id: message.id,
              payload
            });
        };
        const handler = actionHandler;
        if (!handler) {
          answer({ ok: false, error: "This extension does not handle background actions." });
          return;
        }
        Promise.resolve().then(() => handler(message.payload)).then(() => answer({ ok: true }), (error) => {
          const text = (error instanceof Error ? error.message : String(error)).trim();
          answer({ ok: false, error: (text || "Action failed.").slice(0, GUEST_RESOLVE_ERROR_MAX) });
        });
        return;
      }
      if (message.type === "file-open") {
        const next = message.payload;
        if (lastFile && sameFileEditorDocument(lastFile, next))
          return;
        lastFile = next;
        emit(fileOpenListeners, message.payload);
        return;
      }
      if (message.type === "file-saved") {
        emit(fileSavedListeners, message.payload.version);
        return;
      }
      if (message.type === "file-snapshot") {
        const answer = (payload) => {
          if (!disposed)
            post({
              channel: OPENCHAMBER_SDK_CHANNEL,
              v: OPENCHAMBER_SDK_API_VERSION,
              type: "file-snapshot-result",
              id: message.id,
              payload
            });
        };
        const fail = (text) => answer({ error: (text.trim() || "Could not read the edited file.").slice(0, GUEST_RESOLVE_ERROR_MAX) });
        const handler = fileSnapshotHandler;
        if (!handler) {
          fail("This extension does not edit files.");
          return;
        }
        Promise.resolve().then(() => handler(message.payload.purpose)).then((snapshot) => {
          if (fileEditorPayloadSize(snapshot) > GUEST_FILE_EDITOR_CONTENT_MAX) {
            fail(`The file is over ${GUEST_FILE_EDITOR_CONTENT_MAX} ${"bytes" in snapshot ? "bytes" : "characters"}.`);
            return;
          }
          if (snapshot.version.length > GUEST_FILE_EDITOR_VERSION_MAX) {
            fail(`The snapshot version is over ${GUEST_FILE_EDITOR_VERSION_MAX} characters.`);
            return;
          }
          answer({ snapshot: "bytes" in snapshot ? { bytes: snapshot.bytes, version: snapshot.version } : { content: snapshot.content, version: snapshot.version } });
        }, (error) => fail(error instanceof Error ? error.message : String(error)));
        return;
      }
      if (message.type === "resolve") {
        const answer = (payload) => {
          post({
            channel: OPENCHAMBER_SDK_CHANNEL,
            v: OPENCHAMBER_SDK_API_VERSION,
            type: "resolve-result",
            id: message.id,
            payload
          });
        };
        const handler = resolveHandler;
        if (!handler) {
          answer({ error: "This extension does not resolve commands." });
          return;
        }
        Promise.resolve().then(() => handler(message.payload)).then((item) => answer({ item: item ? clampAttachRequest(item) : null }), (error) => {
          const text = (error instanceof Error ? error.message : String(error)).trim();
          answer({ error: (text || "Command failed.").slice(0, GUEST_RESOLVE_ERROR_MAX) });
        });
        return;
      }
      const waiter = pending.get(message.id);
      if (!waiter)
        return;
      clearTimeout(waiter.timer);
      pending.delete(message.id);
      if (message.ok) {
        waiter.resolve(message.payload);
        return;
      }
      waiter.reject(new HostRequestError(message.code, message.error));
    };
    target.addEventListener("message", onMessage);
    post({
      channel: OPENCHAMBER_SDK_CHANNEL,
      v: OPENCHAMBER_SDK_API_VERSION,
      type: "hello"
    });
    const send = (message, timeoutMs = requestTimeoutMs) => {
      if (disposed || target.parent === target) {
        return Promise.reject(new HostRequestError("HOST_UNAVAILABLE", "No host frame. This page is not in an iframe."));
      }
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          pending.delete(message.id);
          reject(new HostRequestError("HOST_TIMEOUT", "Host did not answer in time."));
        }, timeoutMs);
        pending.set(message.id, { resolve, reject, timer });
        post(message);
      });
    };
    const request = (message) => send(message).then(() => void 0);
    const envelope = { channel: OPENCHAMBER_SDK_CHANNEL, v: OPENCHAMBER_SDK_API_VERSION };
    const notify = (message) => {
      if (!disposed && target.parent !== target)
        post(message);
    };
    const requestFileSave = () => notify({ ...envelope, type: "file-save" });
    const onSaveShortcut = (event) => {
      if (!isKeyEvent(event) || !isSaveShortcut(event))
        return;
      event.preventDefault();
      requestFileSave();
    };
    const onPopoverEscape = (event) => {
      if (!isKeyEvent(event) || event.key !== "Escape" || lastReady?.surface !== "popover" || !lastReady.popover)
        return;
      event.preventDefault();
      void closePopover(lastReady.popover.id, "escape").catch(() => void 0);
    };
    const reportPopoverActivity = () => {
      const popover = lastReady?.surface === "popover" ? lastReady.popover : void 0;
      if (!popover)
        return;
      const active2 = popoverPointerActive || popoverFocusActive;
      if (popoverActivityReported === active2)
        return;
      popoverActivityReported = active2;
      void setPopoverAnchorActive(popover.id, active2).catch(() => void 0);
    };
    const onPopoverPointerOver = () => {
      if (lastReady?.surface !== "popover" || popoverPointerActive)
        return;
      popoverPointerActive = true;
      reportPopoverActivity();
    };
    const onPopoverPointerOut = (event) => {
      if (lastReady?.surface !== "popover" || event.relatedTarget !== null || !popoverPointerActive)
        return;
      popoverPointerActive = false;
      reportPopoverActivity();
    };
    const onPopoverFocus = () => {
      if (lastReady?.surface !== "popover" || popoverFocusActive)
        return;
      popoverFocusActive = true;
      reportPopoverActivity();
    };
    const onPopoverBlur = () => {
      if (lastReady?.surface !== "popover" || !popoverFocusActive)
        return;
      popoverFocusActive = false;
      reportPopoverActivity();
    };
    const requireIdentity = (value, maximum = 1024) => {
      if (!value.trim() || value.length > maximum)
        throw new HostRequestError("HOST_REJECTED", `Identity must contain 1 to ${maximum} characters.`);
    };
    const readWorkspace = async (query) => {
      if (query.kind !== "projects")
        requireIdentity(query.projectId);
      const result = await send({ ...envelope, type: "workspace-read", id: nextId(ids), payload: query });
      if (!result || !("kind" in result) || !("state" in result) || result.kind !== query.kind) {
        throw new HostRequestError("HOST_REJECTED", "Host did not return workspace data.");
      }
      return result;
    };
    const subscribeWorkspace = async (query, listener) => {
      if (query.kind !== "projects")
        requireIdentity(query.projectId);
      const subscriptionId = nextId(ids);
      workspaceListeners.set(subscriptionId, listener);
      try {
        await request({ ...envelope, type: "workspace-subscribe", id: nextId(ids), payload: { subscriptionId, query } });
      } catch (error) {
        workspaceListeners.delete(subscriptionId);
        if (!disposed)
          post({ ...envelope, type: "workspace-unsubscribe", id: nextId(ids), payload: { subscriptionId } });
        throw error;
      }
      return () => {
        if (!workspaceListeners.delete(subscriptionId) || disposed)
          return;
        post({ ...envelope, type: "workspace-unsubscribe", id: nextId(ids), payload: { subscriptionId } });
      };
    };
    const subscribeShells = async (scope, listener) => {
      if (scope.kind === "session")
        requireIdentity(scope.sessionId);
      if (scope.kind === "project")
        requireIdentity(scope.projectId);
      const subscriptionId = nextId(ids);
      shellsListeners.set(subscriptionId, listener);
      try {
        await request({ ...envelope, type: "shells-subscribe", id: nextId(ids), payload: { subscriptionId, scope } });
      } catch (error) {
        shellsListeners.delete(subscriptionId);
        if (!disposed)
          post({ ...envelope, type: "shells-unsubscribe", id: nextId(ids), payload: { subscriptionId } });
        throw error;
      }
      return () => {
        if (!shellsListeners.delete(subscriptionId) || disposed)
          return;
        post({ ...envelope, type: "shells-unsubscribe", id: nextId(ids), payload: { subscriptionId } });
      };
    };
    const storage = async (payload) => {
      if ("key" in payload && (payload.key.length === 0 || payload.key.length > GUEST_STORAGE_KEY_MAX)) {
        throw new HostRequestError("HOST_REJECTED", "Storage key must contain 1 to 128 characters.");
      }
      if (payload.op === "set" && !isJsonValue(payload.value)) {
        throw new HostRequestError("HOST_REJECTED", "Storage values must be JSON.");
      }
      if (payload.op === "set" && new TextEncoder().encode(JSON.stringify(payload.value)).length > GUEST_STORAGE_VALUE_BYTES) {
        throw new HostRequestError("HOST_REJECTED", "Storage value exceeds 64 KiB.");
      }
      if (payload.scope === "device" && lastReady?.features?.deviceStorage !== true) {
        throw new HostRequestError("UNSUPPORTED", "This host does not support device storage.");
      }
      const result = await send({ ...envelope, type: "storage", id: nextId(ids), payload });
      if (!result || !("storage" in result) || result.op !== payload.op)
        throw new HostRequestError("HOST_REJECTED", "Host did not return storage data.");
      return result;
    };
    const closePopover = (id, reason) => lastReady?.features?.popovers !== true && !(lastReady?.surface === "popover" && lastReady.popover?.id === id) ? Promise.reject(new HostRequestError("UNSUPPORTED", "This host does not support popovers.")) : request({ ...envelope, type: "popover-close", id: nextId(ids), payload: reason ? { id, reason } : { id } });
    const setPopoverAnchorActive = (id, active2) => lastReady?.features?.popovers !== true && !(lastReady?.surface === "popover" && lastReady.popover?.id === id) ? Promise.reject(new HostRequestError("UNSUPPORTED", "This host does not support popovers.")) : request({ ...envelope, type: "popover-anchor", id: nextId(ids), payload: { id, active: active2 } });
    target.addEventListener("keydown", onPopoverEscape, true);
    target.addEventListener("pointerover", onPopoverPointerOver);
    target.addEventListener("pointermove", onPopoverPointerOver);
    target.addEventListener("pointerout", onPopoverPointerOut);
    target.addEventListener("focus", onPopoverFocus);
    target.addEventListener("blur", onPopoverBlur);
    return {
      onAction: (handler) => {
        actionHandler = handler;
        return () => {
          if (actionHandler === handler)
            actionHandler = null;
        };
      },
      listProjects: async () => {
        const result = await readWorkspace({ kind: "projects" });
        if (result.kind !== "projects")
          throw new HostRequestError("HOST_REJECTED", "Expected projects.");
        return result;
      },
      listWorktrees: async (projectId) => {
        const result = await readWorkspace({ kind: "worktrees", projectId });
        if (result.kind !== "worktrees")
          throw new HostRequestError("HOST_REJECTED", "Expected worktrees.");
        return result;
      },
      listSessions: async (projectId) => {
        const result = await readWorkspace({ kind: "sessions", projectId });
        if (result.kind !== "sessions")
          throw new HostRequestError("HOST_REJECTED", "Expected sessions.");
        return result;
      },
      onProjects: (listener) => subscribeWorkspace({ kind: "projects" }, (snapshot) => {
        if (snapshot.kind === "projects")
          listener(snapshot);
      }),
      onWorktrees: (projectId, listener) => subscribeWorkspace({ kind: "worktrees", projectId }, (snapshot) => {
        if (snapshot.kind === "worktrees")
          listener(snapshot);
      }),
      onSessions: (projectId, listener) => subscribeWorkspace({ kind: "sessions", projectId }, (snapshot) => {
        if (snapshot.kind === "sessions")
          listener(snapshot);
      }),
      onRunningShells: (scope, listener) => subscribeShells(scope, listener),
      readShellOutput: async (shellId, options2) => {
        requireIdentity(shellId, GUEST_SHELL_ID_MAX);
        const cursor = options2?.cursor;
        if (cursor !== void 0 && (!Number.isInteger(cursor) || cursor < 0)) {
          throw new HostRequestError("HOST_REJECTED", "Shell output cursor must be a non-negative integer.");
        }
        const tailBytes = options2?.tailBytes;
        if (tailBytes !== void 0 && (!Number.isInteger(tailBytes) || tailBytes < 1 || tailBytes > GUEST_SHELL_OUTPUT_TAIL_MAX)) {
          throw new HostRequestError("HOST_REJECTED", `Shell output tailBytes must be an integer between 1 and ${GUEST_SHELL_OUTPUT_TAIL_MAX}.`);
        }
        const result = await send({ ...envelope, type: "shell-output", id: nextId(ids), payload: { shellId, cursor, tailBytes } });
        const output = result;
        if (!output || typeof output.output !== "string" || !Number.isFinite(output.cursor)) {
          throw new HostRequestError("HOST_REJECTED", "Host did not return shell output.");
        }
        return output;
      },
      stopShell: async (shellId) => {
        requireIdentity(shellId, GUEST_SHELL_ID_MAX);
        const result = await send({ ...envelope, type: "shell-stop", id: nextId(ids), payload: { shellId } });
        if (result?.stopped !== true)
          throw new HostRequestError("HOST_REJECTED", "Host did not stop the shell.");
        return { stopped: true };
      },
      openSession: async (sessionId) => {
        requireIdentity(sessionId);
        await request({ ...envelope, type: "open-session", id: nextId(ids), payload: { sessionId } });
      },
      storage: {
        get: async (key, options2) => {
          const scope = deviceStorageScope(options2);
          const payload = { op: "get", key };
          if (scope)
            payload.scope = scope;
          const result = await storage(payload);
          return result.op === "get" && result.found ? result.value : void 0;
        },
        set: async (key, value, options2) => {
          const scope = deviceStorageScope(options2);
          const payload = { op: "set", key, value };
          if (scope)
            payload.scope = scope;
          await storage(payload);
        },
        delete: async (key, options2) => {
          const scope = deviceStorageScope(options2);
          const payload = { op: "delete", key };
          if (scope)
            payload.scope = scope;
          await storage(payload);
        },
        keys: async (options2) => {
          const scope = deviceStorageScope(options2);
          const payload = { op: "keys" };
          if (scope)
            payload.scope = scope;
          const result = await storage(payload);
          if (result.op !== "keys")
            throw new HostRequestError("HOST_REJECTED", "Expected storage keys.");
          return result.keys;
        }
      },
      onReady: (listener) => {
        readyListeners.add(listener);
        if (lastReady)
          listener(lastReady);
        return () => {
          readyListeners.delete(listener);
        };
      },
      onDirectory: (listener) => {
        directoryListeners.add(listener);
        if (lastReady)
          listener(lastReady.directory);
        return () => {
          directoryListeners.delete(listener);
        };
      },
      onSession: (listener) => {
        sessionListeners.add(listener);
        if (lastReady)
          listener(lastReady.session);
        return () => {
          sessionListeners.delete(listener);
        };
      },
      onSessionLifecycle: (listener) => {
        lifecycleListeners.add(listener);
        if (lastLifecycle)
          listener(lastLifecycle);
        return () => {
          lifecycleListeners.delete(listener);
        };
      },
      onConnection: (listener) => {
        connectionListeners.add(listener);
        if (lastReady)
          listener(lastReady.connection);
        return () => {
          connectionListeners.delete(listener);
        };
      },
      onSettings: (listener) => {
        settingsListeners.add(listener);
        if (lastReady)
          listener(lastReady.settings);
        return () => {
          settingsListeners.delete(listener);
        };
      },
      onItem: (listener) => {
        itemListeners.add(listener);
        if (lastReady)
          listener(lastReady.item);
        return () => {
          itemListeners.delete(listener);
        };
      },
      onBlock: (listener) => {
        blockListeners.add(listener);
        if (lastReady?.block)
          listener(lastReady.block);
        return () => {
          blockListeners.delete(listener);
        };
      },
      onServiceEvent: (listener) => {
        serviceEventListeners.add(listener);
        return () => {
          serviceEventListeners.delete(listener);
        };
      },
      onStatusControl: (listener) => {
        statusControlListeners.add(listener);
        return () => {
          statusControlListeners.delete(listener);
        };
      },
      onPopoverClosed: (listener) => {
        popoverClosedListeners.add(listener);
        return () => {
          popoverClosedListeners.delete(listener);
        };
      },
      setStatusControls: (controls) => {
        if (lastReady?.features?.statusControls !== true) {
          return Promise.reject(new HostRequestError("UNSUPPORTED", "This host does not support status controls."));
        }
        if (!isGuestStatusControls(controls)) {
          return Promise.reject(new HostRequestError("HOST_REJECTED", "Status controls must have unique bounded ids and valid selected options."));
        }
        return request({ ...envelope, type: "status-controls", id: nextId(ids), payload: { controls } });
      },
      openPopover: (payload) => {
        if (lastReady?.features?.popovers !== true) {
          return Promise.reject(new HostRequestError("UNSUPPORTED", "This host does not support popovers."));
        }
        if (!isGuestPopoverRequest(payload)) {
          return Promise.reject(new HostRequestError("HOST_REJECTED", "Popover requests need bounded geometry and JSON data."));
        }
        return request({ ...envelope, type: "popover-open", id: nextId(ids), payload });
      },
      closePopover,
      setPopoverAnchorActive,
      onResolve: (handler) => {
        resolveHandler = handler;
        return () => {
          if (resolveHandler === handler)
            resolveHandler = null;
        };
      },
      toast: (payload) => {
        const message = payload.message.trim();
        if (!message || message.length > GUEST_TOAST_MAX) {
          return Promise.reject(new HostRequestError("HOST_REJECTED", `Toast message must contain 1 to ${GUEST_TOAST_MAX} characters.`));
        }
        if (payload.copy && payload.copy !== true && (!payload.copy.text.length || payload.copy.text.length > GUEST_CLIPBOARD_TEXT_MAX)) {
          return Promise.reject(new HostRequestError("HOST_REJECTED", `Toast copy text must contain 1 to ${GUEST_CLIPBOARD_TEXT_MAX} characters.`));
        }
        return request({
          channel: OPENCHAMBER_SDK_CHANNEL,
          v: OPENCHAMBER_SDK_API_VERSION,
          type: "toast",
          id: nextId(ids),
          payload: { ...payload, message }
        });
      },
      openUrl: (url) => request({
        channel: OPENCHAMBER_SDK_CHANNEL,
        v: OPENCHAMBER_SDK_API_VERSION,
        type: "open-url",
        id: nextId(ids),
        payload: { url }
      }),
      openCommit: (sha) => isGuestCommitSha(sha) ? request({
        channel: OPENCHAMBER_SDK_CHANNEL,
        v: OPENCHAMBER_SDK_API_VERSION,
        type: "open-commit",
        id: nextId(ids),
        payload: { sha }
      }) : Promise.reject(new HostRequestError("HOST_REJECTED", "Commit id must be 7 to 64 hex characters.")),
      answerBlock: (text) => request({
        channel: OPENCHAMBER_SDK_CHANNEL,
        v: OPENCHAMBER_SDK_API_VERSION,
        type: "block-answer",
        id: nextId(ids),
        payload: { text: text.trim().slice(0, GUEST_BLOCK_ANSWER_MAX) }
      }),
      openSurface: (surfaceId) => request({
        channel: OPENCHAMBER_SDK_CHANNEL,
        v: OPENCHAMBER_SDK_API_VERSION,
        type: "open-surface",
        id: nextId(ids),
        payload: { surfaceId }
      }),
      writeClipboard: (text) => request({
        channel: OPENCHAMBER_SDK_CHANNEL,
        v: OPENCHAMBER_SDK_API_VERSION,
        type: "clipboard-write",
        id: nextId(ids),
        payload: { text }
      }),
      compose: (payload) => request({
        channel: OPENCHAMBER_SDK_CHANNEL,
        v: OPENCHAMBER_SDK_API_VERSION,
        type: "compose",
        id: nextId(ids),
        payload
      }),
      attach: (payload) => request({
        channel: OPENCHAMBER_SDK_CHANNEL,
        v: OPENCHAMBER_SDK_API_VERSION,
        type: "attach",
        id: nextId(ids),
        payload: clampAttachRequest(payload)
      }),
      startSession: async (payload) => {
        if (payload.projectId !== void 0)
          requireIdentity(payload.projectId);
        const worktree = payload.worktree;
        if (worktree && worktree !== true) {
          if (worktree.kind === "existing")
            requireIdentity(worktree.directory);
          else {
            if (worktree.name !== void 0)
              requireIdentity(worktree.name, 200);
            if (worktree.baseBranch !== void 0)
              requireIdentity(worktree.baseBranch, 200);
          }
        }
        const result = await send({
          channel: OPENCHAMBER_SDK_CHANNEL,
          v: OPENCHAMBER_SDK_API_VERSION,
          type: "start-session",
          id: nextId(ids),
          payload: clampStartSessionRequest(payload)
        }, options.requestTimeoutMs ?? 18e4);
        if (!isStartSessionResult(result)) {
          throw new HostRequestError("HOST_REJECTED", "Host did not return a session.");
        }
        return result;
      },
      prompt: (payload) => send({
        channel: OPENCHAMBER_SDK_CHANNEL,
        v: OPENCHAMBER_SDK_API_VERSION,
        type: "prompt",
        id: nextId(ids),
        payload: clampPromptRequest(payload)
      }).then((result) => {
        if (!isPromptResult(result)) {
          throw new HostRequestError("HOST_REJECTED", "Host did not return a prompt result.");
        }
        return result;
      }),
      sessionLink: (payload) => request({
        channel: OPENCHAMBER_SDK_CHANNEL,
        v: OPENCHAMBER_SDK_API_VERSION,
        type: "session-link",
        id: nextId(ids),
        payload: clampAttachRequest(payload)
      }),
      close: () => request({
        channel: OPENCHAMBER_SDK_CHANNEL,
        v: OPENCHAMBER_SDK_API_VERSION,
        type: "close",
        id: nextId(ids)
      }),
      oauthStart: () => request({
        channel: OPENCHAMBER_SDK_CHANNEL,
        v: OPENCHAMBER_SDK_API_VERSION,
        type: "oauth-start",
        id: nextId(ids)
      }),
      oauthDisconnect: () => request({
        channel: OPENCHAMBER_SDK_CHANNEL,
        v: OPENCHAMBER_SDK_API_VERSION,
        type: "oauth-disconnect",
        id: nextId(ids)
      }),
      request: (payload) => (isGuestRequestPath(payload.path) ? send({
        channel: OPENCHAMBER_SDK_CHANNEL,
        v: OPENCHAMBER_SDK_API_VERSION,
        type: "request",
        id: nextId(ids),
        payload
      }) : rejectBadPath()).then((result) => {
        if (!isGuestRequestResult(result)) {
          throw new HostRequestError("HOST_REJECTED", "Host request result was empty.");
        }
        return result;
      }),
      serviceRequest: (payload) => (isGuestRequestPath(payload.path) ? send({
        channel: OPENCHAMBER_SDK_CHANNEL,
        v: OPENCHAMBER_SDK_API_VERSION,
        type: "service-request",
        id: nextId(ids),
        payload
      }) : rejectBadPath()).then((result) => {
        if (!isGuestRequestResult(result)) {
          throw new HostRequestError("HOST_REJECTED", "Host service request result was empty.");
        }
        return result;
      }),
      serviceStatus: () => send({
        channel: OPENCHAMBER_SDK_CHANNEL,
        v: OPENCHAMBER_SDK_API_VERSION,
        type: "service-status",
        id: nextId(ids)
      }).then((result) => {
        if (!isServiceStatusResult(result)) {
          throw new HostRequestError("HOST_REJECTED", "Host did not return service status.");
        }
        return result;
      }),
      readFile: (path) => (isGuestFilePath(path) ? send({
        channel: OPENCHAMBER_SDK_CHANNEL,
        v: OPENCHAMBER_SDK_API_VERSION,
        type: "file-read",
        id: nextId(ids),
        payload: { path }
      }) : rejectBadFilePath()).then((result) => {
        if (!isFileReadResult(result)) {
          throw new HostRequestError("HOST_REJECTED", "Host did not return file content.");
        }
        return result;
      }),
      writeFile: (path, content) => {
        if (!isGuestFilePath(path)) {
          return rejectBadFilePath();
        }
        if (content.length > GUEST_FILE_CONTENT_MAX) {
          return Promise.reject(new HostRequestError("FILE_TOO_LARGE", `Content is over ${GUEST_FILE_CONTENT_MAX} characters.`));
        }
        return send({
          channel: OPENCHAMBER_SDK_CHANNEL,
          v: OPENCHAMBER_SDK_API_VERSION,
          type: "file-write",
          id: nextId(ids),
          payload: { path, content }
        }).then((result) => {
          if (!isFileWriteResult(result)) {
            throw new HostRequestError("HOST_REJECTED", "Host did not confirm the write.");
          }
          return result;
        });
      },
      listDir: (path) => (isGuestFilePath(path) ? send({
        channel: OPENCHAMBER_SDK_CHANNEL,
        v: OPENCHAMBER_SDK_API_VERSION,
        type: "file-list",
        id: nextId(ids),
        payload: { path }
      }) : rejectBadFilePath()).then((result) => {
        if (!isFileListResult(result)) {
          throw new HostRequestError("HOST_REJECTED", "Host did not return directory entries.");
        }
        return result;
      }),
      stat: (path) => (isGuestFilePath(path) ? send({
        channel: OPENCHAMBER_SDK_CHANNEL,
        v: OPENCHAMBER_SDK_API_VERSION,
        type: "file-stat",
        id: nextId(ids),
        payload: { path }
      }) : rejectBadFilePath()).then((result) => {
        if (!isFileStatResult(result)) {
          throw new HostRequestError("HOST_REJECTED", "Host did not return file status.");
        }
        return result;
      }),
      generate: (input) => {
        const prompt = input.prompt.trim();
        const system = input.system?.trim();
        if (prompt.length === 0 || prompt.length > GUEST_GENERATE_PROMPT_MAX) {
          return Promise.reject(new HostRequestError("HOST_REJECTED", `Prompt must be 1 to ${GUEST_GENERATE_PROMPT_MAX} characters.`));
        }
        if (system !== void 0 && (system.length === 0 || system.length > GUEST_GENERATE_SYSTEM_MAX)) {
          return Promise.reject(new HostRequestError("HOST_REJECTED", `System prompt must be 1 to ${GUEST_GENERATE_SYSTEM_MAX} characters.`));
        }
        const maxOutputTokens = input.maxOutputTokens === void 0 ? void 0 : Math.min(GUEST_GENERATE_OUTPUT_TOKENS_MAX, Math.max(1, Math.floor(input.maxOutputTokens)));
        if (maxOutputTokens !== void 0 && !Number.isFinite(maxOutputTokens)) {
          return Promise.reject(new HostRequestError("HOST_REJECTED", "maxOutputTokens must be a number."));
        }
        const payload = { prompt };
        if (system !== void 0)
          payload.system = system;
        if (maxOutputTokens !== void 0)
          payload.maxOutputTokens = maxOutputTokens;
        return send({
          channel: OPENCHAMBER_SDK_CHANNEL,
          v: OPENCHAMBER_SDK_API_VERSION,
          type: "generate",
          id: nextId(ids),
          payload
        }, options.requestTimeoutMs ?? GUEST_GENERATE_TIMEOUT_MS).then((result) => {
          if (!isGenerateResult(result)) {
            throw new HostRequestError("HOST_REJECTED", "Host did not return generated text.");
          }
          return result;
        });
      },
      onLateGenerateResult: (listener) => {
        lateGenerateListeners.add(listener);
        for (const result of unclaimedLateGenerate.splice(0))
          emit([listener], result);
        listenForLateGenerate();
        return () => {
          lateGenerateListeners.delete(listener);
        };
      },
      setBadge: (count) => request({
        channel: OPENCHAMBER_SDK_CHANNEL,
        v: OPENCHAMBER_SDK_API_VERSION,
        type: "badge",
        id: nextId(ids),
        payload: { count: clampBadgeCount(count) }
      }),
      setHeight: (height) => request({
        channel: OPENCHAMBER_SDK_CHANNEL,
        v: OPENCHAMBER_SDK_API_VERSION,
        type: "resize",
        id: nextId(ids),
        payload: { height: clampFrameHeight(height) }
      }),
      onFileOpen: (listener) => {
        fileOpenListeners.add(listener);
        if (!saveShortcutInstalled) {
          saveShortcutInstalled = true;
          target.addEventListener("keydown", onSaveShortcut, true);
        }
        if (lastFile)
          listener(lastFile);
        return () => {
          fileOpenListeners.delete(listener);
        };
      },
      onFileSnapshot: (handler) => {
        fileSnapshotHandler = handler;
        return () => {
          if (fileSnapshotHandler === handler)
            fileSnapshotHandler = null;
        };
      },
      onFileSaved: (listener) => {
        fileSavedListeners.add(listener);
        return () => {
          fileSavedListeners.delete(listener);
        };
      },
      reportFileChange: (change) => notify({ ...envelope, type: "file-change", payload: { dirty: change.dirty, edited: change.edited } }),
      requestFileSave,
      reportFileUnsupported: () => notify({ ...envelope, type: "file-unsupported" }),
      dispose: () => {
        for (const subscriptionId of workspaceListeners.keys()) {
          post({ ...envelope, type: "workspace-unsubscribe", id: nextId(ids), payload: { subscriptionId } });
        }
        workspaceListeners.clear();
        for (const subscriptionId of shellsListeners.keys()) {
          post({ ...envelope, type: "shells-unsubscribe", id: nextId(ids), payload: { subscriptionId } });
        }
        shellsListeners.clear();
        disposed = true;
        resolveHandler = null;
        actionHandler = null;
        fileSnapshotHandler = null;
        fileOpenListeners.clear();
        fileSavedListeners.clear();
        if (saveShortcutInstalled)
          target.removeEventListener("keydown", onSaveShortcut, true);
        target.removeEventListener("message", onMessage);
        target.removeEventListener("keydown", onPopoverEscape, true);
        target.removeEventListener("pointerover", onPopoverPointerOver);
        target.removeEventListener("pointermove", onPopoverPointerOver);
        target.removeEventListener("pointerout", onPopoverPointerOut);
        target.removeEventListener("focus", onPopoverFocus);
        target.removeEventListener("blur", onPopoverBlur);
        for (const waiter of pending.values()) {
          clearTimeout(waiter.timer);
          waiter.reject(new HostRequestError("HOST_UNAVAILABLE", "Host client was disposed."));
        }
        pending.clear();
        readyListeners.clear();
        directoryListeners.clear();
        sessionListeners.clear();
        lifecycleListeners.clear();
        connectionListeners.clear();
        settingsListeners.clear();
        itemListeners.clear();
        blockListeners.clear();
        serviceEventListeners.clear();
        statusControlListeners.clear();
        popoverClosedListeners.clear();
        lateGenerateListeners.clear();
        unclaimedLateGenerate.length = 0;
      }
    };
  };

  // node_modules/@openchamber/sdk/dist/service-providers.js
  var BROWSER_CONTROL_ACTIONS = [
    "browser.open",
    "browser.snapshot",
    "browser.click",
    "browser.type",
    "browser.select",
    "browser.scroll",
    "browser.back",
    "browser.forward",
    "browser.inspect",
    "browser.capture",
    "browser.resize",
    "browser.close"
  ];
  var BROWSER_PROVIDER_IDLE_MS = 10 * 6e4;
  var CONTROL_ACTIONS = new Set(BROWSER_CONTROL_ACTIONS);
  var SOURCE_CONTROL_PROVIDER_IDLE_MS = 10 * 6e4;
  var NOTIFICATIONS_PROVIDER_IDLE_MS = 10 * 6e4;
  var TRACKER_PROVIDER_IDLE_MS = 10 * 6e4;
  var QUOTA_PROVIDER_IDLE_MS = 10 * 6e4;

  // node_modules/@openchamber/sdk/dist/service-surface.js
  var SURFACE_CONTROLLERS = ["none", "agent", "user"];
  var CONTROLLERS = new Set(SURFACE_CONTROLLERS);

  // node_modules/@openchamber/sdk/dist/ui/theme.js
  var TOKEN_VARS = [
    ["--oc-bg", "background"],
    ["--oc-elevated", "elevated"],
    ["--oc-fg", "foreground"],
    ["--oc-muted", "muted"],
    ["--oc-subtle", "subtle"],
    ["--oc-border", "border"],
    ["--oc-hover", "hover"],
    ["--oc-selection", "selection"],
    ["--oc-focus", "focus"],
    ["--oc-primary", "primary"],
    ["--oc-muted-surface", "mutedSurface"],
    ["--oc-elevated-fg", "elevatedForeground"],
    ["--oc-active", "active"],
    ["--oc-selection-fg", "selectionForeground"],
    ["--oc-primary-fg", "primaryForeground"],
    ["--oc-primary-text", "primaryText"],
    ["--oc-success-text", "successText"],
    ["--oc-warning-text", "warningText"],
    ["--oc-error-text", "errorText"],
    ["--oc-info-text", "infoText"],
    ["--oc-success", "success"],
    ["--oc-warning", "warning"],
    ["--oc-error", "error"],
    ["--oc-info", "info"],
    ["--oc-font", "font"],
    ["--oc-mono", "mono"],
    ["--oc-radius", "radius"],
    ["--surface-background", "background"],
    ["--surface-elevated", "elevated"],
    ["--surface-foreground", "foreground"],
    ["--surface-muted-foreground", "muted"],
    ["--surface-subtle", "subtle"],
    ["--interactive-border", "border"],
    ["--interactive-hover", "hover"],
    ["--interactive-selection", "selection"],
    ["--interactive-focus-ring", "focus"],
    ["--primary", "primary"],
    ["--surface-muted", "mutedSurface"],
    ["--surface-elevated-foreground", "elevatedForeground"],
    ["--interactive-active", "active"],
    ["--interactive-selection-foreground", "selectionForeground"],
    ["--primary-foreground", "primaryForeground"],
    ["--primary-text", "primaryText"],
    ["--success-text", "successText"],
    ["--warning-text", "warningText"],
    ["--error-text", "errorText"],
    ["--info-text", "infoText"],
    ["--status-success", "success"],
    ["--status-warning", "warning"],
    ["--status-error", "error"],
    ["--status-info", "info"],
    ["--font-sans", "font"],
    ["--font-mono", "mono"],
    ["--radius", "radius"]
  ];
  var SYNTAX_TOKEN_VARS = [
    ["--oc-syntax-keyword", "--syntax-keyword", "syntaxKeyword"],
    ["--oc-syntax-string", "--syntax-string", "syntaxString"],
    ["--oc-syntax-number", "--syntax-number", "syntaxNumber"],
    ["--oc-syntax-function", "--syntax-function", "syntaxFunction"],
    ["--oc-syntax-type", "--syntax-type", "syntaxType"],
    ["--oc-syntax-comment", "--syntax-comment", "syntaxComment"],
    ["--oc-syntax-variable", "--syntax-variable", "syntaxVariable"],
    ["--oc-syntax-operator", "--syntax-operator", "syntaxOperator"]
  ];
  var applyHostTheme = (theme, root) => {
    root.style.colorScheme = theme.mode;
    for (const [name, key] of TOKEN_VARS) {
      root.style.setProperty(name, theme.tokens[key]);
    }
    for (const [alias, hostName, key] of SYNTAX_TOKEN_VARS) {
      const value = theme.tokens[key] ?? "";
      root.style.setProperty(alias, value);
      root.style.setProperty(hostName, value);
    }
    root.style.setProperty("font-family", theme.tokens.font);
    root.style.setProperty("font-size", "0.875rem");
    root.style.setProperty("line-height", "1.45");
    root.style.setProperty("color", theme.tokens.foreground);
  };
  var applyHostReady = (ctx2, root) => {
    applyHostTheme(ctx2.theme, root);
    if (root.dataset) {
      root.dataset.ocSurface = ctx2.surface;
      root.dataset.ocTheme = ctx2.theme.mode;
    }
  };

  // node_modules/@openchamber/sdk/dist/ui/style.js
  var OC_ALIAS = {
    "surface-background": "bg",
    "surface-elevated": "elevated",
    "surface-elevated-foreground": "elevated-fg",
    "surface-foreground": "fg",
    "surface-muted-foreground": "muted",
    "surface-muted": "muted-surface",
    "surface-subtle": "subtle",
    "interactive-border": "border",
    "interactive-hover": "hover",
    "interactive-active": "active",
    "interactive-selection": "selection",
    "interactive-selection-foreground": "selection-fg",
    "interactive-focus-ring": "focus",
    "primary": "primary",
    "primary-foreground": "primary-fg",
    "primary-text": "primary-text",
    "success-text": "success-text",
    "warning-text": "warning-text",
    "error-text": "error-text",
    "info-text": "info-text",
    "status-success": "success",
    "status-warning": "warning",
    "status-error": "error",
    "status-info": "info",
    "font-sans": "font",
    "font-mono": "mono",
    "radius": "radius"
  };
  var v = (name, fallback) => `var(--${name}, var(--oc-${OC_ALIAS[name]}, ${fallback}))`;
  var bg = v("surface-background", "transparent");
  var elevated = v("surface-elevated", "transparent");
  var elevatedFg = v("surface-elevated-foreground", "inherit");
  var fg = v("surface-foreground", "inherit");
  var muted = v("surface-muted-foreground", "gray");
  var secondary = v("surface-muted", "transparent");
  var border = v("interactive-border", "currentColor");
  var hover = v("interactive-hover", "transparent");
  var active = v("interactive-active", "transparent");
  var selection = v("interactive-selection", "transparent");
  var selectionFg = v("interactive-selection-foreground", "inherit");
  var primary = v("primary", "currentColor");
  var primaryText = v("primary-text", "inherit");
  var errorText = v("error-text", "inherit");
  var font = v("font-sans", "inherit");
  var mono = v("font-mono", "monospace");
  var radius = v("radius", "9px");
  var controlRadius = `calc(${radius} - 2px)`;
  var smallRadius = `calc(${radius} - 4px)`;
  var mix = (color, pct, base = "transparent") => `color-mix(in srgb, ${color} ${pct}%, ${base})`;
  var focusFill = `background-image: linear-gradient(${hover}, ${hover});`;
  var field = (edge, width = "0.5px") => `box-shadow: inset 0 0 0 ${width} ${edge}, var(--oc-sdk-field-lift);`;
  var raised = "border-color: var(--oc-sdk-edge); box-shadow: var(--oc-sdk-raised-lift);";
  var litButton = "box-shadow: var(--oc-sdk-lit);";
  var darkLift = `inset 0 0.5px 0 0 ${mix(fg, 8)}, 0 1px 2px 0 rgb(0 0 0 / 0.4)`;
  var THEME_VARS = `
:root {
  --oc-sdk-edge: ${mix(fg, 16)};
  --oc-sdk-field-bg: ${elevated};
  --oc-sdk-raised-bg: ${bg};
  --oc-sdk-field-lift: inset 0 1px 2px 0 rgb(0 0 0 / 0.04);
  --oc-sdk-raised-lift: 0 1px 1.5px 0 rgb(0 0 0 / 0.08);
  --oc-sdk-lit: inset 0 1px 0 0 rgb(255 255 255 / 0.2), 0 1px 1.5px 0 rgb(0 0 0 / 0.1);
  --oc-sdk-float-edge: rgb(0 0 0 / 0.14);
  --oc-sdk-float: inset 0 1px 0 0 rgb(255 255 255 / 0.7), 0 1px 2px -0.5px rgb(0 0 0 / 0.06), 0 4px 8px -2px rgb(0 0 0 / 0.08), 0 12px 20px -4px rgb(0 0 0 / 0.06);
}
:root[data-oc-theme="dark"] {
  --oc-sdk-edge: ${mix(fg, 14)};
  --oc-sdk-field-bg: ${mix(bg, 50, elevated)};
  --oc-sdk-raised-bg: ${elevated};
  --oc-sdk-field-lift: ${darkLift};
  --oc-sdk-raised-lift: ${darkLift};
  --oc-sdk-lit: ${darkLift};
  --oc-sdk-float-edge: rgb(0 0 0 / 0.55);
  --oc-sdk-float: inset 0 1px 0 0 rgb(255 255 255 / 0.04), inset 0 0 0 0.5px rgb(255 255 255 / 0.08), 0 8px 16px 0 rgb(0 0 0 / 0.25), 0 4px 8px 0 rgb(0 0 0 / 0.25);
}`;
  var tone = (name) => {
    const color = v(`status-${name}`, "currentColor");
    return `
.oc-sdk[data-tone="${name}"], .oc-sdk [data-tone="${name}"] { --oc-sdk-tone: ${color}; --oc-sdk-tone-text: ${v(`${name}-text`, "inherit")}; }`;
  };
  var UI_SIZE_CSS = `
.oc-sdk { box-sizing: border-box; font-size: 0.875rem; line-height: 1.45; }
.oc-sdk *, .oc-sdk *::before, .oc-sdk *::after { box-sizing: border-box; }
/* :where() keeps the reset at zero specificity so every primitive class below overrides it. */
:where(.oc-sdk) :where(button, input, textarea), :where(button.oc-sdk, input.oc-sdk, textarea.oc-sdk) { font: inherit; color: inherit; margin: 0; }
:where(.oc-sdk) :where(button), :where(button.oc-sdk) { cursor: pointer; background: none; border: 0; padding: 0; }
.oc-sdk button:disabled, button.oc-sdk:disabled, .oc-sdk[aria-disabled="true"], .oc-sdk [aria-disabled="true"] { opacity: .5; pointer-events: none; }

.oc-sdk-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; height: 32px; padding: 0 12px; border: 1px solid transparent; font-size: 0.875rem; font-weight: 500; line-height: 1; white-space: nowrap; }
.oc-sdk-btn[data-size="sm"] { gap: 6px; height: 28px; padding: 0 10px; font-size: 0.8125rem; }
.oc-sdk-btn[data-size="xs"] { gap: 4px; height: 24px; padding: 0 8px; font-size: 0.75rem; }
.oc-sdk-btn[data-loading="true"] { opacity: .5; pointer-events: none; }
.oc-sdk-btn > .oc-sdk-spinner-ring { width: 14px; height: 14px; }

.oc-sdk-field { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.oc-sdk-field-label { font-size: 0.8125rem; font-weight: 500; }
.oc-sdk-field-note { font-size: 0.75rem; }
.oc-sdk-input { display: block; width: 100%; min-width: 0; height: 32px; padding: 0 10px; border: 0; font-size: 0.875rem; line-height: 1.45; appearance: none; }
textarea.oc-sdk-input { height: auto; padding: 8px 10px; resize: vertical; }

.oc-sdk-search { position: relative; min-width: 0; }
.oc-sdk-search .oc-sdk-input { padding-left: 34px; padding-right: 34px; }
.oc-sdk-search-icon { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); pointer-events: none; }
.oc-sdk-search-clear { position: absolute; right: 6px; top: 50%; transform: translateY(-50%); display: none; align-items: center; justify-content: center; width: 24px; height: 24px; }
.oc-sdk-search[data-active="true"] .oc-sdk-search-clear { display: inline-flex; }

.oc-sdk-select { position: relative; display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.oc-sdk-trigger { display: inline-flex; align-items: center; gap: 6px; align-self: flex-start; width: auto; max-width: 100%; min-width: 0; height: 28px; padding: 0 10px; border: 1px solid transparent; font-size: 0.8125rem; text-align: left; }
.oc-sdk-trigger-value { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.oc-sdk-trigger-chevron { flex: 0 0 auto; }
.oc-sdk-popup { position: fixed; z-index: 50; display: flex; flex-direction: column; gap: 2px; min-width: 160px; max-width: calc(100vw - 16px); max-height: min(320px, calc(100vh - 16px)); overflow: auto; padding: 4px; border: 1px solid transparent; }
.oc-sdk-popup-search { flex: 0 0 auto; padding: 2px 2px 4px; }
.oc-sdk-popup-search .oc-sdk-input { height: 28px; font-size: 0.8125rem; }
.oc-sdk-option { display: flex; align-items: center; gap: 8px; width: 100%; padding: 6px 8px; font-size: 0.8125rem; text-align: left; }
.oc-sdk-option-label { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.oc-sdk-option-hint { flex: 0 0 auto; font-size: 0.75rem; }
.oc-sdk-option-check { flex: 0 0 auto; display: inline-flex; width: 14px; visibility: hidden; }
.oc-sdk-option[aria-selected="true"] > .oc-sdk-option-check { visibility: visible; }
.oc-sdk-popup-empty { padding: 8px; font-size: 0.8125rem; }

.oc-sdk-check { display: inline-flex; align-items: flex-start; gap: 8px; width: 100%; text-align: left; }
.oc-sdk-check-box { flex: 0 0 auto; display: inline-flex; align-items: center; justify-content: center; width: 14px; height: 14px; margin-top: 3px; border: 1px solid transparent; }
.oc-sdk-check-box > svg { display: none; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-box > svg { display: block; }
.oc-sdk-check-thumb { flex: 0 0 auto; position: relative; width: 36px; height: 20px; }
.oc-sdk-check-thumb::after { content: ""; position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; }
.oc-sdk-check-text { display: flex; flex-direction: column; min-width: 0; }
.oc-sdk-check-label { font-size: 0.875rem; }
.oc-sdk-check-desc { font-size: 0.75rem; }

.oc-sdk-tabs { display: inline-flex; gap: 2px; padding: 2px; max-width: 100%; overflow: auto; }
.oc-sdk-tab { display: inline-flex; align-items: center; gap: 6px; height: 28px; padding: 0 10px; border: 1px solid transparent; font-size: 0.8125rem; font-weight: 500; white-space: nowrap; }
.oc-sdk-tab-count { font-size: 0.75rem; font-variant-numeric: tabular-nums; }

.oc-sdk-badge { display: inline-flex; align-items: center; padding: 1px 6px; font-size: 11px; font-weight: 500; line-height: 16px; white-space: nowrap; }

.oc-sdk-list { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
.oc-sdk-row { display: flex; align-items: center; gap: 8px; width: 100%; padding: 6px 8px; text-align: left; }
.oc-sdk-row-lead { flex: 0 0 auto; width: 64px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 0.75rem; }
.oc-sdk-row-main { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; }
.oc-sdk-row-title { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.oc-sdk-row-sub { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 0.75rem; }
.oc-sdk-row-meta { flex: 0 0 auto; font-size: 0.75rem; font-variant-numeric: tabular-nums; }
.oc-sdk-list-empty { padding: 16px 8px; text-align: center; font-size: 0.8125rem; }

.oc-sdk-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; padding: 40px 16px; text-align: center; }
.oc-sdk-empty-title { margin: 0; font-size: 0.8125rem; font-weight: 600; }
.oc-sdk-empty-body { margin: 0; max-width: 32rem; font-size: 0.8125rem; }
.oc-sdk-empty-action { margin-top: 12px; }

@keyframes oc-sdk-spin { to { transform: rotate(360deg); } }
.oc-sdk-spinner { display: inline-flex; align-items: center; gap: 8px; font-size: 0.8125rem; }
.oc-sdk-spinner-ring { width: 16px; height: 16px; border: 2px solid transparent; animation: oc-sdk-spin .8s linear infinite; }
.oc-sdk-spinner[data-size="sm"] .oc-sdk-spinner-ring { width: 12px; height: 12px; }

.oc-sdk-banner { display: flex; align-items: flex-start; gap: 12px; padding: 8px 12px; border: 1px solid transparent; }
.oc-sdk-banner-text { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.oc-sdk-banner-title { font-size: 0.8125rem; font-weight: 500; }
.oc-sdk-banner-body { font-size: 0.8125rem; }
.oc-sdk-banner-action { flex: 0 0 auto; }

.oc-sdk-separator { display: flex; align-items: center; gap: 8px; width: 100%; margin: 8px 0; font-size: 0.75rem; }
.oc-sdk-separator::before, .oc-sdk-separator::after { content: ""; flex: 1 1 auto; height: 1px; }
.oc-sdk-separator[data-labeled="false"]::after { display: none; }
.oc-sdk-popup > .oc-sdk-separator { margin: 4px 0; }

.oc-sdk-progress { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.oc-sdk-progress-label { display: flex; justify-content: space-between; font-size: 0.75rem; font-variant-numeric: tabular-nums; }
.oc-sdk-progress-track { height: 6px; overflow: hidden; }
.oc-sdk-progress-fill { height: 100%; transform-origin: left; transition: transform 200ms ease-out; }
.oc-sdk-progress-value { display: inline-flex; align-items: center; gap: 2px; }
.oc-sdk-progress[data-done="true"] .oc-sdk-progress-value { font-weight: 600; }

.oc-sdk-menu { position: relative; display: inline-flex; }

.oc-sdk-text { white-space: pre-wrap; overflow-wrap: anywhere; }
.oc-sdk-text img { display: block; max-width: 100%; margin: 8px 0; }
`;
  var GUEST_UI_LOOK_CSS = `${THEME_VARS}
.oc-sdk { color: ${fg}; font-family: ${font}; }
.oc-sdk :focus-visible, .oc-sdk:focus-visible { outline: none; }
.oc-sdk :where(button, a[href], [role="button"], [role="tab"], [role="option"]):focus-visible, button.oc-sdk:focus-visible { ${focusFill} }
.oc-sdk-mono { font-family: ${mono}; }
.oc-sdk-muted { color: ${muted}; }
${tone("success")}${tone("warning")}${tone("error")}${tone("info")}
.oc-sdk[data-tone="primary"], .oc-sdk [data-tone="primary"] { --oc-sdk-tone: ${primary}; --oc-sdk-tone-text: ${primaryText}; }

.oc-sdk-btn { border-radius: ${controlRadius}; transition: background 150ms ease-out, color 150ms ease-out; }
.oc-sdk-btn[data-size="xs"] { border-radius: ${smallRadius}; }
.oc-sdk-btn[data-variant="default"] { color: ${primaryText}; background: ${mix(primary, 10, bg)}; border-color: ${mix(primary, 12)}; ${litButton} }
.oc-sdk-btn[data-variant="default"]:hover { background: ${mix(primary, 16, bg)}; }
.oc-sdk-btn[data-variant="default"]:active { background: ${mix(primary, 22, bg)}; box-shadow: none; }
.oc-sdk-btn[data-variant="secondary"] { background: ${secondary}; color: var(--oc-fg); }
.oc-sdk-btn[data-variant="secondary"]:hover { background-image: linear-gradient(${hover}, ${hover}); }
.oc-sdk-btn[data-variant="secondary"]:active { background-image: linear-gradient(${active}, ${active}); }
.oc-sdk-btn[data-variant="outline"] { background: var(--oc-sdk-raised-bg); color: ${elevatedFg}; ${raised} }
.oc-sdk-btn[data-variant="outline"]:hover { background-image: linear-gradient(${hover}, ${hover}); }
.oc-sdk-btn[data-variant="outline"]:active { background-image: linear-gradient(${active}, ${active}); box-shadow: none; }
.oc-sdk-btn[data-variant="ghost"] { background: transparent; }
.oc-sdk-btn[data-variant="ghost"]:hover { background: ${hover}; }
.oc-sdk-btn[data-variant="ghost"]:active { background: ${active}; }
.oc-sdk-btn[data-variant="destructive"] { --oc-sdk-tone: ${v("status-error", "red")}; color: ${errorText}; background: ${mix("var(--oc-sdk-tone)", 7, bg)}; border-color: ${mix("var(--oc-sdk-tone)", 12)}; ${litButton} }
.oc-sdk-btn[data-variant="destructive"]:hover { background: ${mix("var(--oc-sdk-tone)", 9, bg)}; }
.oc-sdk-btn[data-variant="destructive"]:active { background: ${mix("var(--oc-sdk-tone)", 11, bg)}; box-shadow: none; }

.oc-sdk-field-note { color: ${muted}; }
.oc-sdk-field[data-invalid="true"] .oc-sdk-field-note { color: ${errorText}; }
.oc-sdk-input { border-radius: ${controlRadius}; background: var(--oc-sdk-field-bg); color: ${elevatedFg}; ${field("var(--oc-sdk-edge)")} transition: background 150ms ease-out; }
.oc-sdk-input::placeholder { color: ${muted}; }
.oc-sdk-input:hover:not(:focus) { background-image: linear-gradient(${hover}, ${hover}); }
.oc-sdk-input:focus, .oc-sdk-input:focus-visible { ${field(mix(fg, 26), "1px")} }
.oc-sdk-field[data-invalid="true"] .oc-sdk-input, .oc-sdk-field[data-invalid="true"] .oc-sdk-input:focus { ${field(v("status-error", "red"), "1px")} }
.oc-sdk-input[data-mono="true"] { font-family: ${mono}; }

.oc-sdk-search-icon { color: ${muted}; }
.oc-sdk-search[data-active="true"] .oc-sdk-search-icon { color: ${primary}; }
.oc-sdk-search-clear { border-radius: ${smallRadius}; color: ${muted}; }
.oc-sdk-search-clear:hover { background: ${hover}; color: ${fg}; }

.oc-sdk-trigger { border-radius: ${controlRadius}; background: var(--oc-sdk-raised-bg); color: ${elevatedFg}; ${raised} transition: background 150ms ease-out; }
.oc-sdk-trigger:hover { background-image: linear-gradient(${hover}, ${hover}); }
.oc-sdk-trigger[aria-expanded="true"] { background-image: linear-gradient(${active}, ${active}); }
.oc-sdk-trigger-value[data-empty="true"] { color: ${muted}; }
.oc-sdk-trigger-chevron { color: ${muted}; }
/* The app's floating level: the glass edge (a hairline ring and a lit top line, dark outside and light inside in dark themes) over soft shadows. The outer ring is the border, over the page like the app's. */
.oc-sdk-popup { --surface-foreground: ${elevatedFg}; border-color: var(--oc-sdk-float-edge); border-radius: 12px; background: ${elevated}; background-clip: padding-box; color: ${elevatedFg}; box-shadow: var(--oc-sdk-float); }
.oc-sdk-option { border-radius: 8px; }
.oc-sdk-option[data-active="true"] { background: ${hover}; }
/* A selected option shows a check mark in the text colour, like the app's own pickers. Options without the mark come
   from bundles built before it existed and keep the selection fill as their only sign of the choice. */
.oc-sdk-option[aria-selected="true"]:not([data-mark]) { background: ${selection}; color: ${selectionFg}; }
.oc-sdk-option-check { color: ${fg}; }
.oc-sdk-option[data-destructive="true"] { color: ${errorText}; }
.oc-sdk-option[data-destructive="true"][data-active="true"] { background: ${mix(v("status-error", "red"), 10)}; }
.oc-sdk-option-hint { color: ${muted}; }
.oc-sdk-popup-empty { color: ${muted}; }

/* Checked stays neutral: the mark carries the state, and the primary colour stays with primary actions. */
.oc-sdk-check-box { border-color: ${border}; border-radius: 4px; color: ${fg}; transition: border-color 150ms ease-out; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-box { border-color: ${mix(fg, 60, border)}; }
.oc-sdk-check-thumb { border-radius: 9999px; background: ${border}; transition: background 150ms ease-out; }
.oc-sdk-check-thumb::after { border-radius: 9999px; background: ${bg}; transition: transform 150ms ease-out; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-thumb { background: ${primary}; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-thumb::after { transform: translateX(16px); }
.oc-sdk-check:focus-visible { box-shadow: none; }
.oc-sdk-check:focus-visible .oc-sdk-check-box, .oc-sdk-check:focus-visible .oc-sdk-check-thumb { ${focusFill} }
.oc-sdk-check-desc { color: ${muted}; }

.oc-sdk-tabs { border-radius: 10px; }
.oc-sdk-tabs[data-track="true"] { background: ${mix(fg, 4)}; box-shadow: inset 0 1px 2px 0 rgb(0 0 0 / 0.16); }
.oc-sdk-tab { border-radius: 8px; color: ${muted}; transition: color 150ms ease-out, background 150ms ease-out; }
.oc-sdk-tab:hover { color: ${fg}; }
.oc-sdk-tab[aria-selected="true"] { color: ${selectionFg}; background: ${selection}; border-color: ${border}; }
.oc-sdk-tabs[data-track="true"] .oc-sdk-tab[aria-selected="true"] { color: ${elevatedFg}; background: var(--oc-sdk-raised-bg); ${raised} }
.oc-sdk-tab-count { color: ${muted}; }

/* The app's neutral badge: a step of the text colour, the same in every theme. */
.oc-sdk-badge { border-radius: 9999px; background: ${mix(fg, 6)}; color: ${muted}; }
.oc-sdk-badge[data-tone] { color: var(--oc-sdk-tone-text, var(--oc-sdk-tone)); background: ${mix("var(--oc-sdk-tone)", 15)}; }

.oc-sdk-row { border-radius: 6px; transition: background 120ms ease-out; }
.oc-sdk-row:hover, .oc-sdk-row[data-active="true"] { background: ${hover}; }
.oc-sdk-row[aria-selected="true"] { background: ${selection}; color: ${selectionFg}; }
.oc-sdk-row-lead { font-family: ${mono}; color: ${muted}; }
.oc-sdk-row-sub { color: ${muted}; }
.oc-sdk-row-meta { color: ${muted}; }
.oc-sdk-row[aria-selected="true"] .oc-sdk-row-lead, .oc-sdk-row[aria-selected="true"] .oc-sdk-row-sub, .oc-sdk-row[aria-selected="true"] .oc-sdk-row-meta { color: inherit; opacity: .75; }
.oc-sdk-list-empty { color: ${muted}; }

.oc-sdk-empty-body { color: ${muted}; }

.oc-sdk-spinner { color: ${muted}; }
.oc-sdk-spinner-ring { border-color: ${border}; border-top-color: ${primary}; border-radius: 9999px; }

/* Set apart by its tint alone, like the app's banners. */
.oc-sdk-banner { border-color: transparent; border-radius: 8px; background: ${mix("var(--oc-sdk-tone)", 10)}; }
.oc-sdk-banner-title { color: var(--oc-sdk-tone-text, var(--oc-sdk-tone)); }
.oc-sdk-banner-body { color: ${muted}; }

.oc-sdk-separator { color: ${muted}; }
.oc-sdk-separator::before, .oc-sdk-separator::after { background: ${mix(border, 40)}; }

.oc-sdk-progress-label { color: ${muted}; }
/* The app's progress: a groove a step of the text colour, green once done. Older bundles mark done only through aria-valuenow. */
.oc-sdk-progress-track { border-radius: 9999px; background: ${mix(fg, 6)}; }
.oc-sdk-progress-fill { border-radius: 9999px; background: var(--oc-sdk-tone, ${primary}); }
.oc-sdk-progress-track[aria-valuenow="100"] > .oc-sdk-progress-fill:not([data-tone]) { background: ${v("status-success", "currentColor")}; }
.oc-sdk-progress[data-done="true"] .oc-sdk-progress-value { color: ${v("success-text", "inherit")}; }

.oc-sdk-text a { color: ${primaryText}; text-decoration: underline; text-underline-offset: 2px; }
.oc-sdk-text img { border-radius: 8px; border: 1px solid ${mix(border, 60)}; }
`;
  var UI_CSS = `
${GUEST_SCROLLBAR_CSS}
${UI_SIZE_CSS}
${GUEST_UI_LOOK_CSS}`;

  // src/main.js
  var host = connectHost();
  var TAU = Math.PI * 2;
  var STEP = 1 / 240;
  var BEST_KEY = "brick-breaker:best";
  var SOUND_KEY = "brick-breaker:sound";
  var RUN_KEY = "brick-breaker:run";
  var MAX_BALLS = 81;
  var PARAMS = new URLSearchParams(window.location.search);
  var PLAY = PARAMS.has("play") || PARAMS.has("auto");
  var AUTO = PARAMS.has("auto") || PARAMS.has("autopilot");
  var GOD = PARAMS.has("god");
  var DBG = PARAMS.has("dbg");
  var SIM = Math.max(1, Math.min(600, Number(PARAMS.get("sim")) || 1));
  var STEPS = Math.max(0, Math.min(2e5, Number(PARAMS.get("steps")) || 0));
  var START_LEVEL = Math.max(1, Math.min(999, Number(PARAMS.get("level")) || 1));
  var DROP_ALL = PARAMS.get("drop");
  var C = {
    ink: "#0d0f12",
    panel: "#16191e",
    bone: "#d9dee4",
    dim: "rgba(217, 222, 228, 0.5)",
    line: "rgba(217, 222, 228, 0.16)",
    white: "#e6e3db",
    sand: "#d8a64e",
    rust: "#c96b5e",
    orange: "#dd8448",
    steel: "#6b6660",
    ball: "#f2f4f7",
    accent: "#b5ac9d",
    danger: "#a96a6a"
  };
  var POWERS = {
    split: { label: "SPLIT", short: "S", color: C.white, dur: 0 },
    life: { label: "LIFE", short: "L", color: C.rust, dur: 0 }
  };
  var LEVELS = [
    {
      rows: [
        "......111......",
        ".....11111.....",
        "...C1111111C...",
        "...111111111...",
        "..11111111111..",
        ".1111111111111.",
        ".1111111111111.",
        "...............",
        "XX..XXX..XXX..X"
      ]
    },
    {
      rows: [
        ".1111111111111.",
        ".111111C111111.",
        "..11111111111..",
        "...111111111...",
        "...C1111111....",
        ".....11111.....",
        "......111......",
        "...............",
        "XXX...XXX...XXX"
      ]
    },
    {
      rows: [
        "1.1.1.1C1.1.1.1",
        ".1.1.1.1.1.1.1.",
        "1.1.1.1.1.1.1.1",
        ".1.1.1.1.1.1.1.",
        "1.1C1.1.1.1.1.1",
        ".1.1.1.1.1.C.1.",
        "1.1.1.1.1.1.1.1",
        "...............",
        "X..XXX..XXX..XX"
      ]
    },
    {
      rows: [
        ".....11111.....",
        "....1111111....",
        "...2211C1122...",
        "..2C1111111C2..",
        "...221111122...",
        "....1111111....",
        ".....11111.....",
        "...............",
        "3333...3...3333"
      ]
    },
    {
      rows: [
        "111111111111111",
        "111C1111111C111",
        "111111111111111",
        "111111111111111",
        "111111111111111",
        "111111111111111",
        "111111111111111",
        "...............",
        "XXXX..XXX..XXXX"
      ]
    },
    {
      rows: [
        "111111111111111",
        "111..11111..111",
        "222..11C11..222",
        "222..11111..222",
        "2C2..11111..2C2",
        "111..11111..111",
        "111..11111..111",
        "...............",
        "XXX..XXX...X.XX"
      ]
    },
    {
      rows: [
        ".11111...11111.",
        "..11111.11111..",
        "...111C1C111...",
        "....1111111....",
        ".....11111.....",
        "..1.1111111.1..",
        "...111111111...",
        "...............",
        "XX..XX..XX..XXX"
      ]
    },
    {
      rows: [
        "111111111111111",
        "111111111111111",
        "211133333331112",
        "2111111C1111112",
        "211C1111111E112",
        "111111111111111",
        "111111111111111",
        "...............",
        "XXXX..XXX..XXXX"
      ]
    },
    {
      rows: [
        ".1...1...1...1.",
        ".111111C111111.",
        ".1...1...1...1.",
        ".1111C11111111.",
        ".1...1...1...1.",
        ".1111111111111.",
        ".1...1...1...1.",
        "...............",
        "XX...XXX..XX..X"
      ]
    },
    {
      rows: [
        "111111111111111",
        "11111.....11111",
        "11111..C..11111",
        "11111.....11111",
        "22222..C..22222",
        "11111.....11111",
        "11111.....11111",
        "...............",
        "XXXXX.....XXXXX"
      ]
    },
    {
      rows: [
        "....1111111....",
        "...1111C1111...",
        "..22221112222..",
        ".222211C112222.",
        "..22221112222..",
        "...E1111111E...",
        "....1111111....",
        "...............",
        "XXX..XXX...XXXX"
      ]
    },
    {
      rows: [
        "111111111111111",
        "1C1111...1111C1",
        "11111..C..11111",
        "1111.......1111",
        "11222.....22211",
        "11111.....11111",
        "1.111.....111.1",
        "...............",
        "XX..XXX..XX..XX"
      ]
    },
    {
      rows: [
        "....1111111....",
        "..11111111111..",
        ".111111C111111.",
        ".1111111111111.",
        ".11C1111111C11.",
        ".1111111111111.",
        "..11111111111..",
        "...............",
        "XXXX...XX..XXXX"
      ]
    },
    {
      rows: [
        "1111..1111..111",
        "11..C111..1111.",
        "..1111..1111..1",
        "1111..1111C.111",
        "11..1111..1111.",
        "..1111.C1111..1",
        "1111..1111..111",
        "...............",
        "XX..XX...XX..XX"
      ]
    },
    {
      rows: [
        "111111111111111",
        "..111.1C1.111..",
        "..222.111.222..",
        "1111111C1111111",
        "..222.111.222..",
        "..111.1E1.111..",
        "..111.111.111..",
        "...............",
        "XXX..XXXX..XXXX"
      ]
    },
    {
      rows: [
        "....1111111....",
        "..11111111111..",
        ".211C.....E112.",
        ".211...C...112.",
        ".2111.....1112.",
        "..11111111111..",
        "....1111111....",
        "...............",
        "XXXXX..XX..XXXX"
      ]
    },
    {
      rows: [
        "111111111111111",
        "111.........111",
        "11C11.....11C11",
        "1111111.1111111",
        "1111111C1111111",
        "111111111111111",
        "111111111111111",
        "...............",
        "XX..XXX..XX..XX"
      ]
    },
    {
      rows: [
        "1111111C1111111",
        "111111111111111",
        "222....C....222",
        "222.........222",
        "222.111C111.222",
        "111.........111",
        "...............",
        "...............",
        "XXXX..XXX..XXXX"
      ]
    },
    {
      rows: [
        "...............",
        "..11.11.11.....",
        ".11..11C1...11.",
        ".1.111...11.11.",
        "...11C11.1..111",
        ".111..11..1E.1.",
        ".1..111.111.11.",
        "....1...1...1..",
        "333..33..33..33"
      ]
    },
    {
      rows: [
        "111111111111111",
        "1111111C1111111",
        "111111111111111",
        "11C222222222C11",
        "111222333222111",
        "1112E22222E2111",
        "111111111111111",
        "1111111E1111111",
        "...............",
        "XXXX..XXX..XXXX"
      ]
    },
    {
      cols: 27,
      rows: [
        ".1111111111111111111111.111",
        "11111.111111111111111111111",
        "1111111111.11C1111111111111",
        "112111111111111.11111111111",
        "11111111111111111211.111111",
        "11.1111111111111111111111.1",
        "11112C1.1111111111131C11111",
        "111111111111.11111121111111",
        "11111111111111111.111111111",
        "1111112111111111111111.1111",
        "1111.1111111111111111211111",
        "111111311.11111111111111111",
        "11111111211111.111111111111",
        "1111111111111111111.1112111",
        "1.1111111111111111111111.11",
        "111111.11121111111111111111",
        "11111111111.111111111111121",
        "1111111111111111.1111111131",
        "111111111111211111111.11111",
        "111.1111111111111111111111.",
        "11111111.111111111111111111",
        "1111111111111.2111111111111",
        "111111111111311111.11111111",
        ".2111111111111111111111.111",
        "11111.111111111121111111111",
        "1111111111.1111111111111111",
        "111211111111111.11111111111",
        "11111111111111111121.111111",
        "11.1111111111111111111111.1",
        "1111121.1111111111111111111",
        "111111111111.11111112111111",
        "11111111111111111.111111111",
        "11111111E111111111E111.1111",
        "1111.1111111111111111111111",
        "111111111.11111111111111111",
        "1111111111111E.111111111111",
        "1111E11111111111111.11E1111",
        "1.1111111111111111111111.11",
        "111111.11111111111111111111",
        "XXXX...XXXXX...XXXXX...XXXX"
      ]
    },
    {
      cols: 30,
      rows: [
        "111111111111111111111111111111",
        "111111111111111111111111111111",
        "1111.11111111.1C111111.1111111",
        "1121.11111111.11111111.1111111",
        "1111.11111111.11121111.1111111",
        "..............................",
        "1111.11111111.11111311.1111111",
        "1111.C1111111.11111211.1C11111",
        "1111.11111111.11111111.1111111",
        "1111.12111111.11111111.1111111",
        "1111.11111111.11111112.1111111",
        "1111.13111111.11111111.1111111",
        "1111.11121111.11111111.1111111",
        "1111.11111111.11111111.2111111",
        "1111.11111111.11111111.1111111",
        "..............................",
        "1111.11111111.11111111.1121111",
        "1111.11111111.11111111.1131111",
        "1111.11111112.11111111.1111111",
        "1111.11111111.11111111.1111211",
        "1111.11111111.11111111.1111111",
        "1111.11111111.21111111.1111111",
        "1111.11111113.11111111.1111112",
        "1211.11111111.11111111.1111111",
        "1111.11111111.11211111.1111111",
        "..............................",
        "1112.11111111.11111111.1111111",
        "1111.11111111.11112111.1111111",
        "1111.11111111.11111111.1111111",
        "1111.21111111.11111111.1111111",
        "1111.11111111.11111121.1111111",
        "111E.11111111.11111111.1111E11",
        "1111.11211111.11111111.1111111",
        "1111.11111111.11113111.1111111",
        "1111.11E11111.11111111E1111111",
        "..............................",
        "1111.11111111.11111111.1111111",
        "1111.11111111.E1111111.1111111",
        "1111.11111111.111E1111.1111111",
        "1111.11111111.11111111.1111111",
        "1111.11111111.11111111.1111111",
        "XXXXX...XXXXXX...XXXXXX...XXXX"
      ]
    }
  ];
  function clamp(v2, min, max) {
    return Math.max(min, Math.min(max, v2));
  }
  function rand(min, max) {
    return min + Math.random() * (max - min);
  }
  function pad2(n) {
    return String(n).padStart(2, "0");
  }
  function fmt(n) {
    return Math.round(n).toLocaleString("en-US");
  }
  function hexToRgb(hex) {
    var v2 = parseInt(hex.slice(1), 16);
    return [v2 >> 16 & 255, v2 >> 8 & 255, v2 & 255];
  }
  function rgba(hex, a) {
    var c = hexToRgb(hex);
    return "rgba(" + c[0] + ", " + c[1] + ", " + c[2] + ", " + a + ")";
  }
  function rng(seed) {
    var s = Math.floor(seed) % 2147483647;
    if (s <= 0) s += 2147483646;
    return function() {
      s = s * 16807 % 2147483647;
      return (s - 1) / 2147483646;
    };
  }
  var $ = function(id) {
    return document.getElementById(id);
  };
  var stage = $("stage");
  var canvas = $("play");
  var ctx = canvas.getContext("2d", { alpha: false });
  var scoreEl = $("score");
  var bestEl = $("best");
  var comboEl = $("combo");
  var levelEl = $("level");
  var livesEl = $("lives");
  var powersEl = $("powers");
  var gate = $("gate");
  var gateBest = $("gate-best");
  var gateSave = $("gate-save");
  var startBtn = $("start");
  var continueBtn = $("continue");
  var levelsBtn = $("levels");
  var pauseLevelsBtn = $("pause-levels");
  var levelScreen = $("levelScreen");
  var levelGrid = $("level-grid");
  var levelBack = $("level-back");
  var pauseScreen = $("pauseScreen");
  var resumeBtn = $("resume");
  var restartLevelBtn = $("restart-level");
  var quitBtn = $("quit");
  var overScreen = $("overScreen");
  var overTitle = $("over-title");
  var overKicker = $("over-kicker");
  var overScore = $("over-score");
  var overBest = $("over-best");
  var overLevel = $("over-level");
  var againBtn = $("again");
  var soundBtn = $("sound");
  var pauseBtn = $("pause");
  var banner = $("banner");
  var bannerTitle = $("banner-title");
  var bannerSub = $("banner-sub");
  var hint = $("hint");
  var loading = $("loading");
  var S = {
    mode: "menu",
    w: 420,
    h: 720,
    scale: 1,
    dpr: 1,
    unit: 1,
    L: 10,
    R: 410,
    cols: 15,
    mega: false,
    layout: null,
    ballR: 5.4,
    level: 1,
    score: 0,
    best: 0,
    lives: 3,
    bricks: [],
    grid: /* @__PURE__ */ new Map(),
    remaining: 0,
    balls: [],
    drops: [],
    orbs: [],
    particles: [],
    pops: [],
    paddle: {
      x: 210,
      y: 660,
      w: 74,
      h: 11,
      baseW: 74,
      targetW: 74,
      targetX: 210,
      vx: 0
    },
    combo: 0,
    comboTimer: 0,
    respawn: 0,
    shake: 0,
    flash: 0,
    clock: 0,
    bannerTimer: 0,
    nextTimer: 0,
    serveStamp: 0,
    newBest: false,
    savedRun: null,
    lastSaveAt: 0,
    sound: true,
    keys: { left: false, right: false }
  };
  var hudCache = {
    score: "",
    best: "",
    level: "",
    lives: -1,
    combo: "",
    powers: "",
    mode: ""
  };
  var Sound = {
    ac: null,
    master: null,
    noiseBuf: null,
    ensure: function() {
      if (!this.ac) {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        this.ac = new AC();
        this.master = this.ac.createGain();
        this.master.gain.value = 0.5;
        this.master.connect(this.ac.destination);
      }
      if (this.ac.state === "suspended") {
        void this.ac.resume();
      }
      return this.ac;
    },
    ready: function() {
      if (!S.sound) return null;
      return this.ensure();
    },
    tone: function(freq, dur, type, gain, to, delay) {
      var ac = this.ready();
      if (!ac) return;
      dur = dur || 0.08;
      type = type || "square";
      gain = gain || 0.04;
      var t = ac.currentTime + (delay || 0);
      var o = ac.createOscillator();
      var g = ac.createGain();
      o.type = type;
      o.frequency.setValueAtTime(Math.max(20, freq), t);
      if (to) {
        o.frequency.exponentialRampToValueAtTime(Math.max(20, to), t + dur);
      }
      g.gain.setValueAtTime(1e-4, t);
      g.gain.exponentialRampToValueAtTime(gain, t + 6e-3);
      g.gain.exponentialRampToValueAtTime(1e-4, t + dur);
      o.connect(g);
      g.connect(this.master);
      o.start(t);
      o.stop(t + dur + 0.03);
    },
    noise: function(dur, gain, freq, delay) {
      var ac = this.ready();
      if (!ac) return;
      if (!this.noiseBuf) {
        var len = Math.floor(ac.sampleRate * 0.5);
        this.noiseBuf = ac.createBuffer(1, len, ac.sampleRate);
        var data = this.noiseBuf.getChannelData(0);
        for (var i = 0; i < len; i += 1) data[i] = Math.random() * 2 - 1;
      }
      var t = ac.currentTime + (delay || 0);
      var src = ac.createBufferSource();
      src.buffer = this.noiseBuf;
      var filter = ac.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = freq || 900;
      filter.Q.value = 1.1;
      var g = ac.createGain();
      g.gain.setValueAtTime(gain || 0.08, t);
      g.gain.exponentialRampToValueAtTime(1e-4, t + dur);
      src.connect(filter);
      filter.connect(g);
      g.connect(this.master);
      src.start(t);
      src.stop(t + dur);
    },
    paddle: function() {
      if (S.balls.length > 30) return;
      this.tone(210, 0.07, "square", 0.042, 330);
    },
    wall: function() {
      if (S.balls.length > 30) return;
      this.tone(350, 0.035, "triangle", 0.024, 260);
    },
    brick: function(row) {
      if (S.balls.length > 30) return;
      this.tone(410 + row * 26, 0.05, "square", 0.032, 530 + row * 28);
    },
    crack: function() {
      if (S.balls.length > 30) return;
      this.noise(0.14, 0.07, 1300);
      this.tone(540, 0.11, "triangle", 0.036, 240);
    },
    steel: function() {
      if (S.balls.length > 30) return;
      this.tone(1180, 0.09, "triangle", 0.026, 900);
      this.tone(1580, 0.07, "sine", 0.018, 1320, 0.01);
    },
    explode: function() {
      this.noise(0.38, 0.13, 520);
      this.tone(92, 0.4, "sine", 0.09, 38);
    },
    power: function() {
      var notes = [523, 659, 784, 1047];
      for (var i = 0; i < notes.length; i += 1) {
        this.tone(notes[i], 0.09, "triangle", 0.038, 0, i * 0.045);
      }
    },
    frenzy: function() {
      var notes = [330, 440, 554, 660, 880];
      for (var i = 0; i < notes.length; i += 1) {
        this.tone(notes[i], 0.12, "triangle", 0.032, 0, i * 0.055);
      }
      this.noise(0.28, 0.05, 1100);
    },
    lose: function() {
      this.tone(240, 0.5, "sawtooth", 0.065, 70);
      this.tone(120, 0.6, "sine", 0.055, 55, 0.05);
    },
    clear: function() {
      var notes = [392, 523, 659, 784, 1047];
      for (var i = 0; i < notes.length; i += 1) {
        this.tone(notes[i], 0.12, "triangle", 0.04, 0, i * 0.07);
      }
    },
    over: function() {
      this.tone(300, 0.9, "sawtooth", 0.07, 60);
      this.noise(0.8, 0.1, 320);
    },
    ui: function() {
      this.tone(520, 0.05, "triangle", 0.028, 660);
    }
  };
  function readLocal(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }
  function writeLocal(key, value) {
    try {
      window.localStorage.setItem(key, String(value));
    } catch (error) {
    }
  }
  function saveBest() {
    writeLocal(BEST_KEY, S.best);
    try {
      void host.storage.set(BEST_KEY, S.best).catch(function() {
      });
    } catch (error) {
    }
  }
  function loadBest() {
    var raw = Number(readLocal(BEST_KEY));
    if (isFinite(raw) && raw > S.best) S.best = raw;
    gateBest.textContent = fmt(S.best);
    bestEl.textContent = fmt(S.best);
    try {
      void host.storage.get(BEST_KEY).then(function(stored) {
        var value = Number(stored);
        if (isFinite(value) && value > S.best) {
          S.best = value;
          gateBest.textContent = fmt(S.best);
          bestEl.textContent = fmt(S.best);
          updateHud();
        }
      }).catch(function() {
      });
    } catch (error) {
    }
  }
  function parseRun(raw) {
    if (!raw) return null;
    var value = raw;
    if (typeof value === "string") {
      try {
        value = JSON.parse(value);
      } catch (error) {
        return null;
      }
    }
    if (!value || typeof value !== "object") return null;
    var level = Math.floor(Number(value.level));
    var score = Number(value.score);
    var lives = Math.floor(Number(value.lives));
    if (!isFinite(level) || level < 1 || level > 9999) return null;
    if (!isFinite(score) || score < 0) return null;
    if (!isFinite(lives) || lives < 1 || lives > 5) return null;
    return {
      level,
      score: Math.round(score),
      lives,
      savedAt: Number(value.savedAt) || 0
    };
  }
  function saveRun(levelOverride) {
    if (S.mode !== "playing" && S.mode !== "paused" && S.mode !== "cleared") return;
    var level = levelOverride ? Math.floor(levelOverride) : S.level;
    level = clamp(level, 1, 9999);
    var run = {
      level,
      score: S.score,
      lives: S.lives,
      savedAt: Date.now()
    };
    S.savedRun = run;
    S.lastSaveAt = S.clock;
    writeLocal(RUN_KEY, JSON.stringify(run));
    try {
      void host.storage.set(RUN_KEY, run).catch(function() {
      });
    } catch (error) {
    }
  }
  function clearRun() {
    S.savedRun = null;
    try {
      window.localStorage.removeItem(RUN_KEY);
    } catch (error) {
    }
    try {
      void host.storage.delete(RUN_KEY).catch(function() {
      });
    } catch (error) {
    }
    updateGateRun();
  }
  function loadRun() {
    S.savedRun = parseRun(readLocal(RUN_KEY));
    updateGateRun();
    try {
      void host.storage.get(RUN_KEY).then(function(stored) {
        var remote = parseRun(stored);
        if (remote && (!S.savedRun || remote.savedAt >= S.savedRun.savedAt)) {
          S.savedRun = remote;
          updateGateRun();
        }
      }).catch(function() {
      });
    } catch (error) {
    }
  }
  function updateGateRun() {
    var run = S.savedRun;
    if (run) {
      continueBtn.hidden = false;
      continueBtn.textContent = "CONTINUE " + pad2(run.level);
      continueBtn.classList.add("primary");
      startBtn.classList.remove("primary");
      startBtn.textContent = "\u91CD\u65B0\u5F00\u59CB";
      gateSave.hidden = false;
      gateSave.textContent = "SAVED \xB7 LEVEL " + pad2(run.level) + " \xB7 " + fmt(run.score) + " PTS \xB7 " + run.lives + " LIVES";
    } else {
      continueBtn.hidden = true;
      continueBtn.classList.remove("primary");
      startBtn.classList.add("primary");
      startBtn.textContent = "\u5F00\u59CB\u6E38\u620F";
      gateSave.hidden = true;
    }
  }
  function resumeRun() {
    var run = S.savedRun;
    if (!run) return;
    S.score = run.score;
    S.lives = clamp(run.lives, 1, 5);
    S.level = run.level;
    S.newBest = false;
    enterLevel(run.level);
    Sound.ensure();
    Sound.ui();
  }
  function saveSound() {
    writeLocal(SOUND_KEY, S.sound ? "1" : "0");
    try {
      void host.storage.set(SOUND_KEY, S.sound).catch(function() {
      });
    } catch (error) {
    }
  }
  function loadSound() {
    var raw = readLocal(SOUND_KEY);
    if (raw === "0") S.sound = false;
    syncSoundButton();
    try {
      void host.storage.get(SOUND_KEY).then(function(stored) {
        if (stored === "0" || stored === 0 || stored === false) {
          S.sound = false;
          syncSoundButton();
        }
      }).catch(function() {
      });
    } catch (error) {
    }
  }
  function resize() {
    var rect = stage.getBoundingClientRect();
    var width = Math.max(240, rect.width || 360);
    var height = Math.max(320, rect.height || 640);
    S.dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    var scale = width / 420;
    var h = height / scale;
    if (h > 820) {
      scale = height / 820;
      h = 820;
    } else if (h < 620) {
      scale = height / 620;
      h = 620;
    }
    S.scale = scale;
    S.w = width / scale;
    S.h = h;
    S.unit = S.w / 420;
    S.L = Math.max(8, S.w * 0.024);
    S.R = S.w - S.L;
    canvas.width = Math.round(width * S.dpr);
    canvas.height = Math.round(height * S.dpr);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    var p = S.paddle;
    p.baseW = clamp(S.w * 0.188, 72, 145);
    p.h = clamp(S.w * 0.026, 9, 14);
    p.y = S.h - Math.max(44, S.h * 0.056);
    p.targetW = p.baseW;
    p.w = clamp(p.w || p.baseW, p.baseW, p.baseW * 1.55);
    p.x = clamp(p.x || S.w / 2, S.L + p.w / 2, S.R - p.w / 2);
    p.targetX = clamp(p.targetX || p.x, S.L + p.w / 2, S.R - p.w / 2);
    S.ballR = clamp(S.w * 0.0102, 3.6, 5.4);
    layoutBricks();
    for (var i = 0; i < S.balls.length; i += 1) {
      var b = S.balls[i];
      b.r = S.ballR;
      b.x = clamp(b.x, S.L + b.r, S.R - b.r);
      if (b.stuck) {
        b.x = clamp(p.x + (b.offset || 0), S.L + b.r, S.R - b.r);
        b.y = p.y - b.r - 2;
      } else {
        b.y = Math.min(b.y, S.h - 12);
      }
    }
    for (var d = 0; d < S.drops.length; d += 1) {
      S.drops[d].y = Math.min(S.drops[d].y, S.h - 12);
    }
  }
  function layoutBricks() {
    var margin = Math.max(9, S.w * 0.024);
    var gap = clamp(S.w * 52e-4, 1.8, 4);
    var bw = (S.w - margin * 2 - gap * (S.cols - 1)) / S.cols;
    var bh = clamp(bw * 0.52, 10, 20);
    var maxRow = 0;
    for (var r = 0; r < S.bricks.length; r += 1) {
      maxRow = Math.max(maxRow, S.bricks[r].r);
    }
    var wallTop = S.h * 0.46;
    var top = Math.max(84, wallTop - maxRow * (bh + gap));
    S.layout = { margin, gap, bw, bh, top };
    for (var i = 0; i < S.bricks.length; i += 1) {
      var k = S.bricks[i];
      k.w = bw;
      k.h = bh;
      k.x = margin + k.c * (bw + gap);
      k.y = top + k.r * (bh + gap);
    }
  }
  function brickColor(k) {
    if (k.type === "steel") return C.steel;
    if (k.type === "core") return C.bone;
    if (k.type === "explosive") return C.orange;
    if (k.maxHp >= 3) return C.rust;
    if (k.maxHp >= 2) return C.sand;
    return C.white;
  }
  function buildBricks() {
    S.bricks = [];
    S.grid = /* @__PURE__ */ new Map();
    S.remaining = 0;
    var def = LEVELS[(S.level - 1) % LEVELS.length];
    S.cols = def.cols || 15;
    S.mega = S.cols > 20;
    var tier = Math.floor((S.level - 1) / LEVELS.length);
    for (var r = 0; r < def.rows.length; r += 1) {
      var row = def.rows[r].padEnd(S.cols, ".").slice(0, S.cols);
      for (var c = 0; c < S.cols; c += 1) {
        var ch = row[c];
        if (ch === "." || ch === " ") continue;
        var type = "normal";
        var hp = 1;
        if (ch === "X") {
          type = "steel";
          hp = Infinity;
        } else if (ch === "C") {
          type = "core";
          hp = 1;
        } else if (ch === "E") {
          type = "explosive";
          hp = 1;
        } else {
          hp = clamp(Number(ch) + tier, 1, 5);
        }
        var k = {
          c,
          r,
          type,
          hp,
          maxHp: hp,
          alive: true,
          flash: 0,
          exploded: false,
          seed: Math.random() * 1e5,
          x: 0,
          y: 0,
          w: 0,
          h: 0
        };
        k.color = brickColor(k);
        S.bricks.push(k);
        S.grid.set(c + ":" + r, k);
        if (type !== "steel") S.remaining += 1;
      }
    }
    layoutBricks();
  }
  function baseSpeed() {
    return Math.min(530, 338 + (S.level - 1) * 11) * clamp(S.w / 420, 1, 1.25);
  }
  function comboMult() {
    return Math.min(5, 1 + Math.floor(S.combo / 4));
  }
  function serveBall() {
    var p = S.paddle;
    var spread = [-0.24, 0, 0.24];
    S.balls = [];
    for (var i = 0; i < 3; i += 1) {
      var offset = (i - 1) * S.ballR * 3.2;
      S.balls.push({
        x: clamp(p.x + offset, S.L + S.ballR, S.R - S.ballR),
        y: p.y - S.ballR - 2,
        r: S.ballR,
        dirx: Math.sin(spread[i]),
        diry: -Math.cos(spread[i]),
        speed: baseSpeed(),
        stuck: true,
        aim: spread[i],
        offset,
        trail: [],
        dead: false
      });
    }
    S.serveStamp = S.clock;
    S.respawn = 0;
  }
  function launchBalls() {
    var launched = false;
    var p = S.paddle;
    for (var i = 0; i < S.balls.length; i += 1) {
      var b = S.balls[i];
      if (!b.stuck) continue;
      var off = (b.aim || 0) + rand(-0.04, 0.04) + clamp(p.vx * 18e-5, -0.2, 0.2);
      b.dirx = Math.sin(off);
      b.diry = -Math.cos(off);
      b.speed = baseSpeed();
      b.stuck = false;
      b.trail = [];
      launched = true;
    }
    if (launched) {
      Sound.paddle();
      S.flash = 0.18;
    }
  }
  function startRun(level) {
    var target = level ? clamp(Math.floor(level), 1, LEVELS.length) : START_LEVEL > 1 ? START_LEVEL : 1;
    S.score = 0;
    S.level = target;
    S.lives = 3;
    S.combo = 0;
    S.comboTimer = 0;
    S.newBest = false;
    S.savedRun = null;
    try {
      window.localStorage.removeItem(RUN_KEY);
    } catch (error) {
    }
    S.particles = [];
    S.pops = [];
    enterLevel(S.level);
  }
  function enterLevel(n) {
    S.level = Math.max(1, Math.floor(n));
    S.mode = "playing";
    S.combo = 0;
    S.comboTimer = 0;
    S.drops = [];
    S.orbs = [];
    S.particles = [];
    S.pops = [];
    S.respawn = 0;
    S.shake = 0;
    S.flash = 0;
    S.nextTimer = 0;
    buildBricks();
    var p = S.paddle;
    p.x = S.w / 2;
    p.targetX = p.x;
    p.targetW = p.baseW;
    p.w = p.baseW;
    p.vx = 0;
    serveBall();
    hideScreens();
    hint.classList.remove("dim");
    var tier = Math.floor((S.level - 1) / LEVELS.length);
    if (!S.mega) showBanner("LEVEL " + pad2(S.level), tier > 0 ? "HP +" + tier : "", 1.6);
    if (DROP_ALL) debugDrops();
    updateHud();
    saveRun();
  }
  function restartLevel() {
    if (S.mode === "menu") {
      startRun();
      return;
    }
    enterLevel(S.level);
  }
  function toMenu() {
    S.mode = "menu";
    S.score = 0;
    S.lives = 3;
    S.combo = 0;
    S.comboTimer = 0;
    S.drops = [];
    S.orbs = [];
    S.particles = [];
    S.pops = [];
    S.level = 1;
    buildBricks();
    var p = S.paddle;
    p.x = S.w / 2;
    p.targetX = p.x;
    p.w = p.baseW;
    p.targetW = p.baseW;
    p.vx = 0;
    serveBall();
    S.balls[0].speed = 0;
    show(gate);
    gateBest.textContent = fmt(S.best);
    hint.classList.add("dim");
    banner.hidden = true;
    updateHud();
    updateGateRun();
  }
  function pauseGame() {
    if (S.mode !== "playing") return;
    S.mode = "paused";
    saveRun();
    show(pauseScreen);
    hint.classList.add("dim");
    Sound.ui();
  }
  function resumeGame() {
    if (S.mode !== "paused") return;
    S.mode = "playing";
    hideScreens();
    hint.classList.remove("dim");
    Sound.ui();
  }
  function togglePause() {
    if (S.mode === "playing") pauseGame();
    else if (S.mode === "paused") resumeGame();
  }
  function quitToMenu() {
    saveRun();
    saveBest();
    show(gate);
    toMenu();
    Sound.ui();
  }
  function gameOver() {
    if (S.mode === "over") return;
    S.mode = "over";
    S.orbs = [];
    clearRun();
    saveBest();
    Sound.over();
    hint.classList.add("dim");
    overScore.textContent = fmt(S.score);
    overBest.innerHTML = "BEST <b>" + fmt(S.best) + "</b>";
    overBest.classList.toggle("record", S.newBest);
    overLevel.textContent = "LEVEL " + pad2(S.level);
    overTitle.textContent = S.newBest ? "NEW RECORD" : "GAME OVER";
    overKicker.textContent = "RESULT";
    show(overScreen);
    updateHud();
  }
  function loseLife() {
    if (GOD) {
      serveBall();
      return;
    }
    S.lives = Math.max(0, S.lives - 1);
    S.combo = 0;
    S.comboTimer = 0;
    S.shake = 18;
    S.flash = 0.5;
    Sound.lose();
    updateHud();
    if (S.lives <= 0) {
      gameOver();
      return;
    }
    saveRun();
    showBanner("MISS", S.lives + " LIVES LEFT", 1.1);
    S.respawn = 0.85;
  }
  function clearLevel() {
    if (S.mode !== "playing") return;
    S.mode = "cleared";
    var bonus = 400 + S.level * 125 + S.lives * 45;
    S.score += bonus;
    noteScore();
    saveBest();
    Sound.clear();
    S.shake = 12;
    S.flash = 0.35;
    S.balls = [];
    S.orbs = [];
    S.drops = [];
    showBanner("LEVEL CLEAR", "+" + fmt(bonus) + " \xB7 NEXT", 2.2);
    S.nextTimer = 2.1;
    updateHud();
    saveRun(S.level + 1);
  }
  function noteScore() {
    if (S.score > S.best) {
      S.best = S.score;
      S.newBest = true;
    }
  }
  function updatePaddle(dt) {
    var p = S.paddle;
    if (AUTO && S.mode === "playing") {
      var target = null;
      for (var i = 0; i < S.balls.length; i += 1) {
        var b = S.balls[i];
        if (b.stuck) continue;
        if (!target || b.y > target.y) target = b;
      }
      if (target) p.targetX = target.x + (target.dirx >= 0 ? 1 : -1) * 12 * S.unit;
      for (var j = 0; j < S.balls.length; j += 1) {
        if (S.balls[j].stuck && S.clock - S.serveStamp > 0.55) {
          launchBalls();
          break;
        }
      }
    }
    if (S.keys.left) p.targetX -= 780 * S.unit * dt;
    if (S.keys.right) p.targetX += 780 * S.unit * dt;
    p.targetX = clamp(p.targetX, S.L + p.w / 2, S.R - p.w / 2);
    p.targetW = p.baseW;
    p.w += (p.targetW - p.w) * Math.min(1, dt * 10);
    var maxSpeed = 3400 * S.unit;
    var dx = clamp(p.targetX - p.x, -maxSpeed * dt, maxSpeed * dt);
    p.vx = dx / dt;
    p.x = clamp(p.x + dx, S.L + p.w / 2, S.R - p.w / 2);
    p.targetX = clamp(p.targetX, S.L + p.w / 2, S.R - p.w / 2);
  }
  function stepBall(b, dt) {
    b.x += b.dirx * b.speed * dt;
    b.y += b.diry * b.speed * dt;
    b.trail.push({ x: b.x, y: b.y });
    if (b.trail.length > 16) b.trail.shift();
    var r = b.r;
    if (b.x - r < S.L) {
      b.x = S.L + r;
      b.dirx = Math.abs(b.dirx);
      Sound.wall();
    } else if (b.x + r > S.R) {
      b.x = S.R - r;
      b.dirx = -Math.abs(b.dirx);
      Sound.wall();
    }
    if (b.y - r < 0) {
      b.y = r;
      b.diry = Math.abs(b.diry);
      Sound.wall();
    }
    var p = S.paddle;
    if (b.diry > 0 && b.y + r >= p.y && b.y - r <= p.y + p.h && b.x >= p.x - p.w / 2 - r && b.x <= p.x + p.w / 2 + r) {
      var off = clamp((b.x - p.x) / (p.w / 2), -1, 1);
      var angle = clamp(
        -Math.PI / 2 + off * 1.02 + clamp(p.vx * 18e-5, -0.16, 0.16),
        -Math.PI * 0.86,
        -Math.PI * 0.14
      );
      b.dirx = Math.cos(angle);
      b.diry = Math.sin(angle);
      b.y = p.y - r - 0.5;
      b.speed = Math.min(b.speed * 1.008 + 1.1, baseSpeed() * 1.55);
      Sound.paddle();
      addSparks(b.x, p.y, C.accent, 4);
    }
    collideBricks(b, 1);
    if (b.y - r > S.h + 24) {
      b.dead = true;
      addRing(b.x, S.h - 12, C.danger, 4, 42);
    }
    if (Math.abs(b.diry) < 0.14) {
      b.diry = (b.diry < 0 ? -1 : 1) * 0.14;
      var len = Math.hypot(b.dirx, b.diry) || 1;
      b.dirx /= len;
      b.diry /= len;
    }
  }
  function collideBricks(b, amount) {
    if (!S.layout || !S.grid) return;
    var layout = S.layout;
    var cellW = layout.bw + layout.gap;
    var cellH = layout.bh + layout.gap;
    var col = Math.floor((b.x - layout.margin) / cellW);
    var row = Math.floor((b.y - layout.top) / cellH);
    var r = b.r;
    for (var dr = -1; dr <= 1; dr += 1) {
      for (var dc = -1; dc <= 1; dc += 1) {
        var c = col + dc;
        var rr = row + dr;
        if (c < 0 || c >= S.cols || rr < 0) continue;
        var k = S.grid.get(c + ":" + rr);
        if (!k || !k.alive) continue;
        if (b.x + r < k.x || b.x - r > k.x + k.w || b.y + r < k.y || b.y - r > k.y + k.h) continue;
        var cx = clamp(b.x, k.x, k.x + k.w);
        var cy = clamp(b.y, k.y, k.y + k.h);
        var dx = b.x - cx;
        var dy = b.y - cy;
        if (dx * dx + dy * dy > r * r) continue;
        var ox = k.w / 2 + r - Math.abs(b.x - (k.x + k.w / 2));
        var oy = k.h / 2 + r - Math.abs(b.y - (k.y + k.h / 2));
        if (ox < oy) {
          b.x += b.x < k.x + k.w / 2 ? -ox : ox;
          b.dirx *= -1;
        } else {
          b.y += b.y < k.y + k.h / 2 ? -oy : oy;
          b.diry *= -1;
        }
        damageBrick(k, amount || 1);
        return;
      }
    }
  }
  function damageBrick(k, amount) {
    if (!k.alive || S.mode !== "playing") return;
    k.flash = 1;
    if (k.type === "steel") {
      Sound.steel();
      addSparks(k.x + k.w / 2, k.y + k.h / 2, C.steel, 5);
      S.shake = Math.max(S.shake, 1.6);
      return;
    }
    k.hp -= amount;
    if (k.hp > 0) {
      S.score += 10 * comboMult();
      noteScore();
      addSparks(k.x + k.w / 2, k.y + k.h / 2, k.color, 3);
      Sound.brick(k.r);
      return;
    }
    destroyBrick(k);
  }
  function destroyBrick(k) {
    k.alive = false;
    k.hp = 0;
    S.remaining = Math.max(0, S.remaining - 1);
    S.combo += 1;
    S.comboTimer = 2.6;
    var mult = comboMult();
    var gain = Math.round((45 + 25 * k.maxHp) * mult);
    S.score += gain;
    noteScore();
    addShards(k);
    addPop(k.x + k.w / 2, k.y + k.h / 2, "+" + gain, mult > 1 ? C.sand : C.bone);
    Sound.crack();
    spawnDrop(k);
    if (k.type === "core") triggerFrenzy(k.x + k.w / 2, k.y + k.h / 2);
    if (k.type === "explosive" && !k.exploded) explode(k);
    if (S.remaining === 0) clearLevel();
  }
  function triggerFrenzy(x, y) {
    if (S.mode !== "playing") return;
    var room = 12 - S.orbs.length;
    if (room <= 0) return;
    var count = Math.min(6, room);
    var base = rand(0, TAU);
    var speed = Math.min(660, baseSpeed() * 1.4);
    for (var i = 0; i < count; i += 1) {
      var a = base + i / count * TAU;
      S.orbs.push({
        x,
        y,
        r: Math.max(3.4, S.ballR * 0.76),
        dirx: Math.cos(a),
        diry: Math.sin(a),
        speed,
        life: 7,
        maxLife: 7
      });
    }
    addSparks(x, y, C.sand, 18);
    addPop(x, y - 12, "CORE", C.sand);
    S.shake = Math.max(S.shake, 5);
    S.flash = Math.max(S.flash, 0.16);
    Sound.frenzy();
    showBanner("CORE", "AUTO CLEAR 7s", 1.1);
    updateHud();
  }
  function stepOrb(o, dt) {
    o.life -= dt;
    o.x += o.dirx * o.speed * dt;
    o.y += o.diry * o.speed * dt;
    var r = o.r;
    if (o.x - r < S.L) {
      o.x = S.L + r;
      o.dirx = Math.abs(o.dirx);
    } else if (o.x + r > S.R) {
      o.x = S.R - r;
      o.dirx = -Math.abs(o.dirx);
    }
    if (o.y - r < 0) {
      o.y = r;
      o.diry = Math.abs(o.diry);
    } else if (o.y + r > S.h) {
      o.y = S.h - r;
      o.diry = -Math.abs(o.diry);
    }
    if (Math.abs(o.dirx) < 0.24) {
      o.dirx = (o.dirx < 0 ? -1 : 1) * 0.24;
      var len = Math.hypot(o.dirx, o.diry) || 1;
      o.dirx /= len;
      o.diry /= len;
    }
    collideBricks(o, 2);
  }
  function updateOrbs(dt) {
    for (var i = S.orbs.length - 1; i >= 0; i -= 1) {
      var o = S.orbs[i];
      if (!o) continue;
      stepOrb(o, dt);
      if (S.mode !== "playing") return;
      if (o.life <= 0) S.orbs.splice(i, 1);
    }
  }
  function explode(k) {
    k.exploded = true;
    var cx = k.x + k.w / 2;
    var cy = k.y + k.h / 2;
    addRing(cx, cy, C.orange, 6, 110 * S.unit);
    addSparks(cx, cy, C.sand, 12);
    S.shake = Math.max(S.shake, 10);
    Sound.explode();
    for (var dr = -1; dr <= 1; dr += 1) {
      for (var dc = -1; dc <= 1; dc += 1) {
        if (dr === 0 && dc === 0) continue;
        var n = S.grid.get(k.c + dc + ":" + (k.r + dr));
        if (n && n.alive) damageBrick(n, 2);
      }
    }
  }
  function spawnDrop(k) {
    if (k.type === "core") return;
    if (S.drops.length >= 6) return;
    var chance = k.type === "explosive" ? 0.4 : k.maxHp >= 3 ? 0.3 : k.maxHp >= 2 ? 0.22 : 0.15;
    if (Math.random() > chance) return;
    var kind = Math.random() < 0.85 ? "split" : "life";
    S.drops.push({
      kind,
      x: k.x + k.w / 2,
      y: k.y + k.h / 2,
      vy: 175 + Math.random() * 55,
      w: 30 * S.unit,
      h: 16 * S.unit,
      phase: Math.random() * TAU,
      dead: false
    });
  }
  function debugDrops() {
    var kinds = ["split", "split", "life"];
    var p = S.paddle;
    for (var i = 0; i < kinds.length; i += 1) {
      S.drops.push({
        kind: kinds[i],
        x: S.w * (0.25 + i * 0.25),
        y: p.y - 150 - i % 2 * 45,
        vy: 175,
        w: 30 * S.unit,
        h: 16 * S.unit,
        phase: i,
        dead: false
      });
    }
  }
  function applyPower(kind) {
    var def = POWERS[kind];
    if (!def) return;
    Sound.power();
    addPop(S.paddle.x, S.paddle.y - 26, def.label, def.color);
    if (kind === "life") {
      S.lives = Math.min(5, S.lives + 1);
      updateLives();
      return;
    }
    if (kind === "split") {
      var anyStuck = false;
      for (var i = 0; i < S.balls.length; i += 1) {
        if (S.balls[i].stuck) anyStuck = true;
      }
      if (anyStuck) launchBalls();
      if (S.balls.length === 0 || S.balls.length >= MAX_BALLS) return;
      var source = S.balls.slice();
      var total = Math.min(MAX_BALLS, source.length * 3);
      var next = [];
      var spread = [-0.36, 0, 0.36];
      for (var b = 0; b < source.length; b += 1) {
        var base = source[b];
        var angle = Math.atan2(base.diry, base.dirx);
        for (var n = 0; n < 3 && next.length < total; n += 1) {
          var a = angle + spread[n];
          next.push({
            x: base.x,
            y: base.y,
            r: S.ballR,
            dirx: Math.cos(a),
            diry: Math.sin(a),
            speed: base.speed,
            stuck: false,
            trail: [],
            dead: false
          });
        }
      }
      S.balls = next;
      addSparks(source[0].x, source[0].y, C.white, 12);
      return;
    }
  }
  function updateDrops(dt) {
    var p = S.paddle;
    for (var i = 0; i < S.drops.length; i += 1) {
      var d = S.drops[i];
      d.y += d.vy * dt;
      d.phase += dt * 2.2;
      if (d.y + d.h / 2 > S.h + 20) {
        d.dead = true;
        continue;
      }
      if (d.y + d.h / 2 >= p.y && d.y - d.h / 2 <= p.y + p.h && d.x + d.w / 2 >= p.x - p.w / 2 && d.x - d.w / 2 <= p.x + p.w / 2) {
        d.dead = true;
        applyPower(d.kind);
      }
    }
    S.drops = S.drops.filter(function(d2) {
      return !d2.dead;
    });
  }
  function addShards(k) {
    if (S.particles.length > 480) return;
    var count = k.type === "explosive" ? 14 : 8;
    var cx = k.x + k.w / 2;
    var cy = k.y + k.h / 2;
    for (var i = 0; i < count; i += 1) {
      S.particles.push({
        type: "shard",
        x: cx + rand(-k.w / 2, k.w / 2),
        y: cy + rand(-k.h / 2, k.h / 2),
        vx: rand(-170, 170) * S.unit,
        vy: rand(-190, 90) * S.unit,
        g: 520 * S.unit,
        rot: rand(0, TAU),
        vr: rand(-7, 7),
        w: rand(2, 6) * S.unit,
        h: rand(1.5, 4.5) * S.unit,
        color: i % 4 === 0 ? C.bone : k.color,
        life: rand(0.45, 0.95),
        maxLife: 0.95
      });
    }
  }
  function addSparks(x, y, color, n) {
    if (S.particles.length > 480) return;
    for (var i = 0; i < n; i += 1) {
      var a = rand(0, TAU);
      var sp = rand(60, 230) * S.unit;
      S.particles.push({
        type: "spark",
        x,
        y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp,
        g: 90 * S.unit,
        color,
        life: rand(0.14, 0.34),
        maxLife: 0.34
      });
    }
  }
  function addRing(x, y, color, r0, r1) {
    if (S.particles.length > 480) return;
    S.particles.push({
      type: "ring",
      x,
      y,
      r: r0,
      vr: (r1 - r0) * 2.6,
      color,
      life: 0.42,
      maxLife: 0.42
    });
  }
  function addPop(x, y, text, color) {
    S.pops.push({
      x,
      y,
      text,
      color,
      life: 0.9,
      maxLife: 0.9
    });
    if (S.pops.length > 30) S.pops.shift();
  }
  function updateParticles(dt) {
    for (var i = 0; i < S.particles.length; i += 1) {
      var p = S.particles[i];
      p.life -= dt;
      if (p.type === "ring") {
        p.r += p.vr * dt;
      } else {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += p.g * dt;
        if (p.type === "shard") p.rot += p.vr * dt;
      }
    }
    S.particles = S.particles.filter(function(p2) {
      return p2.life > 0;
    });
    for (var j = 0; j < S.pops.length; j += 1) {
      S.pops[j].y -= 30 * dt * S.unit;
      S.pops[j].life -= dt;
    }
    S.pops = S.pops.filter(function(p2) {
      return p2.life > 0;
    });
  }
  function step(dt) {
    if (S.shake > 0) S.shake = Math.max(0, S.shake - dt * 54);
    if (S.flash > 0) S.flash = Math.max(0, S.flash - dt * 3);
    for (var i = 0; i < S.bricks.length; i += 1) {
      var k = S.bricks[i];
      if (k.flash > 0) k.flash = Math.max(0, k.flash - dt * 4.2);
    }
    if (S.comboTimer > 0) {
      S.comboTimer -= dt;
      if (S.comboTimer <= 0) S.combo = 0;
    }
    updatePaddle(dt);
    if (S.mode !== "playing") return;
    updateOrbs(dt);
    if (S.mode !== "playing") return;
    if (S.balls.length === 0) {
      if (S.respawn > 0) {
        S.respawn -= dt;
        if (S.respawn <= 0) serveBall();
      } else {
        loseLife();
      }
      return;
    }
    for (var b = 0; b < S.balls.length; b += 1) {
      var ball = S.balls[b];
      if (ball.stuck) {
        ball.x = clamp(S.paddle.x + (ball.offset || 0), S.L + ball.r, S.R - ball.r);
        ball.y = S.paddle.y - ball.r - 2;
      } else {
        stepBall(ball, dt);
      }
    }
    S.balls = S.balls.filter(function(ball2) {
      return !ball2.dead;
    });
    updateDrops(dt);
    if (S.balls.length === 0 && S.mode === "playing") {
      loseLife();
    }
  }
  function ambient(dt) {
    if (S.mode === "paused") return;
    if (S.shake > 0) S.shake = Math.max(0, S.shake - dt * 54);
    if (S.flash > 0) S.flash = Math.max(0, S.flash - dt * 3);
    updateParticles(dt);
    if (S.mode === "cleared") {
      S.nextTimer -= dt;
      if (S.nextTimer <= 0) enterLevel(S.level + 1);
    }
  }
  function resetTransform() {
    ctx.setTransform(S.dpr * S.scale, 0, 0, S.dpr * S.scale, 0, 0);
  }
  function draw() {
    resetTransform();
    drawBackground();
    var sx = 0;
    var sy = 0;
    if (S.shake > 0) {
      sx = rand(-S.shake, S.shake) * 0.55;
      sy = rand(-S.shake, S.shake) * 0.55;
    }
    ctx.save();
    ctx.translate(sx, sy);
    drawWalls();
    drawBricks();
    drawDrops();
    drawPaddle();
    drawBalls();
    drawOrbs();
    drawParticles();
    drawPops();
    drawServeHint();
    ctx.restore();
  }
  function drawBackground() {
    ctx.fillStyle = C.ink;
    ctx.fillRect(0, 0, S.w, S.h);
    var grid = 40 * S.unit;
    ctx.strokeStyle = "rgba(217, 222, 228, 0.035)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (var x = grid; x < S.w; x += grid) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, S.h);
    }
    for (var y = grid; y < S.h; y += grid) {
      ctx.moveTo(0, y);
      ctx.lineTo(S.w, y);
    }
    ctx.stroke();
  }
  function drawWalls() {
    ctx.fillStyle = "rgba(217, 222, 228, 0.21)";
    ctx.fillRect(S.L - 1, 0, 1, S.h);
    ctx.fillRect(S.R, 0, 1, S.h);
    ctx.save();
    ctx.strokeStyle = "rgba(169, 106, 106, 0.28)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4 * S.unit, 7 * S.unit]);
    ctx.beginPath();
    ctx.moveTo(S.L, S.h - 9);
    ctx.lineTo(S.R, S.h - 9);
    ctx.stroke();
    ctx.restore();
  }
  function drawBricks() {
    for (var i = 0; i < S.bricks.length; i += 1) {
      var k = S.bricks[i];
      if (!k.alive) continue;
      drawBrick(k);
    }
  }
  function drawMegaBrick(k) {
    ctx.fillStyle = k.color;
    ctx.fillRect(k.x, k.y, k.w, k.h);
    if (k.type === "steel") {
      ctx.fillStyle = "rgba(13, 15, 18, 0.28)";
      ctx.fillRect(k.x, k.y + k.h * 0.46, k.w, 1);
    }
    if (k.type === "core") drawCoreMark(k);
    if (k.type === "explosive") drawExplosiveMark(k);
    if (k.flash > 0) {
      ctx.fillStyle = "rgba(242, 244, 247, " + k.flash * 0.35 + ")";
      ctx.fillRect(k.x, k.y, k.w, k.h);
    }
  }
  function drawBrick(k) {
    if (S.mega) {
      drawMegaBrick(k);
      return;
    }
    var x = k.x;
    var y = k.y;
    var w = k.w;
    var h = k.h;
    var r = Math.min(2.4 * S.unit, h * 0.2);
    var steel = k.type === "steel";
    ctx.save();
    pathRound(x, y, w, h, r);
    ctx.fillStyle = k.color;
    ctx.fill();
    ctx.strokeStyle = steel ? "rgba(230, 222, 208, 0.4)" : "rgba(13, 15, 18, 0.62)";
    ctx.lineWidth = 1;
    pathRound(x + 0.5, y + 0.5, w - 1, h - 1, r);
    ctx.stroke();
    ctx.fillStyle = steel ? "rgba(217, 222, 228, 0.16)" : "rgba(255, 255, 255, 0.16)";
    ctx.fillRect(x + 2, y + 1.5, Math.max(0, w - 4), 1);
    if (steel) drawSteelDetail(k);
    else if (k.maxHp > k.hp) drawCracks(k);
    if (!steel && k.maxHp > 1) drawHpPips(k);
    if (k.type === "explosive") drawExplosiveMark(k);
    if (k.type === "core") drawCoreMark(k);
    if (k.flash > 0) {
      ctx.fillStyle = "rgba(242, 244, 247, " + k.flash * 0.42 + ")";
      pathRound(x, y, w, h, r);
      ctx.fill();
    }
    ctx.restore();
  }
  function drawHpPips(k) {
    var total = Math.min(5, k.maxHp);
    var size = 1.7 * S.unit;
    var gap = 1.9 * S.unit;
    var startX = k.x + k.w / 2 - (total - 1) * (size + gap) / 2;
    var y = k.y + k.h - 3.4 * S.unit;
    for (var i = 0; i < total; i += 1) {
      ctx.beginPath();
      ctx.arc(startX + i * (size + gap), y, size / 2, 0, TAU);
      if (i < k.hp) {
        ctx.fillStyle = "rgba(5, 8, 16, 0.62)";
        ctx.fill();
      } else {
        ctx.fillStyle = "rgba(5, 8, 16, 0.2)";
        ctx.fill();
      }
    }
  }
  function drawCracks(k) {
    var damage = Math.min(4, k.maxHp - k.hp);
    var randf = rng(k.seed + damage * 131);
    ctx.save();
    ctx.strokeStyle = "rgba(5, 8, 16, 0.55)";
    ctx.lineWidth = 0.9 * S.unit;
    ctx.lineCap = "round";
    for (var d = 0; d < damage; d += 1) {
      var px = k.x + k.w * (0.2 + randf() * 0.6);
      var py = k.y + k.h * (0.16 + randf() * 0.3);
      ctx.beginPath();
      ctx.moveTo(px, py);
      for (var s = 0; s < 3; s += 1) {
        px += (randf() - 0.5) * k.w * 0.34;
        py += k.h * (0.16 + randf() * 0.2);
        ctx.lineTo(px, py);
      }
      ctx.stroke();
    }
    ctx.restore();
  }
  function drawSteelDetail(k) {
    ctx.save();
    pathRound(k.x, k.y, k.w, k.h, Math.min(2.4 * S.unit, k.h * 0.2));
    ctx.clip();
    ctx.strokeStyle = "rgba(5, 8, 16, 0.3)";
    ctx.lineWidth = 2.4 * S.unit;
    var step2 = Math.max(7 * S.unit, 8);
    for (var d = -k.h; d < k.w + k.h; d += step2) {
      ctx.beginPath();
      ctx.moveTo(k.x + d, k.y + k.h);
      ctx.lineTo(k.x + d + k.h, k.y);
      ctx.stroke();
    }
    ctx.restore();
    var rivet = 1.5 * S.unit;
    var pad = 4 * S.unit;
    ctx.fillStyle = "rgba(222, 233, 250, 0.55)";
    var points = [
      [k.x + pad, k.y + pad],
      [k.x + k.w - pad, k.y + pad],
      [k.x + pad, k.y + k.h - pad],
      [k.x + k.w - pad, k.y + k.h - pad]
    ];
    for (var i = 0; i < points.length; i += 1) {
      ctx.beginPath();
      ctx.arc(points[i][0], points[i][1], rivet, 0, TAU);
      ctx.fill();
    }
  }
  function drawCoreMark(k) {
    var cx = k.x + k.w / 2;
    var cy = k.y + k.h / 2;
    var r1 = Math.max(2.6, Math.min(k.w, k.h) * 0.22);
    var r2 = r1 * 1.9;
    ctx.save();
    ctx.strokeStyle = "rgba(13, 15, 18, 0.66)";
    ctx.lineWidth = 1.2 * S.unit;
    ctx.beginPath();
    ctx.arc(cx, cy, r2, 0, TAU);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, r1, 0, TAU);
    ctx.stroke();
    ctx.fillStyle = "rgba(13, 15, 18, 0.72)";
    ctx.beginPath();
    ctx.arc(cx, cy, r1 * 0.36, 0, TAU);
    ctx.fill();
    ctx.restore();
  }
  function drawExplosiveMark(k) {
    var cx = k.x + k.w / 2;
    var cy = k.y + k.h / 2 - (k.maxHp > 1 ? 1.2 * S.unit : 0);
    var s = Math.max(2.4, Math.min(3.6 * S.unit, k.h * 0.26));
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = "rgba(13, 15, 18, 0.68)";
    ctx.fillRect(-s / 2, -s / 2, s, s);
    ctx.strokeStyle = "rgba(217, 222, 228, 0.5)";
    ctx.lineWidth = 1;
    ctx.strokeRect(-s / 2, -s / 2, s, s);
    ctx.restore();
  }
  function drawDrops() {
    for (var i = 0; i < S.drops.length; i += 1) {
      var d = S.drops[i];
      var def = POWERS[d.kind];
      if (!def) continue;
      var w = d.w;
      var h = d.h;
      ctx.save();
      ctx.translate(d.x, d.y);
      pathRound(-w / 2, -h / 2, w, h, h / 2);
      ctx.fillStyle = C.panel;
      ctx.fill();
      ctx.strokeStyle = def.color;
      ctx.lineWidth = 1;
      pathRound(-w / 2, -h / 2, w, h, h / 2);
      ctx.stroke();
      ctx.fillStyle = def.color;
      ctx.font = "700 " + Math.round(8.5 * S.unit) + 'px "ZCOOL QingKe HuangYou", "Microsoft YaHei", sans-serif';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(def.short, 0, 0.5);
      ctx.restore();
    }
  }
  function drawPaddle() {
    var p = S.paddle;
    var w = p.w;
    var h = p.h;
    var x = p.x - w / 2;
    var y = p.y;
    ctx.save();
    pathRound(x, y, w, h, h / 2);
    ctx.fillStyle = C.bone;
    ctx.fill();
    ctx.strokeStyle = "rgba(13, 15, 18, 0.7)";
    ctx.lineWidth = 1;
    pathRound(x + 0.5, y + 0.5, w - 1, h - 1, h / 2);
    ctx.stroke();
    ctx.fillStyle = C.accent;
    ctx.fillRect(p.x - 3 * S.unit, y + h * 0.32, 6 * S.unit, h * 0.36);
    ctx.restore();
  }
  function drawBalls() {
    var many = S.balls.length > 24;
    for (var i = 0; i < S.balls.length; i += 1) {
      var b = S.balls[i];
      if (!many) {
        for (var t = 0; t < b.trail.length; t += 1) {
          var point = b.trail[t];
          var a = (t + 1) / b.trail.length;
          ctx.globalAlpha = a * 0.15;
          ctx.fillStyle = "#ffe9c9";
          ctx.beginPath();
          ctx.arc(point.x, point.y, b.r * (0.22 + a * 0.55), 0, TAU);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
        ctx.save();
        ctx.shadowColor = "rgba(255, 236, 199, 0.85)";
        ctx.shadowBlur = 10 * S.unit;
        var glow = ctx.createRadialGradient(
          b.x - b.r * 0.3,
          b.y - b.r * 0.3,
          b.r * 0.1,
          b.x,
          b.y,
          b.r * 1.9
        );
        glow.addColorStop(0, "#ffffff");
        glow.addColorStop(0.5, "#fff5e7");
        glow.addColorStop(1, "rgba(255, 236, 199, 0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r * 1.9, 0, TAU);
        ctx.fill();
        ctx.restore();
      } else {
        ctx.fillStyle = "rgba(255, 245, 231, 0.13)";
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r * 1.75, 0, TAU);
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, TAU);
      ctx.fillStyle = C.ball;
      ctx.fill();
      ctx.strokeStyle = "rgba(13, 15, 18, 0.3)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }
  function drawOrbs() {
    for (var i = 0; i < S.orbs.length; i += 1) {
      var o = S.orbs[i];
      var fade = clamp(o.life / 0.9, 0, 1);
      ctx.globalAlpha = fade;
      ctx.strokeStyle = C.sand;
      ctx.lineWidth = 1.5 * S.unit;
      ctx.beginPath();
      ctx.arc(o.x, o.y, o.r, 0, TAU);
      ctx.stroke();
      ctx.fillStyle = C.sand;
      ctx.beginPath();
      ctx.arc(o.x, o.y, Math.max(1, o.r * 0.28), 0, TAU);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
  function drawParticles() {
    for (var i = 0; i < S.particles.length; i += 1) {
      var p = S.particles[i];
      var a = clamp(p.life / p.maxLife, 0, 1);
      ctx.globalAlpha = a;
      if (p.type === "ring") {
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1.8 * S.unit;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.5, p.r), 0, TAU);
        ctx.stroke();
      } else if (p.type === "spark") {
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1.4 * S.unit;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.vx * 0.02, p.y - p.vy * 0.02);
        ctx.stroke();
      } else {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
    }
    ctx.globalAlpha = 1;
  }
  function drawPops() {
    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "700 " + Math.round(12 * S.unit) + 'px "Chakra Petch", "Microsoft YaHei", sans-serif';
    for (var i = 0; i < S.pops.length; i += 1) {
      var p = S.pops[i];
      var a = clamp(p.life / p.maxLife, 0, 1);
      ctx.globalAlpha = a;
      ctx.fillStyle = p.color;
      ctx.fillText(p.text, p.x, p.y);
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  function drawServeHint() {
    if (S.mode !== "playing" || S.balls.length === 0) return;
    var stuck = [];
    for (var i = 0; i < S.balls.length; i += 1) {
      if (S.balls[i].stuck) stuck.push(S.balls[i]);
    }
    if (stuck.length === 0) return;
    var p = S.paddle;
    ctx.save();
    ctx.setLineDash([3 * S.unit, 4.5 * S.unit]);
    ctx.strokeStyle = "rgba(181, 172, 157, 0.55)";
    ctx.lineWidth = 1;
    for (var j = 0; j < stuck.length; j += 1) {
      var ball = stuck[j];
      var aim = ball.aim || 0;
      var dx = Math.sin(aim);
      var dy = -Math.cos(aim);
      var len = 52 * S.unit;
      ctx.beginPath();
      ctx.moveTo(ball.x + dx * (ball.r + 3), ball.y + dy * (ball.r + 3));
      ctx.lineTo(ball.x + dx * len, ball.y + dy * len);
      ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.fillStyle = rgba(C.bone, 0.5);
    ctx.font = "500 " + Math.round(9 * S.unit) + 'px "Chakra Petch", "Microsoft YaHei", sans-serif';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("\u70B9\u51FB / \u7A7A\u683C \u53D1\u7403", S.w / 2, p.y - 34 * S.unit);
    ctx.restore();
  }
  function pathRound(x, y, w, h, r) {
    var rr = Math.max(0, Math.min(r, w / 2, h / 2));
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.lineTo(x + w - rr, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
    ctx.lineTo(x + w, y + h - rr);
    ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
    ctx.lineTo(x + rr, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
    ctx.lineTo(x, y + rr);
    ctx.quadraticCurveTo(x, y, x + rr, y);
    ctx.closePath();
  }
  function updateLives() {
    var max = 5;
    var html = "";
    for (var i = 0; i < max; i += 1) {
      html += '<i class="' + (i < S.lives ? "" : "off") + '"></i>';
    }
    livesEl.innerHTML = html;
  }
  function updateHud() {
    var score = fmt(S.score);
    if (score !== hudCache.score) {
      scoreEl.textContent = score;
      hudCache.score = score;
    }
    var best = fmt(S.best);
    if (best !== hudCache.best) {
      bestEl.textContent = best;
      gateBest.textContent = best;
      hudCache.best = best;
    }
    var level = "LEVEL " + pad2(S.level);
    if (level !== hudCache.level) {
      levelEl.textContent = level;
      hudCache.level = level;
    }
    if (S.lives !== hudCache.lives) {
      updateLives();
      hudCache.lives = S.lives;
    }
    var mult = comboMult();
    var combo = S.combo >= 2 ? "COMBO " + S.combo + (mult > 1 ? " \xB7 \xD7" + mult : "") : "";
    if (combo !== hudCache.combo) {
      comboEl.hidden = !combo;
      comboEl.textContent = combo;
      hudCache.combo = combo;
    }
    var parts = "";
    if (S.balls.length > 3) {
      parts += '<span class="power"><b style="background:' + C.white + ";color:" + C.white + '"></b>BALLS \xD7' + S.balls.length + "</span>";
    }
    if (S.orbs.length > 0) {
      var orbLeft = 0;
      for (var o = 0; o < S.orbs.length; o += 1) {
        orbLeft = Math.max(orbLeft, S.orbs[o].life);
      }
      parts += '<span class="power"><b style="background:' + C.sand + ";color:" + C.sand + '"></b>CORE \xD7' + S.orbs.length + "<em>" + Math.ceil(orbLeft) + "s</em></span>";
    }
    if (parts !== hudCache.powers) {
      powersEl.innerHTML = parts;
      hudCache.powers = parts;
    }
    if (S.mode !== hudCache.mode) {
      hint.classList.toggle("dim", S.mode !== "playing");
      document.body.dataset.mode = S.mode;
      hudCache.mode = S.mode;
    }
  }
  function show(el2) {
    gate.hidden = el2 !== gate;
    pauseScreen.hidden = el2 !== pauseScreen;
    overScreen.hidden = el2 !== overScreen;
    levelScreen.hidden = el2 !== levelScreen;
  }
  function hideScreens() {
    gate.hidden = true;
    pauseScreen.hidden = true;
    overScreen.hidden = true;
    levelScreen.hidden = true;
  }
  var levelReturn = "menu";
  function buildLevelSelect() {
    var html = "";
    for (var i = 0; i < LEVELS.length; i += 1) {
      var def = LEVELS[i];
      var cores = 0;
      for (var r = 0; r < def.rows.length; r += 1) {
        cores += (def.rows[r].match(/C/g) || []).length;
      }
      var current = S.savedRun && S.savedRun.level === i + 1;
      html += '<button type="button" class="level-card' + (current ? " current" : "") + '" data-level="' + (i + 1) + '"><span class="num">' + pad2(i + 1) + '</span><span class="meta">' + cores + " CORE" + (current ? " \xB7 SAVE" : "") + "</span></button>";
    }
    levelGrid.innerHTML = html;
  }
  function openLevelSelect(from) {
    levelReturn = from || "menu";
    buildLevelSelect();
    show(levelScreen);
  }
  function closeLevelSelect() {
    if (levelReturn === "pause") show(pauseScreen);
    else show(gate);
  }
  function showBanner(title, sub, duration) {
    banner.style.top = S.cols > 20 ? "62%" : "27%";
    bannerTitle.textContent = title;
    bannerSub.textContent = sub || "";
    banner.hidden = true;
    void banner.offsetWidth;
    banner.hidden = false;
    S.bannerTimer = duration || 1.5;
  }
  function syncSoundButton() {
    soundBtn.classList.toggle("muted", !S.sound);
    soundBtn.setAttribute("aria-pressed", S.sound ? "true" : "false");
  }
  function toggleSound() {
    S.sound = !S.sound;
    syncSoundButton();
    saveSound();
    if (S.sound) {
      Sound.ensure();
      Sound.ui();
    }
  }
  function toWorldX(event) {
    var rect = canvas.getBoundingClientRect();
    return (event.clientX - rect.left) / Math.max(1, rect.width) * S.w;
  }
  function bindEvents() {
    startBtn.addEventListener("click", function() {
      Sound.ensure();
      startRun();
      Sound.ui();
    });
    continueBtn.addEventListener("click", function() {
      resumeRun();
    });
    levelsBtn.addEventListener("click", function() {
      openLevelSelect("menu");
    });
    pauseLevelsBtn.addEventListener("click", function() {
      openLevelSelect("pause");
    });
    levelBack.addEventListener("click", closeLevelSelect);
    levelGrid.addEventListener("click", function(event) {
      var card = event.target.closest(".level-card");
      if (!card) return;
      var level = Number(card.getAttribute("data-level"));
      if (!level) return;
      Sound.ensure();
      startRun(level);
      Sound.ui();
    });
    againBtn.addEventListener("click", function() {
      Sound.ensure();
      startRun();
      Sound.ui();
    });
    resumeBtn.addEventListener("click", resumeGame);
    restartLevelBtn.addEventListener("click", function() {
      hideScreens();
      Sound.ui();
      restartLevel();
    });
    quitBtn.addEventListener("click", quitToMenu);
    pauseBtn.addEventListener("click", togglePause);
    soundBtn.addEventListener("click", toggleSound);
    canvas.addEventListener("pointermove", function(event) {
      if (S.mode !== "playing") return;
      S.paddle.targetX = clamp(toWorldX(event), S.L, S.R);
    });
    canvas.addEventListener("pointerdown", function(event) {
      Sound.ensure();
      if (event.button === 2) {
        togglePause();
        return;
      }
      if (S.mode !== "playing") return;
      S.paddle.targetX = clamp(toWorldX(event), S.L, S.R);
      launchBalls();
    });
    stage.addEventListener("contextmenu", function(event) {
      event.preventDefault();
    });
    window.addEventListener("keydown", function(event) {
      var key = event.key;
      if (!levelScreen.hidden) {
        if (key === "Escape" || key === "p" || key === "P") {
          event.preventDefault();
          closeLevelSelect();
        }
        return;
      }
      if (key === "ArrowLeft" || key === "a" || key === "A") {
        S.keys.left = true;
        event.preventDefault();
      } else if (key === "ArrowRight" || key === "d" || key === "D") {
        S.keys.right = true;
        event.preventDefault();
      } else if (key === " " || key === "Spacebar") {
        event.preventDefault();
        Sound.ensure();
        if (S.mode === "playing") launchBalls();
        else if (S.mode === "paused") resumeGame();
        else if (S.mode === "menu") {
          if (S.savedRun) resumeRun();
          else startRun();
        } else if (S.mode === "over") startRun();
      } else if (key === "p" || key === "P" || key === "Escape") {
        event.preventDefault();
        togglePause();
      } else if (key === "r" || key === "R") {
        event.preventDefault();
        if (S.mode === "over" || S.mode === "menu") startRun();
        else {
          hideScreens();
          restartLevel();
        }
      } else if (key === "m" || key === "M") {
        toggleSound();
      } else if (key === "Enter") {
        if (S.mode === "menu") {
          if (S.savedRun) resumeRun();
          else startRun();
        } else if (S.mode === "over") {
          startRun();
        }
      }
    });
    window.addEventListener("keyup", function(event) {
      var key = event.key;
      if (key === "ArrowLeft" || key === "a" || key === "A") S.keys.left = false;
      if (key === "ArrowRight" || key === "d" || key === "D") S.keys.right = false;
    });
    window.addEventListener("blur", function() {
      S.keys.left = false;
      S.keys.right = false;
    });
    document.addEventListener("visibilitychange", function() {
      if (!document.hidden) return;
      if (S.mode === "playing") pauseGame();
      else saveRun();
    });
    window.addEventListener("resize", resize);
    if (window.ResizeObserver) {
      var ro = new ResizeObserver(function() {
        resize();
      });
      ro.observe(stage);
    }
    window.addEventListener("beforeunload", function() {
      saveRun();
      saveBest();
    });
    window.addEventListener("pagehide", function() {
      saveRun();
      saveBest();
    });
  }
  var lastTime = 0;
  var accumulated = 0;
  function frame(now) {
    var raw = lastTime ? clamp((now - lastTime) / 1e3, 0, 0.05) : 0.016;
    lastTime = now;
    S.clock += raw;
    if (S.mode === "playing") {
      if (SIM > 1) {
        for (var i = 0; i < SIM; i += 1) step(STEP);
        updateParticles(raw);
      } else {
        accumulated += raw;
        var count = 0;
        while (accumulated >= STEP && count < 16) {
          step(STEP);
          accumulated -= STEP;
          count += 1;
        }
        if (count === 16) accumulated = 0;
        updateParticles(raw);
      }
    } else {
      ambient(raw);
    }
    if (S.bannerTimer > 0) {
      S.bannerTimer -= raw;
      if (S.bannerTimer <= 0) banner.hidden = true;
    }
    if (S.mode === "playing" && S.clock - S.lastSaveAt > 4) saveRun();
    updateHud();
    draw();
    requestAnimationFrame(frame);
  }
  var booted = false;
  function boot(context) {
    if (booted) return;
    booted = true;
    if (context) applyHostReady(context, document.documentElement);
    resize();
    bindEvents();
    loadSound();
    toMenu();
    loadBest();
    loadRun();
    loading.classList.add("done");
    requestAnimationFrame(frame);
    if (PLAY || STEPS > 0) {
      window.setTimeout(function() {
        if (S.mode === "menu") startRun();
        else if (S.mode === "playing") launchBalls();
        launchBalls();
        for (var i = 0; i < STEPS; i += 1) step(STEP);
        updateHud();
        draw();
      }, 240);
    }
    if (DBG) {
      window.__brick = {
        S,
        step,
        draw,
        startRun,
        enterLevel,
        launchBalls,
        damageBrick,
        applyPower,
        updateHud,
        saveRun,
        clearRun,
        resumeRun,
        quitToMenu
      };
      window.setInterval(function() {
        document.title = "brick-breaker \xB7 " + S.mode + " \xB7 L" + S.level + " \xB7 " + Math.round(S.fps || 0);
      }, 1e3);
    }
  }
  var fpsFrames = 0;
  var fpsAt = 0;
  (function trackFps() {
    var now = performance.now();
    fpsFrames += 1;
    if (!fpsAt) fpsAt = now;
    if (now - fpsAt >= 1e3) {
      S.fps = fpsFrames * 1e3 / (now - fpsAt);
      fpsFrames = 0;
      fpsAt = now;
    }
    requestAnimationFrame(trackFps);
  })();
  try {
    host.onReady(function(context) {
      applyHostReady(context, document.documentElement);
      void boot(context);
    });
  } catch (error) {
  }
  window.setTimeout(function() {
    void boot(null);
  }, 220);
})();
