// Script to seed experiment projects into Sanity
// Run with: SANITY_TOKEN=<your-token> node scripts/seed-experiment-projects.js

const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'am3v0x1c',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_TOKEN, // Need a write token
});

/** Keep in sync with the home work grid side projects. */
const experimentProjects = [
  {
    _type: 'experimentProject',
    projectId: 'parrot',
    title: 'Parrot',
    year: '2026',
    description: 'Creating the end-to-end experience for an iMessage integration',
    backgroundColor: '#ffffff',
    order: 0,
    isPublished: true,
  },
  {
    _type: 'experimentProject',
    projectId: 'creators-collective',
    title: 'Creators Collective',
    year: '2026',
    description:
      "Building a online exhibit to flaunt Waterloo's creatives",
    tryItOutHref: 'https://creatorscollective.framer.website/',
    backgroundColor: '#ffffff',
    toolCategories: [
      { _type: 'toolCategory', _key: 'design', label: 'Design', tools: ['Figma'] },
      { _type: 'toolCategory', _key: 'development', label: 'Development', tools: ['Framer'] },
      { _type: 'toolCategory', _key: 'role', label: 'Role', tools: ['Web Designer'] },
      { _type: 'toolCategory', _key: 'team', label: 'Team', tools: ['4 Web Designers', '1 Design Lead'] },
    ],
    order: 1,
    isPublished: true,
  },
];

async function seedProjects() {
  if (!process.env.SANITY_TOKEN) {
    console.error('Error: SANITY_TOKEN environment variable is required');
    console.log('Get a token from: https://www.sanity.io/manage/project/am3v0x1c/api#tokens');
    process.exit(1);
  }

  console.log('Seeding experiment projects...\n');

  for (const project of experimentProjects) {
    try {
      // Check if project already exists
      const existing = await client.fetch(
        `*[_type == "experimentProject" && projectId == $projectId][0]`,
        { projectId: project.projectId }
      );

      if (existing) {
        console.log(`⏭️  Skipping "${project.title}" - already exists (id: ${existing._id})`);
        continue;
      }

      // Create the document
      const result = await client.create(project);
      console.log(`✅ Created "${project.title}" (id: ${result._id})`);
    } catch (error) {
      console.error(`❌ Error creating "${project.title}":`, error.message);
    }
  }

  console.log('\nDone! You can now view these in Sanity Studio under "Experiment Project".');
}

seedProjects();
