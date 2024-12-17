import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
export async function POST(req: Request){
    if(req.method !== 'POST'){
        return NextResponse.json({error: 'Method not allowed'}, {status: 405});
    }
    try{
        const body = await req.json();
        const {name, abbreviation,email} = body;
        if(!name || !abbreviation){
            return NextResponse.json({error: 'All fields are required'}, {status: 400});
        }

        const userExists = await prisma.staff.findFirst({
            where: {
                email,
            }
        });
        if(!userExists){
            return NextResponse.json({error: 'User does not exist'}, {status: 404});
        }

        const upperAbbreviation = abbreviation.toUpperCase();
        const school = await prisma.school.create({
            data: {
                name,
                abbreviation: upperAbbreviation,
            }
        });
        if(school){
            const deanExists = await prisma.staff.findFirst({
                where: {
                    schoolId: school.id,
                    userType: 'DEAN'
                }
            })
            if(deanExists){
                return new Response(
                    JSON.stringify({ message: 'A dean already exists' }),
                    { status: 409 }
                  );
            }
            const dean = await prisma.staff.update({
                where: {
                    email: email,
                },
                data: {
                    schoolId: school.id,
                    userType: 'DEAN',
                }
            });
        }
        return NextResponse.json({message: 'School created successfully', school},{status: 201});
    }catch(error){
        console.error('Error creating school: ',error);
        return NextResponse.json({error: 'An error occurred while creating school'}, {status: 500});
    }
}