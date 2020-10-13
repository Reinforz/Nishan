import colors from 'colors';

export const error = (msg: string) => console.log(colors.red.bold(msg));
export const warn = (msg: string) => console.log(colors.yellow.bold(msg));
