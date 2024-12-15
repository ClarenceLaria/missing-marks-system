import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(req: Request) {
  if (req.method !== 'DELETE') {
    return new Response(JSON.stringify({ message: 'Method Not Allowed' }), { status: 405 });
  }

  try{
    const { id, confirmation} = await req.json();

    if(confirmation !== 'DELETE SCHOOL'){
        return new Response(JSON.stringify({ error: 'Please confirm deletion by typing DELETE SCHOOL' }), { status: 400 });
    }
    if (!id || !confirmation) {
      return new Response(JSON.stringify({ error: 'Fill in the all the fields' }), { status: 400 });
    }

    const school = await prisma.school.findUnique({
      where: { id },
    });

    if (!school) {
      return new Response(JSON.stringify({ error: 'School not found' }), { status: 404 });
    }

    await prisma.school.delete({
      where: { id },
    });

    return new Response(JSON.stringify({ message: 'School deleted successfully' }), { status: 200 });
  }catch(error){
    console.error('Error deleting school: ',error);
    return new Response(JSON.stringify({ error: 'An error occurred while deleting school' }), { status: 500 });
  }
  
}