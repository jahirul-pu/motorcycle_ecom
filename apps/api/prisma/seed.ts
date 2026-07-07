// apps/api/prisma/seed.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing database tables...');

  // Clean tables in reverse order of dependencies
  await prisma.productCompatibility.deleteMany();
  await prisma.productSpecification.deleteMany();
  await prisma.productAttribute.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.price.deleteMany();
  await prisma.inventoryTransaction.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.product.deleteMany();
  await prisma.media.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();

  await prisma.motorcycleVariant.deleteMany();
  await prisma.motorcycleGeneration.deleteMany();
  await prisma.motorcycleModel.deleteMany();
  await prisma.motorcycleBrand.deleteMany();

  await prisma.attributeOption.deleteMany();
  await prisma.attribute.deleteMany();
  await prisma.specification.deleteMany();
  await prisma.setting.deleteMany();

  console.log('Seeding settings...');
  const settings = [
    { key: 'store_name', value: 'MotoHub' },
    { key: 'support_email', value: 'support@motohub.com' },
    { key: 'currency', value: 'BDT' },
    { key: 'tax_rate', value: '15' },
  ];
  for (const setting of settings) {
    await prisma.setting.create({ data: setting });
  }

  console.log('Seeding motorcycle brands & models...');
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

  const variantsMap: Record<string, string[]> = {}; // modelName -> variantIds

  for (const mBrand of motorcycleBrands) {
    const brand = await prisma.motorcycleBrand.create({
      data: { name: mBrand.name },
    });

    for (const mModel of mBrand.models) {
      const model = await prisma.motorcycleModel.create({
        data: {
          brandId: brand.id,
          name: mModel,
        },
      });

      // Seed generations
      let genName = 'Standard';
      let yearFrom = 2018;
      let yearTo = 2026;
      if (mModel === 'R15 V3') {
        genName = 'V3 (2017-2021)';
        yearFrom = 2017;
        yearTo = 2021;
      } else if (mModel === 'R15 V4') {
        genName = 'V4 (2021-2026)';
        yearFrom = 2021;
        yearTo = 2026;
      } else if (mModel === 'CBR150R') {
        genName = 'K45G (2016-2021)';
        yearFrom = 2016;
        yearTo = 2021;
      }

      const generation = await prisma.motorcycleGeneration.create({
        data: {
          modelId: model.id,
          name: genName,
          yearFrom,
          yearTo,
        },
      });

      // Seed variants
      const variantNames = mModel.includes('R15') ? ['ABS', 'Non-ABS'] : ['Standard'];
      variantsMap[mModel] = [];
      for (const vName of variantNames) {
        const variant = await prisma.motorcycleVariant.create({
          data: {
            generationId: generation.id,
            name: vName,
          },
        });
        variantsMap[mModel].push(variant.id);
      }
    }
  }

  console.log('Seeding attributes...');
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

  const attributeOptionsMap: Record<string, Record<string, string>> = {}; // attrName -> optionValue -> optionId

  for (const attr of attributes) {
    const attribute = await prisma.attribute.create({
      data: { name: attr.name },
    });

    attributeOptionsMap[attr.name] = {};
    for (const optVal of attr.options) {
      const option = await prisma.attributeOption.create({
        data: {
          attributeId: attribute.id,
          value: optVal,
        },
      });
      attributeOptionsMap[attr.name][optVal] = option.id;
    }
  }

  console.log('Seeding specifications...');
  const specifications = ['Weight', 'Country of Origin', 'Dimensions', 'Certification', 'Warranty'];
  const specsMap: Record<string, string> = {}; // specName -> specId
  for (const spec of specifications) {
    const createdSpec = await prisma.specification.create({
      data: { name: spec },
    });
    specsMap[spec] = createdSpec.id;
  }

  console.log('Seeding product brands...');
  const brandsData = [
    { name: 'Motul', slug: 'motul', description: 'Premium lubricants and engine oils' },
    { name: 'Yamalube', slug: 'yamalube', description: 'Yamaha genuine lubricants and parts' },
    { name: 'Alpinestars', slug: 'alpinestars', description: 'Premium riding gear and apparel' },
    { name: 'KYT', slug: 'kyt', description: 'Racing and street helmets' },
  ];
  const brandsMap: Record<string, string> = {}; // brandSlug -> brandId
  for (const brand of brandsData) {
    const createdBrand = await prisma.brand.create({
      data: brand,
    });
    brandsMap[brand.slug] = createdBrand.id;
  }

  console.log('Seeding product categories...');
  const categoriesData = [
    { name: 'Engine Oil', slug: 'engine-oil', description: 'High performance lubricants' },
    { name: 'Helmets', slug: 'helmets', description: 'Full face and modular helmets' },
    { name: 'Riding Gear', slug: 'riding-gear', description: 'Jackets, gloves, boots, guards' },
    { name: 'Spares', slug: 'spares', description: 'Brake pads, chains, filters, plugs' },
  ];
  const categoriesMap: Record<string, string> = {}; // catSlug -> catId
  for (const cat of categoriesData) {
    const createdCat = await prisma.category.create({
      data: cat,
    });
    categoriesMap[cat.slug] = createdCat.id;
  }

  console.log('Seeding products & related entities...');

  // Helper to create Media
  const createMedia = async (filename: string, storageKey: string) => {
    return prisma.media.create({
      data: {
        filename,
        mimeType: 'image/jpeg',
        size: 102400,
        storageKey,
      },
    });
  };

  // Mock Products configurations
  const products = [
    {
      sku: 'MTL-7100-10W40-1L',
      name: 'Motul 7100 10W-40 4T',
      slug: 'motul-7100-10w40-4t',
      shortDescription: '100% Synthetic Ester high performance motorcycle oil.',
      description:
        'Motul 7100 is a 100% synthetic 4-stroke engine oil developed to improve engine performance and wear protection. Its high oil film resistance at high temperatures protects your motorcycle engine under tough urban or racing environments.',
      status: 'active',
      weight: 1.0,
      brandSlug: 'motul',
      categorySlug: 'engine-oil',
      imageUrl:
        'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&auto=format&fit=crop&q=80',
      price: { regularPrice: 1550, salePrice: 1450 },
      inventory: { availableQuantity: 50, lowStockThreshold: 5 },
      specs: [
        { name: 'Weight', value: '1.0 kg' },
        { name: 'Country of Origin', value: 'France' },
        { name: 'Warranty', value: 'No Warranty' },
      ],
      attrs: [{ name: 'Viscosity', value: '10W-40' }],
      compatibleModels: ['R15 V3', 'R15 V4', 'MT-15', 'FZS V3', 'CBR150R', 'GSX-R150'],
    },
    {
      sku: 'YML-GP-10W40-1L',
      name: 'Yamalube GP Racing 10W-40',
      slug: 'yamalube-gp-racing-10w40',
      shortDescription: 'Yamaha genuine high performance fully synthetic lubricant.',
      description:
        'Yamalube GP Racing Spec oil is formulated with advanced additives to yield maximum acceleration and power output. Engineered specifically for Yamaha 4-stroke performance engines.',
      status: 'active',
      weight: 1.0,
      brandSlug: 'yamalube',
      categorySlug: 'engine-oil',
      imageUrl:
        'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&auto=format&fit=crop&q=80',
      price: { regularPrice: 1200, salePrice: 1100 },
      inventory: { availableQuantity: 30, lowStockThreshold: 5 },
      specs: [
        { name: 'Weight', value: '1.0 kg' },
        { name: 'Country of Origin', value: 'Japan' },
        { name: 'Warranty', value: 'No Warranty' },
      ],
      attrs: [{ name: 'Viscosity', value: '10W-40' }],
      compatibleModels: ['R15 V3', 'R15 V4', 'MT-15', 'FZS V3'],
    },
    {
      sku: 'AST-GP-PLUS-J-L',
      name: 'Alpinestars T-GP Plus R v3 Jacket',
      slug: 'alpinestars-t-gp-plus-r-v3-jacket',
      shortDescription: 'Premium textile sport riding jacket with CE certified armor.',
      description:
        'Featuring a highly durable and abrasion resistant poly-fabric main shell and subtly incorporated class-leading Nucleon Flex Plus protection, the T-GP Plus R v3 Jacket is designed to keep you safe and comfortable as you hold the throttle open.',
      status: 'active',
      weight: 2.2,
      brandSlug: 'alpinestars',
      categorySlug: 'riding-gear',
      imageUrl:
        'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80',
      price: { regularPrice: 18500, salePrice: null },
      inventory: { availableQuantity: 12, lowStockThreshold: 2 },
      specs: [
        { name: 'Weight', value: '2.2 kg' },
        { name: 'Country of Origin', value: 'Italy' },
        { name: 'Certification', value: 'CE Certified' },
        { name: 'Warranty', value: '1 Year Brand Warranty' },
      ],
      attrs: [{ name: 'Color', value: 'Black' }],
      compatibleModels: [],
    },
    {
      sku: 'KYT-TTC-CARBON-M',
      name: 'KYT TT Course Helmet',
      slug: 'kyt-tt-course-helmet',
      shortDescription: 'Full-face racing helmet with wind-tunnel tested aerodynamics.',
      description:
        'TT Course, the KYT full-face helmet. Its shapes have been thoroughly studied in the wind tunnel to achieve the best aerodynamic performances without neglecting style. The fine inner lining has been optimized to offer the best performance in terms of comfort and moisture flow.',
      status: 'active',
      weight: 1.45,
      brandSlug: 'kyt',
      categorySlug: 'helmets',
      imageUrl:
        'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?w=600&auto=format&fit=crop&q=80',
      price: { regularPrice: 8500, salePrice: 7800 },
      inventory: { availableQuantity: 4, lowStockThreshold: 1 },
      specs: [
        { name: 'Weight', value: '1.45 kg' },
        { name: 'Country of Origin', value: 'Indonesia' },
        { name: 'Certification', value: 'ECE 22.05' },
        { name: 'Warranty', value: '2 Years Manufacturer Warranty' },
      ],
      attrs: [
        { name: 'Color', value: 'Carbon' },
        { name: 'Helmet Size', value: 'M' },
      ],
      compatibleModels: [],
    },
    {
      sku: 'YML-R15-BP-FRONT',
      name: 'Yamaha R15 Genuine Brake Pads (Front)',
      slug: 'yamaha-r15-genuine-brake-pads-front',
      shortDescription: 'Genuine Yamaha replacement front brake pads for R15.',
      description:
        'Original Yamaha replacement parts guarantee optimal braking performance, longevity, and perfect compatibility. Manufactured specifically for Yamaha Nissin caliper installations.',
      status: 'active',
      weight: 0.15,
      brandSlug: 'yamalube',
      categorySlug: 'spares',
      imageUrl:
        'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop&q=80',
      price: { regularPrice: 1800, salePrice: 1650 },
      inventory: { availableQuantity: 25, lowStockThreshold: 3 },
      specs: [
        { name: 'Weight', value: '0.15 kg' },
        { name: 'Country of Origin', value: 'India' },
        { name: 'Warranty', value: 'No Warranty' },
      ],
      attrs: [],
      compatibleModels: ['R15 V3', 'R15 V4', 'MT-15'],
    },
  ];

  for (const prodData of products) {
    const brandId = brandsMap[prodData.brandSlug];
    const categoryId = categoriesMap[prodData.categorySlug];

    if (!brandId || !categoryId) {
      console.warn(`Skipping seeding product ${prodData.name} due to missing brand/category`);
      continue;
    }

    const product = await prisma.product.create({
      data: {
        brandId,
        categoryId,
        sku: prodData.sku,
        name: prodData.name,
        slug: prodData.slug,
        shortDescription: prodData.shortDescription,
        description: prodData.description,
        status: prodData.status,
        weight: prodData.weight,
        seoTitle: prodData.name,
        seoDescription: prodData.shortDescription,
      },
    });

    // Create Media and ProductImage
    const media = await createMedia(prodData.slug + '.jpg', prodData.imageUrl);
    await prisma.productImage.create({
      data: {
        productId: product.id,
        mediaId: media.id,
        position: 0,
        isPrimary: true,
      },
    });

    // Seed optional second image for catalog depth
    const altMedia = await createMedia(prodData.slug + '-alt.jpg', prodData.imageUrl + '&sig=1');
    await prisma.productImage.create({
      data: {
        productId: product.id,
        mediaId: altMedia.id,
        position: 1,
        isPrimary: false,
      },
    });

    // Price
    await prisma.price.create({
      data: {
        productId: product.id,
        regularPrice: prodData.price.regularPrice,
        salePrice: prodData.price.salePrice,
        currency: 'BDT',
      },
    });

    // Inventory
    await prisma.inventory.create({
      data: {
        productId: product.id,
        availableQuantity: prodData.inventory.availableQuantity,
        reservedQuantity: 0,
        lowStockThreshold: prodData.inventory.lowStockThreshold,
      },
    });

    // Specs
    for (const spec of prodData.specs) {
      const specId = specsMap[spec.name];
      if (specId) {
        await prisma.productSpecification.create({
          data: {
            productId: product.id,
            specificationId: specId,
            value: spec.value,
          },
        });
      }
    }

    // Attributes
    for (const attr of prodData.attrs) {
      const optionId = attributeOptionsMap[attr.name]?.[attr.value];
      if (optionId) {
        await prisma.productAttribute.create({
          data: {
            productId: product.id,
            optionId,
          },
        });
      }
    }

    // Compatibility
    for (const mModel of prodData.compatibleModels) {
      const variantIds = variantsMap[mModel] || [];
      for (const variantId of variantIds) {
        await prisma.productCompatibility.create({
          data: {
            productId: product.id,
            variantId,
            yearFrom: 2017,
            yearTo: 2026,
          },
        });
      }
    }
  }

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
