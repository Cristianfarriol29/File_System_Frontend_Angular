function transformPathToSendByHttp(topNavigation: any) {
  let path = topNavigation.map((p:any, i:any) => i > 0 ?`/${p}` : p).toString()
  path = path.replace(/[,]+/g, "").trim();

  return path;
}


export {transformPathToSendByHttp}
