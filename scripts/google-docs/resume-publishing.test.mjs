import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";

const source = readFileSync(new URL("./Code.gs", import.meta.url), "utf8");
const pdf = Buffer.from("%PDF-1.7\nfinished resume\n%%EOF");

function harness(overrides = {}) {
  const state = { requests: [], alerts: [], released: false, exports: 0 };
  const menu = {
    addItem(label, callback) {
      state.menu = { label, callback };
      return this;
    },
    addToUi() {},
  };
  const context = vm.createContext({
    DocumentApp: {
      getUi: () => ({
        createMenu: () => menu,
        alert: (message) => {
          assert.equal(state.released, true);
          state.alerts.push(message);
        },
      }),
      getActiveDocument: () => ({
        getTabs: () => overrides.tabs ?? [{ getChildTabs: () => [] }],
        getAs: (mime) => {
          assert.equal(mime, "application/pdf");
          state.exports++;
          if (overrides.exportError) throw new Error("Export unavailable");
          return { getBytes: () => Array.from(overrides.bytes ?? pdf) };
        },
      }),
    },
    LockService: {
      getScriptLock: () => ({
        tryLock: () => overrides.lock ?? true,
        releaseLock: () => {
          state.released = true;
        },
      }),
    },
    PropertiesService: {
      getScriptProperties: () => ({
        getProperty: () => overrides.token ?? "test-token",
      }),
    },
    Utilities: {
      base64Encode: (bytes) => Buffer.from(bytes).toString("base64"),
    },
    UrlFetchApp: {
      fetch: (url, options) => {
        state.requests.push({ url, ...options });
        const isRead = options.method === "get";
        return {
          getResponseCode: () =>
            (isRead ? overrides.getStatus : overrides.putStatus) ?? 200,
          getContentText: () =>
            JSON.stringify(
              isRead
                ? {
                    type: "file",
                    sha: "existing-file-sha",
                    encoding: "base64",
                    content: overrides.same
                      ? `${pdf.toString("base64")}\n`
                      : "old-pdf",
                  }
                : {
                    commit: {
                      html_url: "https://github.com/example/commit/123",
                    },
                  },
            ),
        };
      },
    },
  });
  vm.runInContext(source, context);
  return { context, state };
}

test("opening the document only adds the publish menu", () => {
  const { context, state } = harness();
  context.onOpen();
  assert.equal(state.menu.callback, "publishResume");
  assert.equal(state.requests.length, 0);
  assert.equal(state.exports, 0);
  assert.equal(context.onEdit, undefined);
});

test("explicit publication uploads the captured PDF with the existing SHA", () => {
  const { context, state } = harness();
  context.publishResume();
  assert.equal(state.requests.length, 2);
  const [read, write] = state.requests;
  assert.match(read.url, /Aadit_Gupta_Resume\.pdf\?ref=main$/);
  assert.equal(write.method, "put");
  assert.equal(write.followRedirects, false);
  const payload = JSON.parse(write.payload);
  assert.equal(payload.branch, "main");
  assert.equal(payload.sha, "existing-file-sha");
  assert.deepEqual(Buffer.from(payload.content, "base64"), pdf);
  assert.match(
    state.alerts[0],
    /after the connected production deployment succeeds/,
  );
});

test("an identical exported PDF does not request another deployment", () => {
  const { context, state } = harness({ same: true });
  assert.match(context.publishResumeSnapshot_(), /already in GitHub/);
  assert.equal(state.requests.length, 1);
  assert.equal(state.released, true);
});

for (const [name, options, expected] of [
  ["missing credentials", { token: "" }, /Set GITHUB_TOKEN/],
  ["alternate draft tabs", { tabs: [{}, {}] }, /one tab/],
  ["nested draft tabs", { tabs: [{ getChildTabs: () => [{}] }] }, /one tab/],
  ["export failure", { exportError: true }, /Export unavailable/],
  [
    "HTML instead of PDF",
    { bytes: Buffer.from("<html>error</html>") },
    /did not return a PDF/,
  ],
  ["empty export", { bytes: [] }, /did not return a PDF/],
  ["oversize export", { bytes: Buffer.alloc(1000001) }, /did not return a PDF/],
  ["missing GitHub file", { getStatus: 404 }, /GitHub returned 404/],
  ["expired token", { getStatus: 401 }, /invalid or expired/],
]) {
  test(`${name} never uploads a replacement`, () => {
    const { context, state } = harness(options);
    assert.throws(() => context.publishResumeSnapshot_(), expected);
    assert.equal(
      state.requests.some((request) => request.method === "put"),
      false,
    );
    assert.equal(state.released, true);
  });
}

test("overlapping publish attempts cannot export or upload", () => {
  const { context, state } = harness({ lock: false });
  assert.throws(
    () => context.publishResumeSnapshot_(),
    /Another resume publication/,
  );
  assert.equal(state.requests.length, 0);
  assert.equal(state.exports, 0);
  assert.equal(state.released, false);
});

for (const status of [403, 409, 422, 500]) {
  test(`GitHub write error ${status} reports failure without retrying`, () => {
    const { context, state } = harness({ putStatus: status });
    context.publishResume();
    assert.equal(state.requests.length, 2);
    assert.match(state.alerts[0], /Publishing could not be confirmed/);
    assert.ok(state.alerts[0].includes(`GitHub returned ${status}`));
    assert.equal(state.alerts[0].includes("test-token"), false);
  });
}
