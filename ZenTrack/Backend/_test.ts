import { PrismaClient } from '@prisma/client';
async function main() {
  const prisma = new PrismaClient();
  try {
    const boards = await prisma.board.findMany({ where: { name: 'test', userId: 'test' } });
    console.log('OK:', boards);
  } catch(e) {
    console.error('ERROR:', e);
  }
  await prisma.$disconnect();
}
main();
