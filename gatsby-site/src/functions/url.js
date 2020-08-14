export const extractHostname = (fullHost) => {
    let imageOrigin = null;
    if (fullHost) {
        const indexOfLastDot = fullHost.lastIndexOf('.');
        if (indexOfLastDot >= 0) {
            const tld = fullHost.substr(indexOfLastDot);
            const domainName = fullHost.substr(0, indexOfLastDot);
            const indexOfSecondDot = domainName.lastIndexOf('.');
            let hostname = null;
            if (indexOfSecondDot >= 0) {
                hostname = domainName.substr(indexOfSecondDot + 1);
            } else {
                hostname = domainName;
            }
            imageOrigin = `${hostname}${tld}`;
        }
    }
    return imageOrigin;
}
