import { Response } from "node-fetch";

export const handleResponseErrors = (response: Response) => {
  try {
    if (!response.ok) {
      throw response.statusText;
    }
    else {
      return response.json();
    }
  }
  catch(e) {
    return console.log(e);
  }
}

export const createLobbyCode = (length: number) => {
  let res = '';
  let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ012345679";
  let chars_len = chars.length;
  for (let i = 0; i < length; i ++) {
    res += chars.charAt(Math.floor(Math.random() * chars_len));
  }
  return res;
}