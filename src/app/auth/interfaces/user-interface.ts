export interface User {
  confirmed: string
email:string,
isAdmin:boolean,
name:string
password:string,
surname: string
token:string,
__v: number,
_id: string,
image: string,
userCreator: string,
usersWithPermission: string,
filesToVerify?:  string[],
admin: boolean
}
