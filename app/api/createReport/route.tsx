// app/api/createReport/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Semester, ExamType } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/utils/authOptions';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      unitName,
      unitCode,
      lecturerName,
      academicYear,
      examType,
      yearOfStudy,
      semester,
    } = body;

    const validSemester = ['SEMESTER1', 'SEMESTER2', 'SEMESTER3'].includes(semester) ? semester : null;
    const validExamType = ['MAIN', 'SPECIAL', 'SUPPLEMENTARY'].includes(examType) ? examType : null;

    if (!validSemester || !validExamType) {
      return NextResponse.json({ error: 'Invalid semester or exam type value.' }, { status: 400 });
    }

    // Get the user's ID from the session
    const session = await getServerSession({ req, ...authOptions });
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const email = session.user.email;
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const student = await prisma.student.findUnique({
      where: { email: email },
      select: { id: true },
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    const studentId = student.id;

    // Basic validation
    if (!unitName || !unitCode || !lecturerName || !academicYear || !examType || !yearOfStudy || !semester) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Create the missing marks report
    const report = await prisma.missingMarksReport.create({
      data: {
        unitName,
        unitCode,
        lecturerName,
        academicYear,
        examType: validExamType as ExamType, // Ensure the exam type matches the enum type
        yearOfStudy: parseInt(yearOfStudy),
        semester: validSemester as Semester, // Ensure the semester matches the enum type
        studentId,
      },
    });

    return NextResponse.json({ message: 'Report created successfully', report }, { status: 201 });
  } catch (error) {
    console.error('Error creating report:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
