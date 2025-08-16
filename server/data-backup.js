const fs = require('fs');
const path = require('path');

// Пути к файлам данных
const dataDir = path.join(__dirname, 'data');
const backupDir = path.join(__dirname, 'backup');

// Создаем директорию для резервных копий, если её нет
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

// Функция для создания резервной копии
function createBackup() {
  const files = [
    'products.json',
    'categories.json',
    'orders.json',
    'firmware-requests.json',
    'repair-requests.json',
    'blog-posts.json'
  ];

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(backupDir, `backup-${timestamp}`);

  if (!fs.existsSync(backupPath)) {
    fs.mkdirSync(backupPath, { recursive: true });
  }

  files.forEach(file => {
    const sourcePath = path.join(dataDir, file);
    const destPath = path.join(backupPath, file);

    if (fs.existsSync(sourcePath)) {
      try {
        fs.copyFileSync(sourcePath, destPath);
        console.log(`✅ Резервная копия создана: ${file}`);
      } catch (error) {
        console.error(`❌ Ошибка при создании резервной копии ${file}:`, error);
      }
    }
  });

  // Сохраняем информацию о резервной копии
  const backupInfo = {
    timestamp: new Date().toISOString(),
    files: files.filter(file => fs.existsSync(path.join(dataDir, file))),
    totalBackups: getBackupCount()
  };

  fs.writeFileSync(path.join(backupPath, 'backup-info.json'), JSON.stringify(backupInfo, null, 2));
  console.log(`📦 Резервная копия сохранена в: ${backupPath}`);
}

// Функция для восстановления из последней резервной копии
function restoreFromBackup() {
  const backups = getBackups();
  
  if (backups.length === 0) {
    console.log('❌ Резервные копии не найдены');
    return false;
  }

  const latestBackup = backups[backups.length - 1];
  const backupPath = path.join(backupDir, latestBackup);

  console.log(`🔄 Восстанавливаем из резервной копии: ${latestBackup}`);

  const files = [
    'products.json',
    'categories.json',
    'orders.json',
    'firmware-requests.json',
    'repair-requests.json',
    'blog-posts.json'
  ];

  files.forEach(file => {
    const sourcePath = path.join(backupPath, file);
    const destPath = path.join(dataDir, file);

    if (fs.existsSync(sourcePath)) {
      try {
        fs.copyFileSync(sourcePath, destPath);
        console.log(`✅ Восстановлен файл: ${file}`);
      } catch (error) {
        console.error(`❌ Ошибка при восстановлении ${file}:`, error);
      }
    }
  });

  return true;
}

// Функция для получения списка резервных копий
function getBackups() {
  if (!fs.existsSync(backupDir)) {
    return [];
  }

  return fs.readdirSync(backupDir)
    .filter(item => {
      const itemPath = path.join(backupDir, item);
      return fs.statSync(itemPath).isDirectory() && item.startsWith('backup-');
    })
    .sort();
}

// Функция для получения количества резервных копий
function getBackupCount() {
  return getBackups().length;
}

// Функция для очистки старых резервных копий (оставляет только последние 5)
function cleanupOldBackups() {
  const backups = getBackups();
  
  if (backups.length <= 5) {
    return;
  }

  const backupsToDelete = backups.slice(0, backups.length - 5);
  
  backupsToDelete.forEach(backup => {
    const backupPath = path.join(backupDir, backup);
    try {
      fs.rmSync(backupPath, { recursive: true, force: true });
      console.log(`🗑️ Удалена старая резервная копия: ${backup}`);
    } catch (error) {
      console.error(`❌ Ошибка при удалении резервной копии ${backup}:`, error);
    }
  });
}

// Экспортируем функции для использования в основном файле
module.exports = {
  createBackup,
  restoreFromBackup,
  getBackups,
  getBackupCount,
  cleanupOldBackups
};

// Если скрипт запущен напрямую
if (require.main === module) {
  const command = process.argv[2];

  switch (command) {
    case 'backup':
      createBackup();
      cleanupOldBackups();
      break;
    case 'restore':
      restoreFromBackup();
      break;
    case 'list':
      const backups = getBackups();
      console.log('📋 Доступные резервные копии:');
      backups.forEach((backup, index) => {
        console.log(`${index + 1}. ${backup}`);
      });
      break;
    default:
      console.log('Использование:');
      console.log('  node data-backup.js backup   - создать резервную копию');
      console.log('  node data-backup.js restore  - восстановить из последней резервной копии');
      console.log('  node data-backup.js list     - показать список резервных копий');
  }
}
