// client/src/lib/meta.ts

import type {
  DetailedHTMLProps,
  LinkHTMLAttributes,
  MetaHTMLAttributes,
} from "react";

type MetaTag = DetailedHTMLProps<
  MetaHTMLAttributes<HTMLMetaElement>,
  HTMLMetaElement
>;

type LinkTag = DetailedHTMLProps<
  LinkHTMLAttributes<HTMLLinkElement>,
  HTMLLinkElement
>;

type HeadConfig = {
  title: string;
  description?: string;
  path?: string;
};

const SITE_NAME = "Note Manager";
const BASE_URL = import.meta.env.VITE_APP_URL || "https://localhost:5173";

export function buildHead({ title, description, path }: HeadConfig): {
  title: string;
  meta?: MetaTag[];
  links?: LinkTag[];
} {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const url = path ? `${BASE_URL}${path}` : BASE_URL;

  const meta: MetaTag[] = [
    { property: "og:title", content: fullTitle },
    { property: "og:url", content: url },
  ];

  if (description) {
    meta.push(
      { name: "description", content: description },
      { property: "og:description", content: description },
    );
  }

  const links: LinkTag[] = [];
  if (path) {
    links.push({ rel: "canonical", href: url });
  }

  return {
    title: fullTitle,
    meta,
    links: links.length ? links : undefined,
  };
}
