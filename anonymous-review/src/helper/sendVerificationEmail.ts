/* eslint-disable @typescript-eslint/no-unused-vars */
import {resend } from '@/lib/resend';
import VerificationEmail from '../../emails/VerificationEmail';
import { ApiResponse } from '@/types/ApiResponse';

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string,

):Promise<ApiResponse>{
    try{
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to:email,
            subject: 'Mystery  Message | verifyCode',
            react: VerificationEmail({username,otp:verifyCode}),
          });
        return {success: true, message: "Verification email sent successfully "}
    }catch(error){
        console.error("Error sending Verification email ",error);
        return { success: false, message: "Verification email sent unsuccessful"}
    }
}