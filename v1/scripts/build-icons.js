// scripts/build-icons.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

import {
  siPython,
  siNodedotjs as siNJS,
  siGooglecloud,
  siDbeaver,
  siFigma,
  siIntellijidea,
  siApachenetbeanside as siBeans,
  siSqlite as siSql,
  siCplusplus,
  siTailwindcss as siTailwind,
  siElm,
  siHaskell,
  siJavascript,
  siSwift,
  siR,
  siPytorch,
  siAmazonwebservices as siAws,
  siPandas,
  siNumpy,
  siScikitlearn,
  siFlask,
  siReact,
  siPostgresql,
  siOverleaf,
  siJupyter,
  siJira,
  siRstudioide as siRstudio,
  siDocker,
  siGithub,
  siInstagram,
  siDiscord,
  siEslint,
} from 'simple-icons/icons';

// map icons
const iconExports = {
  python: siPython,
  nodejs: siNJS,
  figma: siFigma,
  intellij: siIntellijidea,
  googlecloud: siGooglecloud,
  dbeaver: siDbeaver,
  netbeans: siBeans,
  sql: siSql,
  cplusplus: siCplusplus,
  tailwind: siTailwind,
  elm: siElm,
  haskell: siHaskell,
  javascript: siJavascript,
  swift: siSwift,
  r: siR,
  eslint: siEslint,
  pytorch: siPytorch,
  aws: siAws,
  pandas: siPandas,
  numpy: siNumpy,
  'scikit-learn': siScikitlearn,
  flask: siFlask,
  react: siReact,
  postgresql: siPostgresql,
  overleaf: siOverleaf,
  jupyter: siJupyter,
  jira: siJira,
  rstudio: siRstudio,
  docker: siDocker,
  github: siGithub,
  instagram: siInstagram,
  discord: siDiscord,
  
  // these dont exist on simpleicon
  file: {
    svg: '<svg role="img" viewBox="0 0 24 24">' +
         '<path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6z"/>' +
         '</svg>'
  },

  linkedin: {
    svg:
      '<svg role="img" viewBox="0 0 24 24">' +
        '<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>' +
      '</svg>'
  },

  arrowSE: {
    svg:
      '<svg role="img" viewBox="0 0 24 24">' +
        '<path d="M7 7l10 10"/>' +
        '<path d="M17 7v10H7"/>' +
      '</svg>',
    stroke: true
  },

  arrowNE: {
    svg:
      '<svg role="img" viewBox="0 0 24 24">' +
        '<path d="M7 17l10-10"/>' +
        '<path d="M7 7h10v10"/>' +
      '</svg>',
    stroke: true
  }
};

// viewBox + path and build an object
const icons = Object.fromEntries(
  Object.entries(iconExports).map(([key, raw]) => {
    const svg = raw.svg;
    const viewBox = svg.match(/viewBox="([^\"]+)"/)[1];
    const paths = Array.from(svg.matchAll(/<path d="([^\"]+)"/g), m => m[1]);
    const entry = { viewBox };
    // stroke-based icons
    if (raw.stroke || paths.length > 1) {
      entry.paths = paths;
      if (raw.stroke) entry.stroke = true;
    } else {
      entry.path = paths[0];
    }
    return [key, entry];
  })
);

fs.writeFileSync(
  path.resolve('src', 'assets', 'icons', 'icons.json'),
  JSON.stringify(icons, null, 2)
);