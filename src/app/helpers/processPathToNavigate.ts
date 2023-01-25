function processPathToNavigate(path:any) {


  return path.filter((v:any, i:any) => {
    if (path[path.length - 1] !== path[i]){

      return v
  }
  })
}

export {processPathToNavigate}
