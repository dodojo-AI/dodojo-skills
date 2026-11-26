# Saving into dodojo

dodojo is the person's own memory library, shared with their AI. A webpage
note there is an ordinary Note with the page attached: it shows in their
library as a card whose cover is the top of the page, opens full height on the
phone and the computer, and keeps what they tick and type.

## The connection

- The dodojo MCP server is `https://www.dodojo.ai/api/mcp` (OAuth; the person
  signs in once). The dodojo desktop app's own agent is already connected.
  The `dodojo` skill in [dodojo14/dodojo-plugin](https://github.com/dodojo14/dodojo-plugin)
  has the full rules for reading and writing memories.
- If the connector offers `get_storage_guide` with `topic: "webpage"`, read it
  first: it is the current version of these rules and wins where they differ.
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
   - `title`: a short noun phrase naming the thing ("Kyoto Higashiyama day
     walk"), not a sentence;
   - `content_type: "markdown"` and a body that opens with the takeaway and
     carries the key facts and links (dates, places, numbers, bookings), so
     search finds them and they read without the page;
   - `attachments`: the `.html` first, then its photos. At most 4 files per
     call; add the rest with `update_memory`. A Note holds at most 2
     non-image files.
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
`dodojo-page-id` and its `data-dodojo-key` names so what the person already
ticked carries over.
