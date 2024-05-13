import jwt from 'jsonwebtoken';
import {TOKEN_SECRET} from '../config';

export const createToken = (payload: any) => {
   return new Promise((resolve, reject) => {
        jwt.sign(
            payload,
            TOKEN_SECRET,
        {
        },
        (err, token) => {
            if (err) reject(err)
                resolve(token)
    }
        )
    })
   
}