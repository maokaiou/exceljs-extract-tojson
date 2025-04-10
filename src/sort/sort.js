const fs = require('fs');
const path = require('node:path');
const SHEET_NAME = 'LCD 高清系列';

// 文件路径
const JSON_PATH = path.join(process.cwd(), 'json/sort-json', `${SHEET_NAME}.json`);
const WRITE_PATH = path.join(process.cwd(), 'json/sort-json/new', `${SHEET_NAME}.json`);

// 确保目标目录存在
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`创建目录: ${dirPath}`);
  }
};

// 修复数组元素中的前导空格
// const arr = [
//   'M 2510', 'M 2310N', 'M 2810N', 'IM 460F', 'IM 2500', 'IM 3000', 'IM 3500', 'IM 4000', 'IM 5000',
//   'IM 6000', 'IM 2500e3', 'IM 3500e3', 'IM 7000', 'IM 8000', 'IM 9000', 'GS3025m', 'GS3050m', 'MP 2014', 'MP 2014N',
//   'MP 2014D', 'MP 2014DN', 'MP 2014AD', 'MP 2014ADN', 'M 2700', 'M 2701', 'IM 2702', 'MP 305+SP'
// ];
const arr = ['RL 1004K50','RL 754K50','RL 984K50','RL 854K50','RL 1104K50','RL 864K50','RL 654K50']

try {
  // 直接读取JSON文件
  console.log(`正在读取文件: ${JSON_PATH}`);
  
  if (!fs.existsSync(JSON_PATH)) {
    console.error(`文件不存在: ${JSON_PATH}`);
    process.exit(1);
  }
  
  const fileContent = fs.readFileSync(JSON_PATH, 'utf8');
  console.log(`文件内容长度: ${fileContent.length} 字节`);
  
  // 解析JSON
  let json;
  try {
    json = JSON.parse(fileContent);
    console.log(`JSON解析成功，类型: ${typeof json}, 是否为数组: ${Array.isArray(json)}`);
    
    if (Array.isArray(json)) {
      console.log(`数组长度: ${json.length}`);
    }
  } catch (parseError) {
    console.error('JSON解析失败:', parseError.message);
    console.log('文件内容前100个字符:', fileContent.substring(0, 100));
    process.exit(1);
  }
  
  // 确保json是数组
  if (!Array.isArray(json)) {
    console.error('JSON不是数组，无法排序');
    console.log('JSON类型:', typeof json);
    process.exit(1);
  }
  
  // 根据arr数组中的顺序对json进行排序
  const sortedJson = sortJsonByModelOrder(json, arr);
  
  // 确保目标目录存在
  ensureDirectoryExists(path.dirname(WRITE_PATH));
  
  // 将排序后的JSON写回文件
  fs.writeFileSync(WRITE_PATH, JSON.stringify(sortedJson, null, 2), 'utf8');
  
  console.log(`排序完成，已写入文件: ${WRITE_PATH}`);
} catch (error) {
  console.error('排序过程中发生错误:', error.message);
  console.error(error.stack);
}

// 根据指定的型号顺序对JSON数组进行排序
function sortJsonByModelOrder(jsonArray, modelOrder) {
  // 创建一个映射，存储每个型号在modelOrder中的索引
  const orderMap = {};
  modelOrder.forEach((model, index) => {
    orderMap[model] = index;
  });
  
  // 对JSON数组进行排序
  return [...jsonArray].sort((a, b) => {
    const modelA = a.型号;
    const modelB = b.型号;
    
    // 如果型号在orderMap中存在，则按照orderMap中的顺序排序
    // 否则将未知型号放在最后
    const indexA = orderMap[modelA] !== undefined ? orderMap[modelA] : Number.MAX_SAFE_INTEGER;
    const indexB = orderMap[modelB] !== undefined ? orderMap[modelB] : Number.MAX_SAFE_INTEGER;
    
    return indexA - indexB;
  });
}
