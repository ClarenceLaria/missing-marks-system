import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ message: 'Method Not Allowed' }), { status: 405 });
  }

  try {
    const { firstName, secondName, email, password, registrationNumber } = await req.json();

    // Validate that all required fields are provided
    if (!firstName || !secondName || !email || !password || !registrationNumber) {
      return NextResponse.json({ error: 'Please fill all the fields' }, { status: 400 });
    }

    // Check if a user with the given email already exists
    const existingUser = await prisma.student.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new Response(
        JSON.stringify({ message: 'A user with this credentials already exists' }),
        { status: 409 }
      );
    }

    // get all departments from the database
    const departments = await prisma.department.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    // Create a map of department names to department ids
    const departmentMap = departments.reduce((map: { [key: string]: number }, department) => {
      map[department.name] = department.id;
      return map;
    }, {});

    // Determine department based on regNo
    let departmentName;
    const prefix = registrationNumber.substring(0, 3).toUpperCase();
    if (prefix === 'SIT') {
      departmentName = 'Information Technology';
    } else if(prefix === 'COM' || prefix === 'ETS'){
      departmentName = 'Computer Science';
    }

    const departmentId = departmentName ? departmentMap[departmentName] : undefined;
    if (!departmentId) {
      return NextResponse.json({ error: 'Invalid registration number' }, { status: 400 });
      // return new Response(JSON.stringify({ message: 'Invalid registration number' }), { status: 400 });
    }

    // Fetch all courses from the database with their names and ids
    const courses = await prisma.course.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    // Create a map of course names to course ids
    const courseMap = courses.reduce((map: { [key: string]: number }, course) => {
      map[course.name] = course.id;
      return map;
    }, {});

    // Determine course based on regNo prefix
    let courseName;
    if (prefix === 'SIT') {
      courseName = ' Bachelor of Science (Information Technology)';
    } else if (prefix === 'COM') {
      courseName = 'Bachelor of Science (Computer Science)';
    }

    const courseId = courseName ? courseMap[courseName] : undefined;
    if (!courseId) {
      return NextResponse.json({ error: 'Invalid registration number' }, { status: 400 });
    }



    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in the database and connect them to the department
    const newUser = await prisma.student.create({
      data: {
        firstName,
        secondName,
        email,
        password: hashedPassword,
        regNo: registrationNumber,
        department: {
          connect: { id: departmentId },
        },
        course: {
          connect: { id: courseId },
        },
      },
    });

    // Return a success response with the newly created user (excluding the password)
    return new Response(
      JSON.stringify({
        message: 'User registered successfully',
        user: {
          id: newUser.id,
          firstName: newUser.firstName,
          secondName: newUser.secondName,
          email: newUser.email,
          registrationNumber: newUser.regNo,
        },
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in user registration:', error);
    return new Response(JSON.stringify(
      JSON.stringify({ message: 'Internal Server Error' })), { status: 500 });
  }
}
