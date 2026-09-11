# Publish a finished resume from Google Docs

Edit your resume normally. When a draft is ready, choose **Website → Publish resume** inside Google Docs. The script exports a PDF snapshot and commits it to `public/documents/Aadit_Gupta_Resume.pdf` on `main`. A connected Vercel Git integration deploys that commit. Both existing resume links already point to this file.

Opening, editing, or naming a version of the Google Doc does nothing to the website. Visitors keep seeing the last deployed PDF until you explicitly publish another snapshot and its deployment succeeds. The source Google Doc can remain private. No website environment variables or new dependencies are needed.

## One-time setup

1. In Vercel, check that this project is connected to `aaditguptaa/personal-website` and its production branch is `main`, with automatic Git deployments enabled. The script's `RESUME` settings must match if you use a different repository or branch. Repository rules must allow your account to update this PDF directly; if your branch requires pull requests, use a publishing branch and merge its PR to release the resume.
2. In GitHub **Settings → Developer settings → Personal access tokens → Fine-grained tokens**, create a token for **only** `personal-website`, with repository **Contents: Read and write**. Give it an expiration you can maintain. No workflow or account permissions are needed. This token can modify repository contents, so keep it out of the source code and website environment variables.
3. Open your resume in desktop Google Docs. Use a document with a **single tab**, containing only the resume to publish; the script rejects extra tabs to prevent including alternate drafts. Wait until Google Docs says changes are saved before publishing.
4. Choose **Extensions → Apps Script**. Paste [`Code.gs`](../scripts/google-docs/Code.gs) into the script editor. If you already have a script, merge the menu into its existing `onOpen` function instead of replacing your code.
5. In Apps Script **Project Settings**, enable **Show "appsscript.json" manifest file in editor**. Paste [`appsscript.json`](../scripts/google-docs/appsscript.json) into that manifest (or merge its scopes into your existing manifest).
6. Under **Project Settings → Script properties**, add `GITHUB_TOKEN` with your token as the value. Script properties are accessible to script editors; only trusted people should have edit access to this Google Doc and its bound script. Give resume reviewers comment/view access instead.
7. Save the script and reload the Google Doc. The **Website** menu appears. There is no need to deploy a web app or install any scheduled/edit triggers.

## Each finished draft

1. Finish your edits and review the resume. For the first publication, use Google Docs **File → Download → PDF Document** to check the exported formatting and page count.
2. Choose **Website → Publish resume**. On first use, Google asks you to authorize the script to access this document and make external requests. This action publishes the current document contents; it does not select a past named version.
3. The result dialog includes the GitHub commit URL. Wait for that commit's Vercel production deployment to succeed, then open the website's **Résumé, PDF** link and check it.
4. Continue editing Google Docs. The exported snapshot is independent of your later edits.

The script checks for a PDF under 1 MB before uploading, prevents overlapping script runs, and uses the existing file's SHA so a concurrent GitHub update causes an error instead of silently overwriting it. An identical PDF skips the commit, although Google's PDF export metadata may cause unchanged text to produce different bytes.

## Troubleshooting and rollback

- **No menu:** save the bound script and reload the document in a desktop browser.
- **401/403/404:** check the token's expiration, selected repository, Contents permission, and the configured branch/path. Replace expired tokens in Script properties.
- **409/422:** review the repository version and branch rules before publishing again. The script does not bypass branch protection.
- **Network error or unknown result:** check GitHub first; a commit might have succeeded even if the response was lost.
- **Commit exists but website is old:** check that Vercel built that commit as a successful production deployment, including any commit-author access requirements or ignored-build settings. A failed deployment leaves the previous production resume in place. Reload the PDF after deployment to replace an already-open browser copy.
- **Published the wrong draft:** revert the resume publication commit in GitHub and let Vercel redeploy, or restore the desired Google Docs version and publish it again. Reverting does not remove the old PDF from Git history.
- **Local checkout is behind after publishing:** pull the new commit before making your next website change, so your local PDF stays in sync.

## Verification

Run `node --test scripts/google-docs/resume-publishing.test.mjs` for offline checks of publication boundaries and failure handling. A real Google Docs export, token authorization, and Vercel deployment must be checked after setup in your accounts; the local tests mock those services.

## API references

- [Google Docs custom menus](https://developers.google.com/apps-script/guides/menus)
- [Google Docs PDF export (`Document.getAs`)](https://developers.google.com/apps-script/reference/document/document#getAs(String))
- [Apps Script properties](https://developers.google.com/apps-script/guides/properties)
- [GitHub repository contents API](https://docs.github.com/en/rest/repos/contents)
- [Vercel deployments from GitHub](https://vercel.com/docs/git/vercel-for-github)
