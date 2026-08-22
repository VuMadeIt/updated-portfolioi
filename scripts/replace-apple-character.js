/**
 * Replace Apple logo character () with "Apple" text in all Sanity documents
 * 
 * Usage: node scripts/replace-apple-character.js
 * 
 * Set SANITY_TOKEN environment variable with a token that has write permissions
 */

import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config();

const client = createClient({
  projectId: 'am3v0x1c',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_TOKEN || '', // Read token from environment
});

// The Apple logo character
const APPLE_CHAR = '';

/**
 * Recursively search for Apple character in an object and replace it
 */
function replaceAppleCharInObject(obj, path = '') {
  const changes = [];
  
  if (typeof obj === 'string') {
    if (obj.includes(APPLE_CHAR)) {
      const newValue = obj.replace(new RegExp(APPLE_CHAR, 'g'), 'Apple');
      changes.push({ path, oldValue: obj, newValue });
      return { value: newValue, changes };
    }
    return { value: obj, changes };
  }
  
  if (Array.isArray(obj)) {
    const newArray = [];
    obj.forEach((item, index) => {
      const result = replaceAppleCharInObject(item, `${path}[${index}]`);
      newArray.push(result.value);
      changes.push(...result.changes);
    });
    return { value: newArray, changes };
  }
  
  if (obj && typeof obj === 'object') {
    const newObj = {};
    for (const [key, value] of Object.entries(obj)) {
      // Skip system fields
      if (key.startsWith('_')) {
        newObj[key] = value;
        continue;
      }
      
      const result = replaceAppleCharInObject(value, path ? `${path}.${key}` : key);
      newObj[key] = result.value;
      changes.push(...result.changes);
    }
    return { value: newObj, changes };
  }
  
  return { value: obj, changes };
}

/**
 * Main function to find and replace Apple characters
 */
async function replaceAppleCharacters() {
  console.log('🔍 Searching for documents with Apple logo character ()...\n');
  
  // Fetch all documents (you might want to filter by document type)
  const query = '*[!(_id in path("drafts.**"))]';
  const documents = await client.fetch(query);
  
  console.log(`📄 Found ${documents.length} documents to check\n`);
  
  const documentsToUpdate = [];
  
  // Check each document for Apple character
  for (const doc of documents) {
    const result = replaceAppleCharInObject(doc);
    
    if (result.changes.length > 0) {
      console.log(`\n📝 Document: ${doc._type} (${doc._id})`);
      console.log(`   Changes found: ${result.changes.length}`);
      
      result.changes.forEach(change => {
        console.log(`   - ${change.path}:`);
        console.log(`     Old: "${change.oldValue}"`);
        console.log(`     New: "${change.newValue}"`);
      });
      
      documentsToUpdate.push({
        _id: doc._id,
        _type: doc._type,
        original: doc,
        updated: result.value,
        changes: result.changes
      });
    }
  }
  
  if (documentsToUpdate.length === 0) {
    console.log('\n✅ No documents found with Apple logo character ()');
    return;
  }
  
  console.log(`\n\n📊 Summary: Found ${documentsToUpdate.length} document(s) to update`);
  console.log('\n⚠️  Ready to update documents. Continue? (Ctrl+C to cancel)');
  
  // Wait for user confirmation
  await new Promise(resolve => {
    setTimeout(() => {
      console.log('\n⏳ Proceeding with updates in 3 seconds...');
      setTimeout(resolve, 3000);
    }, 2000);
  });
  
  // Update documents
  const transaction = client.transaction();
  
  documentsToUpdate.forEach(({ _id, updated }) => {
    // Remove system fields that shouldn't be updated
    const { _createdAt, _updatedAt, _rev, ...updateData } = updated;
    transaction.patch(_id, { set: updateData });
  });
  
  try {
    console.log('\n🚀 Updating documents...');
    const result = await transaction.commit();
    console.log(`✅ Successfully updated ${result.results.length} document(s)!`);
    
    console.log('\n📋 Updated documents:');
    documentsToUpdate.forEach(({ _id, _type, changes }) => {
      console.log(`   - ${_type} (${_id}): ${changes.length} change(s)`);
    });
  } catch (error) {
    console.error('\n❌ Error updating documents:', error.message);
    throw error;
  }
}

// Check for token
if (!process.env.SANITY_TOKEN) {
  console.error('❌ Error: SANITY_TOKEN environment variable is not set');
  console.error('\nPlease set it with a token that has write permissions:');
  console.error('  export SANITY_TOKEN="your-token-here"');
  console.error('  node scripts/replace-apple-character.js');
  process.exit(1);
}

// Run the script
replaceAppleCharacters()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  });
