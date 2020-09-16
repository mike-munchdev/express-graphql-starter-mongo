const extractHostname = (url) => {
  if (!url) return;
  let hostname;
  //find & remove protocol (http, ftp, etc.) and get hostname

  if (url.indexOf('//') > -1) {
    hostname = url.split('/')[2];
  } else {
    hostname = url.split('/')[0];
  }

  //find & remove port number
  hostname = hostname.split(':')[0];
  //find & remove "?"
  hostname = hostname.split('?')[0];

  return hostname;
};

// assumses call to extractHost
module.exports.getDomainNameBrandUrl = (url) => {
  let hostName = extractHostname(url);
  if (!hostName) return;

  const hostNameArray = hostName.split('.');

  return `${hostNameArray[hostNameArray.length - 2]}.${
    hostNameArray[hostNameArray.length - 1]
  }`;
};
