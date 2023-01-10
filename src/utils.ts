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