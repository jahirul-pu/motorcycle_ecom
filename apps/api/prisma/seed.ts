import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Seed Settings
  const settings = [
    { key: 'store_name', value: 'MotoHub' },
    { key: 'support_email', value: 'support@motohub.com' },
    { key: 'currency', value: 'BDT' },
    { key: 'tax_rate', value: '15' },
  ];
  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }
  console.log('Seeded settings.');

  // 2. Seed Motorcycle Brands & Models
  const motorcycleBrands = [
    {
      name: 'Yamaha',
      models: ['R15 V3', 'R15 V4', 'FZS V3', 'MT-15'],
    },
    {
      name: 'Honda',
      models: ['CBR150R', 'CB150R Hornet', 'CB Trigger'],
    },
    {
      name: 'Suzuki',
      models: ['GSX-R150', 'Gixxer SF', 'Gixxer 150'],
    },
  ];

  for (const mBrand of motorcycleBrands) {
    const brand = await prisma.motorcycleBrand.upsert({
      where: { name: mBrand.name },
      update: {},
      create: { name: mBrand.name },
    });

    for (const mModel of mBrand.models) {
      await prisma.motorcycleModel.upsert({
        where: {
          brandId_name: {
            brandId: brand.id,
            name: mModel,
          },
        },
        update: {},
        create: {
          brandId: brand.id,
          name: mModel,
        },
      });
    }
  }
  console.log('Seeded motorcycle compatibility brands & models.');

  // 3. Seed Attributes
  const attributes = [
    {
      name: 'Color',
      options: ['Black', 'Red', 'Blue', 'Green', 'Yellow', 'Silver', 'Carbon'],
    },
    {
      name: 'Helmet Size',
      options: ['S', 'M', 'L', 'XL', 'XXL'],
    },
    {
      name: 'Viscosity',
      options: ['10W-30', '10W-40', '20W-40', '20W-50'],
    },
  ];

  for (const attr of attributes) {
    const attribute = await prisma.attribute.upsert({
      where: { name: attr.name },
      update: {},
      create: { name: attr.name },
    });

    for (const optVal of attr.options) {
      await prisma.attributeOption.upsert({
        where: {
          attributeId_value: {
            attributeId: attribute.id,
            value: optVal,
          },
        },
        update: {},
        create: {
          attributeId: attribute.id,
          value: optVal,
        },
      });
    }
  }
  console.log('Seeded attributes.');

  // 4. Seed Specifications
  const specifications = ['Weight', 'Country of Origin', 'Dimensions', 'Certification', 'Warranty'];
  for (const spec of specifications) {
    await prisma.specification.upsert({
      where: { name: spec },
      update: {},
      create: { name: spec },
    });
  }
  console.log('Seeded specifications.');

  // 5. Seed Brands
  const brands = [
    { name: 'Motul', slug: 'motul', description: 'Premium lubricants and engine oils' },
    { name: 'Yamalube', slug: 'yamalube', description: 'Yamaha genuine lubricants' },
    { name: 'Alpinestars', slug: 'alpinestars', description: 'Premium riding gear and apparel' },
    { name: 'KYT', slug: 'kyt', description: 'Racing and street helmets' },
  ];
  for (const brand of brands) {
    await prisma.brand.upsert({
      where: { slug: brand.slug },
      update: {},
      create: brand,
    });
  }
  console.log('Seeded product brands.');

  // 6. Seed Categories
  const categories = [
    { name: 'Engine Oil', slug: 'engine-oil', description: 'High performance lubricants' },
    { name: 'Helmets', slug: 'helmets', description: 'Full face and modular helmets' },
    { name: 'Riding Gear', slug: 'riding-gear', description: 'Jackets, gloves, boots, guards' },
    { name: 'Spares', slug: 'spares', description: 'Brake pads, chains, filters, plugs' },
  ];
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log('Seeded product categories.');

  console.log('Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
