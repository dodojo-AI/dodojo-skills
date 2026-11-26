# Saving into dodojo

dodojo is the person's own memory library, shared with their AI. A webpage
note there is an ordinary Note with the page attached: it shows in their
library as a card whose cover is the top of the page, opens full height on the
phone and the computer, and keeps what they tick and type.

## The connection

- The dodojo MCP server is `https://www.dodojo.ai/api/mcp` (OAuth; the person
  signs in once). The dodojo desktop app's own agent is already connected.
  The `dodojo` skill in [dodojo-AI/dodojo-plugin](https://github.com/dodojo-AI/dodojo-plugin)
  has the full rules for reading and writing memories.
- If the connector offers `get_storage_guide` with `topic: "webpage"` and
  `topic: "game"`, read both first: they are the current version of these
  rules and win where they differ.
- If there is no connector, do not invent one. Write the files locally and
  say the page can be added to dodojo later.

## Saving

1. Inside the dodojo desktop app, call `preview_webpage` on the page in your
   working folder and fix what it shows before saving.
2. Upload each file: `begin_attachment_upload`, then PUT the exact bytes to
   the returned private URL with the returned headers, then pass
   `{ "upload_id": … }` in `attachments`. Small files may go inline as base64
   instead, as long as the whole request stays under about 3 MB.
3. Call `save_memory` with:
   - `title`: a short noun phrase naming the game ("Gomoku"), not a sentence;
   - `content_type: "markdown"` and a body of two or three lines: what the
     game is, how to start and the main rule. dodojo shows this text under
     the page (older app versions show it above, so keep it short); the full
     rules live in the page, under the game;
   - `attachments`: the `.html`, plus any images or sounds the page shows.
4. File it into a folder only when the person named one (then call
   `list_collections` and use its exact path). Otherwise leave the collection
   out: it lands in their Personal space, newest first.
5. Tell the person the Note's title and what is in it. Do not paste the page.

## dodojo Markdown, briefly

The body is a fixed dialect, not CommonMark: headings start at `##` and stop
at `###` (the title is the H1), with no blank line before or after them; one
blank line between paragraphs and after a list or table before prose, none
between list items; `- ` bullets with 2 spaces per level; `**bold**`,
`*italic*`, single-backtick code, `[label](https://…)` links; `==highlight==`
for the few words that must not be missed; write amounts without a bare `$`.

## Revising

Update the same Note with `update_memory` and its card id. Keep the page's
`dodojo-page-id` and its `data-dodojo-key` and `setState` names so a game in
progress and the record carry over.
