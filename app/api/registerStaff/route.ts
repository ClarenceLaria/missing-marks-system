import bcrypt from 'bcrypt';
import { PrismaClient, UserStatus } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ message: 'Method Not Allowed' }), { status: 405 });
  }
  
  try {
  const { firstName, secondName, email, password, phoneNumber, departmentId, userStatus, userType, schoolId } = await req.json();

  const validStatus = ['active', 'inactive'].includes(userStatus) ? userStatus : null;

  if (!firstName || !secondName || !email || !password || !phoneNumber ) { //|| !departmentId || !schoolId
    return NextResponse.json({ error: 'Please fill all the fields' }, { status: 400 });
  }

    const existingStaff = await prisma.staff.findUnique({
      where: { email },
    });

    if (existingStaff) {
        return new Response(
            JSON.stringify({ message: 'A user with this credentials already exists' }),
            { status: 409 }
        )
    }

    const existingDean = await prisma.staff.findUnique({
      where: { 
        userType: 'DEAN',
        email: email,
        schoolId: schoolId || 2,
      },
    });

    if(existingDean){
      return new Response(
        JSON.stringify({ message: 'A dean with this email already exists' }),
        { status: 409 }
      )
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new staff member
    const newStaff = await prisma.staff.create({
      data: {
        firstName,
        secondName,
        email,
        phoneNumber,
        password: hashedPassword,
        department:{
            connect:{ id: departmentId || 2},
        },
        school:{
          connect:{ id: schoolId || 2},
        },
        userStatus: validStatus as UserStatus,
        userType,
      },
    });


    return new Response(
        JSON.stringify({
          message: 'User registered successfully',
          user: {
            id: newStaff.id,
            firstName: newStaff.firstName,
            secondName: newStaff.secondName,
            email: newStaff.email,
            registrationNumber: newStaff.phoneNumber,
          },
        }),
        { status: 201 }
      );
  } catch (error) {
    console.error('Error in staff registration:', error);
    return new Response(JSON.stringify({ message: 'Registration failed' }), { status: 500 });
  }
}
