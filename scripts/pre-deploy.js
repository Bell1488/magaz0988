#!/usr/bin/env node

const { createBackup } = require('../server/data-backup');

console.log('🚀 Создание резервной копии перед деплоем...');

try {
  createBackup();
  console.log('✅ Резервная копия создана успешно');
  process.exit(0);
} catch (error) {
  console.error('❌ Ошибка при создании резервной копии:', error);
  process.exit(1);
}
