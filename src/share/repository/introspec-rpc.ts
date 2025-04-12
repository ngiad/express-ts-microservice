import axios from "axios";
import { IIntrospect, UserGlobalResponseSchema, UserResponseGlobalType } from "../interface";


export class Introspect implements IIntrospect {
    constructor(
        private readonly baseUrl : string
    ){}

    verify = async(token : string):Promise<UserResponseGlobalType> => {
        const { value } = (await axios.post(`${this.baseUrl}/v1/api/rpc/verify`,{},{
            headers : {
                token
            }
        }))
            .data;

        return UserGlobalResponseSchema.parse(value)
    }
}