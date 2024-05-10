import { Request, Response } from "express";
import User from '../models/user.model';
import bcrypt from 'bcryptjs';
import { createToken } from '../libs/jwt';

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
    const userFound = await User.findOne({ username })

    if (!userFound) return res.status(400).json({ message: 'El usuario no existe'})

    const isMatch = await bcrypt.compare(password, userFound.password);
    if(!isMatch) return res.status(400).json({ message: 'Credenciales invalidas'});

    const token = await createToken( { id: userFound._id, city: userFound.city });

    res.cookie('token', token);
    res.json({
        id: userFound._id,
        username: userFound.username,
        city: userFound.city
    });
    } catch (error) {
       res.status(500).json({ message: error }) 
    }
}

export const logout = async (req: Request, res: Response) => {
    res.cookie('token', "", {
        expires: new Date(0)
    })
    return res.sendStatus(200)
}