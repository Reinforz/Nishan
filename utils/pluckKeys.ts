export default function (target: Record<string, any>, source: Record<string, any>, keys: string[] | [string, any][]) {
  const res: Record<string, any> = {};
  const allowed_keys = keys.map((key) => (Array.isArray(key) ? key[0] : key));
  allowed_keys.forEach((allowed_key, index) => {
    if (target[allowed_key]) {
      if (Array.isArray(keys[index])) res[allowed_key] = keys[index][1](target[allowed_key]);
      else res[allowed_key] = target[allowed_key];
    } else res[allowed_key] = source[allowed_key];
  });
  return res;
};
