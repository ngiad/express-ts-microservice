import bcrypt from "bcryptjs";
import { IBcryptService } from "../../application/services/IBcryptService";

export class BcryptService implements IBcryptService{
    hash = async(payload : string) : Promise<string> =>{
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(payload,salt)
        return hash
    }

    compare = async(payload : string, hasd : string) : Promise<boolean> => {
        return await bcrypt.compare(payload,hasd)
    }
} 