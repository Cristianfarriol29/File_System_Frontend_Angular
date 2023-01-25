function processNavigationPathWithValidation(validation: boolean, path: string ){
 return path.split("/").filter((v:any) =>{

    return v !== 'validation' && v
  }).join("/")
}

 function sendEmailToUserCreator({archivo, emailVerifier, emailCreator, action, file, fullPath, comments}: any){
  const link = "https://prod-75.westeurope.logic.azure.com:443/workflows/ddcd265b04144fbbb37fd6eff97c5bb1/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=Ui2saGxH95Tz9Cocs1g7IN21gYkYE-7rkg12u43yhe0"
let actionHeader: string = ""
let actionBody: string = ""


  switch (action) {
    case "read":
      actionHeader = `File has been read by ${emailVerifier}`;
      actionBody = `The file(s) that were pending verification in the path <a style="text-decoration:none href="${archivo}">Go to Path</a> has been read by the user verifier assigned for verification`
      break
      case "download":
      actionHeader = `The file has been downloaded by ${emailVerifier}`;
      actionBody = `The file <b><i>${file}</i></b> pending verification in the path <a style="text-decoration:none" href="${archivo}">Go to Path</a> has been downloaded by the user assigned for verification`
      break
      case "verify":
        actionHeader = `The file has been verified by ${emailVerifier}`;
        actionBody = `The file <b><a>${file}</a></b> has been verified by ${emailVerifier} and has left the following comment: '<i><b>${comments}</b></i>' `
        break
    default:
      break
  }


const objectToSend = {
actionHeader,
actionBody,
emailCreator
}


var xhr = new XMLHttpRequest();
xhr.open(
  "POST",
   link,
  true
);

xhr.setRequestHeader("Content-Type", "application/json")


xhr.send(JSON.stringify(objectToSend))

if(action === "download"){
// setTimeout(() => {
  const enlace = document.createElement("a")
enlace.href = "https://dlab.typsa.net/montenegro-back/server/" + fullPath
enlace.target = "_blank"
enlace.click()
// }, 1000);
}


}


export {processNavigationPathWithValidation, sendEmailToUserCreator}
