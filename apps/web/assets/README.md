# Build-time assets

- `manrope-700.woff`: Manrope Bold (latin), used to draw the favicon "B" at build
  time (`app/icon.tsx`). Satori, behind Next's `ImageResponse`, needs WOFF/TTF/OTF,
  not the WOFF2 that `next/font` serves. Manrope is licensed under the SIL Open
  Font License 1.1 (https://openfontlicense.org). Source: Fontsource
  `@fontsource/manrope@5.2.8`, `files/manrope-latin-700-normal.woff`.
