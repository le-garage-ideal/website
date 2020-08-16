export const copyToClipboard = text => {
    return new Promise((resolve, reject) => {
        navigator.permissions.query({name: "clipboard-write"}).then(result => { 
            if (result.state === "granted" || result.state === "prompt") {
                return navigator.clipboard.writeText(text).then(resolve, reject);
            } else {
                reject();
            }
        }, () => reject());
    });
}

