export const copyToClipboard = text => new Promise((resolve, reject) => {
  navigator.permissions.query({ name: 'clipboard-write' }).then(result => {
    if (result.state === 'granted' || result.state === 'prompt') {
      navigator.clipboard.writeText(text).then(resolve, reject);
    } else {
      reject();
    }
  }, () => reject());
});
