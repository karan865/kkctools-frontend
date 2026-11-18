import { Lexend } from 'next/font/google';

// One variable-font file shared by all tool pages. next/font downloads it at
// build time and self-hosts it: no runtime request to Google.
export const toolDisplayFont = Lexend({
  subsets: ['latin'],
  variable: '--font-tool-display',
  display: 'swap',
});
