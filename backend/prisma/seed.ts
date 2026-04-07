import { PrismaClient, Role, PostStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create Author
  const author = await prisma.user.upsert({
    where: { email: 'admin@tcb.com' },
    update: {},
    create: {
      email: 'admin@tcb.com',
      name: 'System Admin',
      role: Role.ADMIN,
    },
  });

  // Create Categories
  const categoriesData = [
    { name: 'Tech', slug: 'tech' },
    { name: 'Business', slug: 'business' },
    { name: 'Culture', slug: 'culture' },
  ];

  const categories = [];
  for (const cat of categoriesData) {
    const createdCat = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categories.push(createdCat);
  }

  // Create Posts
  await prisma.post.upsert({
    where: { slug: 'post-tech-startup' },
    update: {},
    create: {
      title: 'Building a Tech Startup in 2026',
      slug: 'post-tech-startup',
      excerpt: 'Exploring the latest trends in tech startups and how to succeed.',
      status: PostStatus.PUBLISHED,
      publishedAt: new Date(),
      authorId: author.id,
      content: [
        { type: 'paragraph', data: { text: 'Starting a tech company requires more than just code.' } },
        { type: 'heading', data: { level: 2, text: 'Finding Product Market Fit' } },
        { type: 'paragraph', data: { text: 'To find PMF, you must talk to users consistently.' } }
      ],
      categories: {
        create: [{ categoryId: categories[0].id }]
      }
    }
  });

  await prisma.post.upsert({
    where: { slug: 'post-business-culture' },
    update: {},
    create: {
      title: 'Creating a Winning Business Culture',
      slug: 'post-business-culture',
      excerpt: 'Why culture matters more than strategy in the long run.',
      status: PostStatus.PUBLISHED,
      publishedAt: new Date(),
      authorId: author.id,
      content: [
        { type: 'paragraph', data: { text: 'Culture eats strategy for breakfast according to Peter Drucker.' } },
        { type: 'heading', data: { level: 2, text: 'The Role of Leadership' } },
        { type: 'paragraph', data: { text: 'Leaders must set the example.' } }
      ],
      categories: {
        create: [{ categoryId: categories[1].id }, { categoryId: categories[2].id }]
      }
    }
  });

  console.log('Seeding complete.');
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
