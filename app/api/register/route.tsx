import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export default async function register(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { firstName, secondName, email, password, registrationNumber, userType } = JSON.parse(req.body);

    // Validate input
    if (!firstName || !secondName || !email || !password || !registrationNumber || !userType) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(402).json({ message: 'User with credentials already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in the database
    const user = await prisma.user.create({
      data: {
        firstName,
        secondName,
        email,
        password: hashedPassword,
        registrationNumber,
        userType,
      },
    });

    // Return success response
    return res.status(200).json({ message: 'User registered successfully', user });

  } catch (error) {
    console.error('Error in /api/register:', error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
}
