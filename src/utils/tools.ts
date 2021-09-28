/**
 * 将 UNIX timestamp 时间标签转换成 formatter 格式
 * @param {Number} 时间标签 e.g. 1463368789044
 * @param {String} 格式 e.g. 'yyyy-mm-dd hh:MM'
 * @returns {String} e.g. '2016-05-16 18:17'
 */
export const timestampConverter = (
  timestamp: number,
  formatter: string,
): string => {
  const a = new Date(timestamp * 1000);
  const months = [
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12',
  ];
  const year = '' + a.getFullYear();
  const month = months[a.getMonth()];
  const day = '0' + a.getDate();
  const hour = '0' + a.getHours();
  const minute = '0' + a.getMinutes();
  const second = '0' + a.getSeconds();

  return formatter
    .replace('yyyy', year)
    .replace('yy', year.substr(-2))
    .replace('mm', month)
    .replace('dd', day.substr(-2))
    .replace('hh', hour.substr(-2))
    .replace('MM', minute.substr(-2))
    .replace('ss', second.substr(-2));
};
