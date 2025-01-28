import {authOptions} from "@/app/utils/authOptions";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PUT(req: Request){
    try{
        const session = await getServerSession(authOptions)
        const email = session?.user?.email!;

        const body = await req.json();
        const {year} = body;

        if(!year){
            return NextResponse.json(
                { error: "Please fill the year fields" },
                { status: 400 }
            );
        }

        const updatedStudent = await prisma.student.update({
            where: { email },
            data: {
                yearOfStudy: year,
            },
        });

        return NextResponse.json(updatedStudent, { status: 200 });
    }catch(error){
        console.error("Error posting year: ", error);
        return new Response(
            JSON.stringify(JSON.stringify({message: "Internal Server Error"})),
            {status: 500},
        );
    }
}