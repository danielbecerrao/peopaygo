import { PrismaService } from 'nestjs-prisma';
const prisma: PrismaService = new PrismaService();
async function main(): Promise<void> {
  await prisma.paymentType.createMany({
    data: [
      { name: 'hourly', amount: 12.0 },
      { name: 'salary', amount: 480.0 },
    ],
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
