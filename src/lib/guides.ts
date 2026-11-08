import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';

const GUIDES_DIR = path.join(process.cwd(), 'content', 'guides');

export interface GuideFrontmatter {
  title: string;
  description: string;
  slug: string;
  date: string;
  updated: string;
}

export interface GuideTocItem {
  id: string;
  text: string;
}

export interface GuideData {
  frontmatter: GuideFrontmatter;
  html: string;
  toc: GuideTocItem[];
  wordCount: number;
  readingTime: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export function getAllGuides(): GuideData[] {
  if (!fs.existsSync(GUIDES_DIR)) {
    return [];
  }

  const files = fs.readdirSync(GUIDES_DIR).filter((f) => f.endsWith('.md'));
  const guides: GuideData[] = [];

  for (const file of files) {
    const fullPath = path.join(GUIDES_DIR, file);
    const rawContent = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(rawContent);

    // Extract H2 headings for Table of Contents
    const toc: GuideTocItem[] = [];
    const h2Regex = /^##\s+(.+)$/gm;
    let match;
    while ((match = h2Regex.exec(content)) !== null) {
      const headingText = match[1].trim();
      toc.push({
        id: slugify(headingText),
        text: headingText,
      });
    }

    // Custom renderer for H2 to insert matching IDs for TOC anchor links
    const renderer = new marked.Renderer();
    renderer.heading = ({ text, depth }: { text: string; depth: number }) => {
      if (depth === 2) {
        const id = slugify(text);
        return `<h2 id="${id}">${text}</h2>`;
      }
      return `<h${depth}>${text}</h${depth}>`;
    };

    const html = marked.parse(content, { renderer }) as string;
    const words = content.replace(/\s+/g, ' ').trim().split(' ').length;
    const minutes = Math.ceil(words / 200);

    guides.push({
      frontmatter: data as GuideFrontmatter,
      html,
      toc,
      wordCount: words,
      readingTime: `${minutes} min read`,
    });
  }

  // Sort by date descending
  return guides.sort((a, b) => (a.frontmatter.date < b.frontmatter.date ? 1 : -1));
}

export function getGuideBySlug(slug: string): GuideData | undefined {
  const guides = getAllGuides();
  return guides.find((g) => g.frontmatter.slug === slug);
}

