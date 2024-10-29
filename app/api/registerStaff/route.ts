import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ message: 'Method Not Allowed' }), { status: 405 });
  }
  
  try {
  const { firstName, secondName, email, password, phoneNumber  } = await req.json();

  if (!firstName || !secondName || !email || !password || !phoneNumber) {
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
            connect:{ id: 1 },
        },
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
