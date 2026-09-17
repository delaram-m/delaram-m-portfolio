# Training card details and previews

## What will change
- Expand each training entry to include the certificate or badge name, completion month, completion year, and an optional link.
- Redesign the cards so the credential preview has a dedicated area, with the name and completion date clearly grouped beneath it.
- When a link is provided, attempt to show a linked image or PDF directly; if the link is a webpage, inspect its page metadata and linked files for a suitable preview.
- Keep unlinked credentials cleanly displayed without a broken or misleading preview.

## Technical details
- Add a server-side preview resolver for safe public HTTP/HTTPS links. It will recognize direct image/PDF URLs and otherwise inspect page metadata and media links.
- Fetch previews per linked training with the existing query pattern, cache results, and show a restrained loading/fallback state.
- Preserve the optional external link behavior and existing dark purple-blue visual system.
- Leave placeholder credential content in place until real names, dates, and links are supplied.

## Validation
- Confirm linked images and PDFs render in their cards, entries without links remain complete, external links open correctly, and the page works on desktop and mobile.
