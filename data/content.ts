// All site copy lives here, separate from the components.
// This is the layer a headless CMS (e.g. Sanity) would replace later.

export type Screen = { file: string; alt: string };
export type CaseStudy = { challenge: string; contribution: string; approach: string; outcome: string };

export type Project = {
  id: string;
  name: string;
  meta: string;
  link: { href: string; label: string };
  line: string;
  screens: Screen[];
  demo?: 'pipeline' | 'flashing';
  caseStudy: CaseStudy;
  tech: string[];
};

export const projects: Project[] = [
  {
    id: 'trak',
    name: 'TRAK',
    meta: 'JOB MANAGEMENT · WEB + MOBILE · 2023–2026',
    link: { href: 'https://www.trak.co', label: 'trak.co' },
    line: 'Senior Frontend Developer. I proposed and led CodePush, so eligible updates reach users in about 10 minutes instead of 1–2 days.',
    screens: [
      { file: 'trak-login', alt: 'Trak app welcome screen: every job in one app' },
      { file: 'trak-dashboard', alt: 'Trak dashboard with tasks, activity, sign on and web app' },
      { file: 'trak-schedule', alt: 'Trak schedule showing the day job by job' },
      { file: 'trak-swms', alt: 'Trak safety screen for selecting SWMS templates' },
    ],
    demo: 'pipeline',
    caseStudy: {
      challenge: 'Even a very small mobile change needed a fresh build and app-store approval, so releases could take one to two days.',
      contribution: 'I proposed Microsoft App Center CodePush and led its implementation, alongside React.js and Next.js web work and React Native features.',
      approach: 'Git-based code verification came before every eligible over-the-air release. On the web I built reusable components, integrated RESTful APIs and ran Lighthouse reviews.',
      outcome: 'Eligible updates reached production in about 10 minutes, so customers received suitable fixes sooner.',
    },
    tech: ['React.js', 'Next.js', 'React Native', 'RESTful APIs', 'CodePush', 'Lighthouse'],
  },
  {
    id: 'burdens',
    name: 'BURDENS',
    meta: 'TRADE PORTAL · WEB + MOBILE · 2020–2023',
    link: { href: 'https://burdensbathrooms.com.au/', label: 'burdensbathrooms.com.au' },
    line: 'Front End Developer at Digital Basis. Trade customers browse products, order, find stores and check invoices and statements on the web or in the app.',
    screens: [
      { file: 'burdens-dashboard', alt: 'Burdens dashboard with search, store finder and transactions' },
      { file: 'burdens-categories', alt: 'Burdens product categories' },
      { file: 'burdens-products', alt: 'Burdens product list with RRP and customer price' },
      { file: 'burdens-account', alt: 'Burdens account balance and payment details' },
      { file: 'burdens-stores', alt: 'Burdens store finder map' },
    ],
    caseStudy: {
      challenge: 'The same tasks had to make sense on the website and in a mobile app, which is more than shrinking screens.',
      contribution: 'Product browsing and filtering, shopping-cart orders, account information, invoices and statements.',
      approach: 'A new product around an existing web service: responsive interfaces, reusable components, RESTful APIs and cross-device testing.',
      outcome: 'Customers could complete the same core tasks on either channel. No sales or adoption figures are claimed.',
    },
    tech: ['React.js', 'React Native', 'JavaScript', 'Responsive UI', 'RESTful APIs'],
  },
  {
    id: 'flashing',
    name: 'FLASHING DESIGNER',
    meta: 'MOBILE · COMPLEX LOGIC, CLEAR INTERFACE',
    link: { href: 'https://apps.apple.com/au/app/burdens-flashing-designer/id6449658670', label: 'App Store' },
    line: 'Customers draw a custom metal flashing, set lengths and angles, and order it. I built the calculation features, validated with a physicist and a mathematician.',
    screens: [
      { file: 'flashing-new', alt: 'Create a new flashing: name, colour, quantity and length' },
      { file: 'flashing-draw', alt: 'Draw the shape of the flashing on a grid' },
      { file: 'flashing-edge-type', alt: 'Select an edge type, with lengths and angles shown' },
      { file: 'flashing-paint-edge', alt: 'Specify which edge is painted' },
    ],
    demo: 'flashing',
    caseStudy: {
      challenge: 'Mathematical calculations and algorithmic requirements had to become reliable, understandable features.',
      contribution: 'I built the calculation-related functionality and worked with a physicist and a mathematician to check the algorithms.',
      approach: 'Ask the right questions early and validate with specialists. I also helped move the app from React Native with Expo to bare React Native.',
      outcome: 'Specialist requirements became working mobile functionality, with accuracy and validation guiding the build.',
    },
    tech: ['React Native', 'Expo migration', 'JavaScript', 'Algorithmic calculations'],
  },
];

export const experience = [
  {
    when: 'Sep 2023 – Jun 2026',
    role: 'Senior Frontend Developer',
    company: 'Trak',
    companyUrl: 'https://www.trak.co',
    place: 'Melbourne',
    points: [
      'React.js and Next.js web experiences alongside React Native features for a job management platform.',
      'Reusable components, RESTful APIs, Lighthouse reviews and accessibility improvements.',
      'Proposed and led CodePush: eligible releases in ~10 minutes instead of 1–2 days.',
    ],
  },
  {
    when: 'Dec 2020 – Sep 2023',
    role: 'Front End Developer',
    company: 'Digital Basis',
    place: 'Melbourne',
    points: [
      'New web and mobile products with React.js, Next.js, React Native and Node.js.',
      'Reusable UI components with Storybook and Fractal, CMS workflows and accessible patterns.',
      'Technical SEO, Google Analytics and Matomo, working closely with designers and specialists.',
    ],
  },
];

export const education = [
  { name: 'Bachelor of Software Engineering', year: '2018' },
  { name: 'Advanced Diploma of Webmaster', year: '2017' },
  { name: 'Diploma of Analysis and Development of Information Systems', year: '2015' },
];
export const certifications = [
  { name: 'Blue Card', year: '2024' },
  { name: 'Scrum Foundation Professional Certificate', year: '2020' },
];
export const toolkit = ['Git · GitHub · Bitbucket', 'Jira · Scrum', 'Figma · Adobe XD', 'AWS', 'SharePoint', 'Sitecore'];

export const stack = ['React.js', 'Next.js', 'React Native', 'TypeScript', 'JavaScript ES6+', 'HTML5', 'CSS3', 'RESTful APIs', 'JSON', 'Node.js', 'WordPress', 'Shopify', 'Sitecore', 'WCAG', 'Lighthouse', 'Storybook', 'Matomo', 'Git', 'Figma'];

export const why = [
  { n: '01 · PURPOSE', title: 'Public-facing work that matters', text: 'I enjoy interfaces that look good, work reliably and make sense to the people using them. Visitors, students and researchers deserve that.' },
  { n: '02 · PLATFORM', title: 'Ready for headless', text: 'React.js and Next.js in both roles, plus years structuring and presenting CMS content through APIs. This site is built with Next.js as a static export.' },
  { n: '03 · EVERY VISITOR', title: 'Accessible and fast by default', text: 'Semantic HTML, WCAG principles, Lighthouse, analytics and cross-device testing are already part of how I deliver.' },
  { n: '04 · TEAMWORK', title: 'Comfortable across disciplines', text: 'Designers, content teams, stakeholders, even a physicist and a mathematician. I explain options clearly and keep the outcome in focus.' },
];

export type Requirement = { title: string; type: 'required' | 'desirable'; status: 'direct' | 'transferable'; evidence: string };

export const requirements: Requirement[] = [
  { title: 'Relevant qualification', type: 'required', status: 'direct', evidence: 'Bachelor of Software Engineering (2018), Advanced Diploma of Webmaster (2017) and Diploma of Analysis and Development of Information Systems (2015).' },
  { title: 'Modern front end web applications', type: 'required', status: 'direct', evidence: 'More than five years building and improving web applications at Trak and Digital Basis, covering new products and established platforms.' },
  { title: 'HTML5, CSS3 and JavaScript ES6+', type: 'required', status: 'direct', evidence: 'Core tools in both roles, and the base of every component on this site.' },
  { title: 'React and Next.js', type: 'required', status: 'direct', evidence: 'React.js and Next.js web experiences at Trak and Digital Basis, plus React Native for the matching mobile products. This portfolio is a Next.js app.' },
  { title: 'Headless CMS (Sanity, Contentful or similar)', type: 'required', status: 'transferable', evidence: 'Content-driven work with WordPress, Shopify, SharePoint and Sitecore, and structuring and presenting dynamic content in React and Next.js through RESTful APIs. The content of this site already lives in a separate data layer, ready to move to a headless CMS.' },
  { title: 'Responsive, mobile-first design', type: 'required', status: 'direct', evidence: 'Burdens required the same tasks to work on the website and in a mobile app, so layouts were planned around how people complete tasks in each context.' },
  { title: 'RESTful APIs and JSON', type: 'required', status: 'direct', evidence: 'API integration across web and mobile in both roles, including ordering, account information, invoices and statements.' },
  { title: 'Git and version control workflows', type: 'required', status: 'direct', evidence: 'Git, GitHub and Bitbucket. At Trak, Git-based code verification was the gate before any over-the-air release. This site deploys from GitHub Actions.' },
  { title: 'Accessibility standards (WCAG)', type: 'required', status: 'direct', evidence: 'Semantic HTML, sensible heading structures, descriptive links, image alternatives and keyboard access. I use Lighthouse, and I know automated checks don’t replace manual testing.' },
  { title: 'Performance, usability and SEO', type: 'required', status: 'direct', evidence: 'Lighthouse reviews, refactoring, cross-browser testing and technical SEO at both Trak and Digital Basis.' },
  { title: 'Next.js applications (SSG)', type: 'desirable', status: 'direct', evidence: 'Next.js web experiences in both roles. This site is statically generated with Next.js and served from GitHub Pages.' },
  { title: 'Analytics and engagement platforms', type: 'desirable', status: 'direct', evidence: 'Google Analytics and Matomo, used to understand how digital products were being used and to guide improvements.' },
  { title: 'Design systems and component libraries', type: 'desirable', status: 'direct', evidence: 'Reusable UI components documented with Storybook and Fractal at Digital Basis; component documentation at Trak.' },
];

export const evidence = {
  vision: [
    { label: 'Thinks critically about purpose', text: 'At Burdens the challenge was not reproducing a screen on a smaller device. We worked out how people complete the same tasks in different contexts, then designed for each.' },
    { label: 'Embraces modern web technology', text: 'React.js and Next.js in both roles, and a clear path from traditional CMS work to headless content delivery through APIs.' },
    { label: 'Adapts to change', text: 'Moved Burdens Flashing Designer from React Native with Expo to React Native without Expo while the product kept evolving.' },
  ],
  results: [
    { label: 'User-centred delivery', text: 'Lighthouse, Google Analytics and Matomo helped me look past “feature delivered” to how well it worked for the people using it.' },
    { label: 'Multidisciplinary collaboration', text: 'Worked with a physicist and a mathematician to validate the algorithms behind Flashing Designer before building them.' },
    { label: 'Ownership and improvement', text: 'Proposed and led CodePush at Trak. Eligible releases went from one to two days to about 10 minutes.' },
  ],
  accountability: [
    { label: 'Standards and best practice', text: 'Semantic HTML, accessible patterns, Git-based workflows, code verification and testing across browsers and devices.' },
    { label: 'Clear communication', text: 'Explaining options to designers, developers, stakeholders and specialists, listening to constraints and keeping the outcome in focus.' },
    { label: 'Continuous learning', text: 'Moving from traditional CMS platforms towards headless architecture, and rebuilding this site in Next.js to practise what the role asks for.' },
  ],
};

export const contact = {
  email: 'solanojefferson@gmail.com',
  linkedin: 'https://www.linkedin.com/in/jefferson-solano-b783b973',
};
