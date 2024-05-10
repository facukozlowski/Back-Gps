import mongoose from 'mongoose';
import {green} from 'cli-color'

export const mongoConnect = async (url: string) => { 
    try {
        await mongoose.connect(url) 
    console.log('base de datos', green('conectada'));
    } catch (error) {
        console.log(error);
    }
}
