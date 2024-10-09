import { PrismaClient } from "@prisma/client"; // Adjust the import according to your project structure

const prisma = new PrismaClient();
async function createSchool() {
  try {
    const newSchool = await prisma.school.create({
      data: {
        name: 'School of Computing and Informatics',
        abbreviation: 'SCI',
      },
    });

    console.log('School created:', newSchool);
    return newSchool;
  } catch (error) {
    console.error('Error creating school:', error);
  }
}

createSchool();