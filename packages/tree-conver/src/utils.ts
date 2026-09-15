/**
 * 判断某个 pid/id 值是否为"空"。
 * `undefined` / `null` / `''` 统一视为缺失。
 * arrayToTree 与 treeToArray 共用，保证两者语义一致。
 */
export const isEmptyValue = (value: any): boolean =>
  value === undefined || value === null || value === '';

/**
 * 将 id/pid 值归一为 string；空值返回 undefined。
 */
export const normalizeId = (value: any): string | undefined =>
  isEmptyValue(value) ? undefined : String(value);
