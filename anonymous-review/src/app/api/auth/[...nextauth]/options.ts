/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
 export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: 'Credentials',
            credentials: {
                email: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' },
                },
                async authorize(credentials:any): Promise<any>{
                    await dbConnect()
                    try{
                      const user= await UserModel.findOne({
                            $or:[
                                {email:credentials.identifier.email},

                            ]
                        })
                        if(!user){
                            throw new Error('No user found with this email address')
                        }
                        if(!user.isVerified){
                            throw new Error('Please verify your email address')
                        }
                        const isPasswordCorrect = await bcrypt.compare(user.password,
                            credentials.identifier.password);
                            if(!isPasswordCorrect){
                                throw new Error('Incorrect password')
                            }
                            return user
                    }catch(err: any){
                        throw new Error(err)
                    }
                }
        })
    ],
    callbacks: {
        async jwt({token, user}) {
            if (user) {
                token._id = user._id?.toString()
                token.isVerified = user.isVerified
                token.isAcceptingMessage = user.isAcceptingMessages
                token.username = user.username
            }
            return token
        },
        async session({ session, token }) {
            if (token) {
              session.user._id = token._id;
              session.user.isVerified = token.isVerified;
              session.user.isAcceptingMessages = token.isAcceptingMessages;
              session.user.username = token.username;
            }
            return session;
          },
    },
    pages: {
        signIn:'/sign-in'
    },
    session: {
        strategy: 'jwt'
    },
    secret: process.env.NEXTAUTH_SECRET
    

}