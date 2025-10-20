const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, '..', 'src', 'locales');
const SUPPORTED_LOCALES = ['en', 'es'];
const TRANSLATION_FILES = ['common.json', 'purchase.json'];

function readTranslationFile(locale, filename) {
  const filePath = path.join(LOCALES_DIR, locale, filename);
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.warn(`⚠️  Warning: Could not read ${locale}/${filename}`);
    return {};
  }
}

function writeTranslationFile(locale, filename, data) {
  const filePath = path.join(LOCALES_DIR, locale, filename);
  const dir = path.dirname(filePath);
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  const content = JSON.stringify(data, null, 2) + '\n';
  fs.writeFileSync(filePath, content, 'utf8');
}

function getAllKeysForFile(filename) {
  const allKeys = new Set();
  
  SUPPORTED_LOCALES.forEach(locale => {
    const translations = readTranslationFile(locale, filename);
    Object.keys(translations).forEach(key => allKeys.add(key));
  });
  
  return Array.from(allKeys).sort();
}

function addMissingKeys(locale, filename, allKeys, baseLocale = 'en') {
  const translations = readTranslationFile(locale, filename);
  const baseTranslations = readTranslationFile(baseLocale, filename);
  let hasChanges = false;
  
  allKeys.forEach(key => {
    if (!(key in translations)) {
      const baseValue = baseTranslations[key] || key;
      translations[key] = locale === baseLocale ? baseValue : `[TODO: ${baseValue}]`;
      hasChanges = true;
      console.log(`➕ Added key "${key}" to ${locale}/${filename}`);
    }
  });
  
  if (hasChanges) {
    writeTranslationFile(locale, filename, translations);
  }
  
  return hasChanges;
}

function validateTranslations() {
  console.log('🔍 Validating translations...\n');
  
  let hasIssues = false;
  
  TRANSLATION_FILES.forEach(filename => {
    console.log(`📄 Checking ${filename}:`);
    
    const allKeys = getAllKeysForFile(filename);
    const keysByLocale = {};
    
    SUPPORTED_LOCALES.forEach(locale => {
      const translations = readTranslationFile(locale, filename);
      keysByLocale[locale] = Object.keys(translations);
    });
    
    SUPPORTED_LOCALES.forEach(locale => {
      const missingKeys = allKeys.filter(key => !keysByLocale[locale].includes(key));
      if (missingKeys.length > 0) {
        console.log(`  ❌ ${locale}: Missing keys: ${missingKeys.join(', ')}`);
        hasIssues = true;
      } else {
        console.log(`  ✅ ${locale}: All keys present (${keysByLocale[locale].length} keys)`);
      }
    });
    
    console.log('');
  });
  
  return !hasIssues;
}

function syncTranslations() {
  console.log('🔄 Syncing translations...\n');
  
  TRANSLATION_FILES.forEach(filename => {
    console.log(`📄 Syncing ${filename}:`);
    
    const allKeys = getAllKeysForFile(filename);
    let totalChanges = 0;
    
    SUPPORTED_LOCALES.forEach(locale => {
      const hasChanges = addMissingKeys(locale, filename, allKeys);
      if (hasChanges) totalChanges++;
    });
    
    if (totalChanges === 0) {
      console.log(`  ✅ No changes needed`);
    } else {
      console.log(`  📝 Updated ${totalChanges} locale(s)`);
    }
    
    console.log('');
  });
}

function addTranslationKey(filename, key, value, description = '') {
  console.log(`➕ Adding new translation key: "${key}"\n`);
  
  SUPPORTED_LOCALES.forEach(locale => {
    const translations = readTranslationFile(locale, filename);
    
    if (key in translations) {
      console.log(`  ⚠️  Key "${key}" already exists in ${locale}/${filename}`);
      return;
    }
    
    translations[key] = locale === 'en' ? value : `[TODO: ${value}]`;
    
    writeTranslationFile(locale, filename, translations);
    console.log(`  ✅ Added to ${locale}/${filename}: "${translations[key]}"`);
  });
}

function listTodos() {
  console.log('📋 TODO Translations:\n');
  
  let todoCount = 0;
  
  TRANSLATION_FILES.forEach(filename => {
    SUPPORTED_LOCALES.forEach(locale => {
      if (locale === 'en') return; // Skip base locale
      
      const translations = readTranslationFile(locale, filename);
      const todos = Object.entries(translations)
        .filter(([key, value]) => value.startsWith('[TODO:'))
        .map(([key, value]) => ({ key, value }));
      
      if (todos.length > 0) {
        console.log(`📄 ${locale}/${filename}:`);
        todos.forEach(({ key, value }) => {
          console.log(`  • ${key}: ${value}`);
          todoCount++;
        });
        console.log('');
      }
    });
  });
  
  if (todoCount === 0) {
    console.log('🎉 All translations are complete!');
  } else {
    console.log(`📊 Total TODO items: ${todoCount}`);
  }
}

function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  switch (command) {
    case 'validate':
      const isValid = validateTranslations();
      process.exit(isValid ? 0 : 1);
      break;
      
    case 'sync':
      syncTranslations();
      console.log('✅ Translation sync complete!');
      break;
      
    case 'add':
      const [filename, key, value] = args.slice(1);
      if (!filename || !key || !value) {
        console.log('Usage: npm run i18n:add <filename> <key> "<value>"');
        console.log('Example: npm run i18n:add common.json newKey "New Value"');
        process.exit(1);
      }
      addTranslationKey(filename, key, value);
      break;
      
    case 'todos':
      listTodos();
      break;
      
    default:
      console.log('🌍 Bob\'s Corn - Translation Manager\n');
      console.log('Available commands:');
      console.log('  validate  - Check if all locales have the same keys');
      console.log('  sync      - Add missing keys to all locales');
      console.log('  add       - Add a new translation key to all locales');
      console.log('  todos     - List all TODO translations');
      console.log('\nExamples:');
      console.log('  npm run i18n:validate');
      console.log('  npm run i18n:sync');
      console.log('  npm run i18n:add common.json greeting "Hello World"');
      console.log('  npm run i18n:todos');
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  validateTranslations,
  syncTranslations,
  addTranslationKey,
  listTodos
};