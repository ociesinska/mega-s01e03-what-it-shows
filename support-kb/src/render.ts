import { render } from 'svelte/server';

const pages = import.meta.glob('/src/routes/**/+page.svx', { eager: true });

export function renderPages() {
  return Object.entries(pages).map(([source, mod]: [string, any]) => {
    const rendered = render(mod.default);
    const route = source.replace('/src/routes', '').replace('/+page.svx', '');
    return {
      route,
      html: '<!doctype html>\n<html lang="en"><head><meta charset="utf-8">'
        + '<meta name="viewport" content="width=device-width, initial-scale=1">'
        + rendered.head + '</head><body>' + rendered.body + '</body></html>\n',
    };
  });
}
