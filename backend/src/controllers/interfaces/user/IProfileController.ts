

export default interface IProfileController {
    updateProfileImageController(req:any, res:any): Promise<void>
    updateProfileController(req: any, res: any): Promise<void>
}