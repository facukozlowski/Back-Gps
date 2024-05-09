import mongoose from 'mongoose';
import {green} from 'cli-color'

export const mongoConnect = async (url: string) => { 
    try {
        await mongoose.connect('mongodb://AdministradorSUSA:Lt60k5EpA0%25m@201.139.80.32:20185/susaDB?authSource=admin') 
    console.log('base de datos', green('conectada'));
    } catch (error) {
        console.log(error);
    }
}
