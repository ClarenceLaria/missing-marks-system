import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
export async function POST(req: Request ) {
    if(req.method !== "POST"){
        return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
    }
    try {
        const body = await req.json();
        const { unitId, lecturerId, academicYear } = body;
        if(!unitId || !lecturerId || !academicYear){
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }
        const course = await prisma.unit.update({
            where: {
                id: unitId,
                academicYear,
            },
            data: {
                lecturerId,
            },
        });
        return new Response(
            JSON.stringify({ message: 'Lecturer assigned to course successfully', course }),
        );
  } catch (error) {
    console.error("Error assigning lecturer to course: ", error);
    return new Response(
        JSON.stringify({ error: "Internal server error" }),
        { status: 500 }
    );
  }
}