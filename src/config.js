const path = require('node:path');

const SHEET_NAME = process.argv[2]
console.log('SHEET_NAME',SHEET_NAME)
const HOME =  process.env.HOME || process.env.USERPROFILE
module.exports = {
  HOME,
  SHEET_NAME,
  XLSX_FILE_PATH: path.join(__dirname, '../xlsx/1.xlsx'),
  Tag_JSON_PATH: path.join(__dirname, '../json/tag-json', `${SHEET_NAME}.json`),
  EXISTING_JSON_PATH: path.join(__dirname, '../json/existing-json', `${SHEET_NAME}.json`),
  DEV_JSON_PATH: path.join(__dirname, '../json/dev-json', `${SHEET_NAME}.json`),
  DESKTOP_JSON_PATH: path.join(HOME, 'Desktop', 'ricoh', 'ricoh-data', 'json', '产品中心', `${SHEET_NAME}.json`)
};