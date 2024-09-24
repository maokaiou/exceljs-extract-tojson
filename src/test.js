const levenshtein = require('fast-levenshtein');
function isSimilar(str1, str2, threshold = 0.4) {
  const distance = levenshtein.get(str1, str2);
  const maxLength = Math.max(str1.length, str2.length);
  const similarity = 1 - (distance / maxLength);
  // return similarity >= threshold;
  // console.log(distance,similarity,similarity >= threshold)
  // console.log('1、DLP、激光光源、1080p2、商教全能'.split('\n'))
}
isSimilar('主要功能为 打印','复印 打印 扫描 传真')