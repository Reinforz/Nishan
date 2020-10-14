import colors from 'colors';

export const error = (msg: string) => {
  console.log(colors.red.bold(msg));
  return msg;
};
export const warn = (msg: string) => {
  console.log(colors.yellow.bold(msg));
  return msg;
};
