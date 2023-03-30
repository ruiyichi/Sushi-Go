export const createLobbyCode = (length: number) => {
  let res = '';
  let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ012345679";
  let chars_len = chars.length;
  for (let i = 0; i < length; i ++) {
    res += chars.charAt(Math.floor(Math.random() * chars_len));
  }
  return res;
}