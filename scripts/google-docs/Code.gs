/**
 * Bind this script to the resume Google Doc. See docs/resume-publishing.md.
 * @OnlyCurrentDoc
 */
const RESUME = Object.freeze({
  owner: "aaditguptaa",
  repo: "personal-website",
  branch: "main",
  path: "public/documents/Aadit_Gupta_Resume.pdf",
});

// Opening or editing the document never publishes anything.
function onOpen() {
  DocumentApp.getUi()
    .createMenu("Website")
    .addItem("Publish resume", "publishResume")
    .addToUi();
}

function publishResume() {
  let message;
  try {
    message = publishResumeSnapshot_();
  } catch (error) {
    message = `Publishing could not be confirmed. ${error.message}\n\nCheck the repository and Vercel deployment before retrying.`;
  }
  // UI alerts suspend execution, so show this only after releasing the lock.
  DocumentApp.getUi().alert(message);
}

function publishResumeSnapshot_() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(1000)) {
    throw new Error("Another resume publication is running. Wait for it to finish.");
  }

  try {
    const token = PropertiesService.getScriptProperties()
      .getProperty("GITHUB_TOKEN");
    if (!token || !token.trim()) {
      throw new Error("Set GITHUB_TOKEN in Apps Script Project Settings → Script properties first.");
    }

    const doc = DocumentApp.getActiveDocument();
    // Avoid accidentally exporting multiple draft tabs along with the resume.
    if (doc.getTabs().length !== 1 || doc.getTabs()[0].getChildTabs().length) {
      throw new Error("Use a document with one tab containing only the finished resume. Keep alternate drafts in a separate document.");
    }

    const endpoint = `https://api.github.com/repos/${encodeURIComponent(RESUME.owner)}/${encodeURIComponent(RESUME.repo)}/contents/${RESUME.path.split("/").map(encodeURIComponent).join("/")}`;
    // Read before export; the SHA makes GitHub reject concurrent replacements.
    const current = githubRequest_(
      `${endpoint}?ref=${encodeURIComponent(RESUME.branch)}`,
      token.trim(),
      "get",
    );
    if (current.type !== "file" || !current.sha) {
      throw new Error("The configured resume path must already be a file in the repository.");
    }

    const bytes = doc.getAs("application/pdf").getBytes();
    // A resume should fit comfortably below GitHub's 1 MB inline-content limit.
    if (bytes.length < 5 || bytes.length > 1000000 ||
        String.fromCharCode(...bytes.slice(0, 5)) !== "%PDF-") {
      throw new Error("Google Docs did not return a PDF under 1 MB. Nothing was uploaded.");
    }
    const content = Utilities.base64Encode(bytes);
    if (current.encoding === "base64" &&
        (current.content || "").replace(/\s/g, "") === content) {
      return "This PDF is already in GitHub. No new deployment was requested.";
    }

    const result = githubRequest_(endpoint, token.trim(), "put", {
      message: "docs: publish resume from Google Docs",
      content,
      sha: current.sha,
      branch: RESUME.branch,
    });
    return `Resume snapshot saved to GitHub.\n\n${result.commit.html_url}\n\nThe website will show this PDF after the connected production deployment succeeds. You can continue editing your Google Doc; those edits will stay unpublished until you click Publish resume again.`;
  } finally {
    lock.releaseLock();
  }
}

function githubRequest_(url, token, method, payload) {
  const options = {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    muteHttpExceptions: true,
    followRedirects: false,
  };
  if (payload) {
    options.contentType = "application/json";
    options.payload = JSON.stringify(payload);
  }
  const response = UrlFetchApp.fetch(url, options);
  const status = response.getResponseCode();
  if (status < 200 || status >= 300) {
    const hints = {
      401: "The GitHub token is invalid or expired.",
      403: "Check token Contents write permission, branch rules, and GitHub rate limits.",
      404: "Check the repository, branch, existing PDF path, and token repository access.",
      409: "The resume changed in GitHub during publishing. Review that version before retrying.",
      422: "GitHub rejected the update. Check branch protection and repository rules.",
    };
    // Never include request headers or GitHub response bodies in errors/logs.
    throw new Error(`GitHub returned ${status}. ${hints[status] || "Try again after checking GitHub."}`);
  }
  return JSON.parse(response.getContentText());
}
