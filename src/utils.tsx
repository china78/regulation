const S4 = () => {
  return ((1 + Math.random()) * 0x10000).toString(16).substring(1);
};

export const guid = () => {
  return `${S4() + S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`;
};