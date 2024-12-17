import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from "@/helper/sendVerificationEmail";

export async function POST(request: Request){
    await dbConnect()
    try {
        const {username, email, password} = await request.json();
        const existingUserVerifyByUsername= await UserModel.findOne({
            username,
            isVerified:true,
            })
            if(existingUserVerifyByUsername){
                return Response.json({
                    success:false,
                    message:"Username already exists",
                    },{status:400})
            }
            const existingUserVerifyByEmail= await UserModel.findOne({email});
            const verifyCode = Math.floor(100000+Math.random()*900000).toString();
            if(existingUserVerifyByEmail){
                if(existingUserVerifyByEmail.isVerified){
                    return Response.json({
                        success:false,
                        message:"Email already exists",
                        },{status:400})
                }else{
                    const hashedPassword = await bcrypt.hash(password,10)
                    existingUserVerifyByEmail.password = hashedPassword;
                    existingUserVerifyByEmail.verifyCode = verifyCode;
                    existingUserVerifyByEmail.verifyCodeExpiry = new Date(Date.now()+3600000)
                    await existingUserVerifyByEmail.save();
                }
            }else{
                    const hashedPassword = await bcrypt.hash(password, 10);
                    const expiryDate = new Date();
                    expiryDate.setHours(expiryDate.getHours()+1);
                    const newUser=new UserModel({
                        username,
                        email,
                        password:hashedPassword,
                        verifyCode,
                        verifyCodeExpiry:expiryDate,
                        isVerified:false,
                        isAcceptingMessage:true,
                        message:[]

                    })
                    await newUser.save()
                }
               const emailResponse=await sendVerificationEmail(
                    email,
                    username,
                    verifyCode,
                )
                if(!emailResponse.success) {
                    return Response.json({
                        success: false,
                        message: emailResponse.message,
                    },{status:500});
                }
                return Response.json({
                    success: true, 
                    message: "Verification email sent successfully",
                    },{status:201})
    }catch (err) {
        console.error("Error registering user",err);
        return Response.json({
            success: false,
            message: "Error registering user",
        },
        {
            status: 500,
        })
    }

}