import { MedusaContainer } from "@medusajs/framework";
import {
  ContainerRegistrationKeys,
  ProductStatus,
} from "@medusajs/framework/utils";
import {
  createCollectionsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createInventoryLevelsWorkflow,
} from "@medusajs/medusa/core-flows";

export default async function seedJatramelaProducts({
  container,
}: {
  container: MedusaContainer;
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);

  logger.info("🎬 Starting smart Jatramela product seeding...");

  // 1. Fetch default resources
  const { data: salesChannels } = await query.graph({
    entity: "sales_channel",
    fields: ["id", "name"],
    filters: { name: "Default Sales Channel" },
  });
  const defaultSalesChannel = salesChannels[0];
  if (!defaultSalesChannel) {
    throw new Error("Default Sales Channel not found. Please run the initial seed first.");
  }
  logger.info(`Found Sales Channel: ${defaultSalesChannel.name} (${defaultSalesChannel.id})`);

  const { data: shippingProfiles } = await query.graph({
    entity: "shipping_profile",
    fields: ["id"],
  });
  const shippingProfile = shippingProfiles[0];
  if (!shippingProfile) {
    throw new Error("Default Shipping Profile not found.");
  }

  const { data: stockLocations } = await query.graph({
    entity: "stock_location",
    fields: ["id", "name"],
  });
  const stockLocation = stockLocations[0];
  if (!stockLocation) {
    throw new Error("Default Stock Location not found.");
  }
  logger.info(`Found Stock Location: ${stockLocation.name} (${stockLocation.id})`);

  // 2. Collections setup
  const targetCollections = [
    { title: "Mysore Silk & Sarees", handle: "silk-sarees" },
    { title: "Organic Foods", handle: "organic-foods" },
    { title: "Wellness & Ayurveda", handle: "wellness-ayurveda" },
    { title: "Heritage Handicrafts", handle: "heritage-handicrafts" },
    { title: "Natural Home", handle: "natural-home" },
    { title: "Digital Products", handle: "digital-products" },
  ];

  const collectionsResultMap: Record<string, string> = {};

  for (const tc of targetCollections) {
    const { data: existingCol } = await query.graph({
      entity: "product_collection",
      fields: ["id", "handle"],
      filters: { handle: tc.handle },
    });

    if (existingCol && existingCol.length > 0) {
      logger.info(`Collection ${tc.title} already exists. Skipping creation.`);
      collectionsResultMap[tc.handle] = existingCol[0].id;
    } else {
      logger.info(`Creating collection: ${tc.title}...`);
      const { result } = await createCollectionsWorkflow(container).run({
        input: {
          collections: [tc],
        },
      });
      collectionsResultMap[tc.handle] = result[0].id;
    }
  }

  // 3. Categories setup
  const targetCategories = [
    { name: "Clothing", handle: "clothing", is_active: true },
    { name: "Organic Food", handle: "organic", is_active: true },
    { name: "Wellness", handle: "wellness", is_active: true },
    { name: "Handicrafts", handle: "handicrafts", is_active: true },
  ];

  const categoriesResultMap: Record<string, string> = {};

  for (const tc of targetCategories) {
    const { data: existingCat } = await query.graph({
      entity: "product_category",
      fields: ["id", "handle"],
      filters: { handle: tc.handle },
    });

    if (existingCat && existingCat.length > 0) {
      logger.info(`Category ${tc.name} already exists. Skipping creation.`);
      categoriesResultMap[tc.handle] = existingCat[0].id;
    } else {
      logger.info(`Creating category: ${tc.name}...`);
      const { result } = await createProductCategoriesWorkflow(container).run({
        input: {
          product_categories: [tc],
        },
      });
      categoriesResultMap[tc.handle] = result[0].id;
    }
  }

  // 4. Seeding Products
  const targetProducts = [
    {
      title: "Pure Mysore Silk Zari Saree",
      handle: "pure-mysore-silk-zari-saree",
      description: "An exquisite traditional pure Mysore silk saree adorned with rich golden zari borders. Hand-woven with love in Karnataka.",
      thumbnail: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800",
      images: [
        { url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800" }
      ],
      collection_id: collectionsResultMap["silk-sarees"],
      category_ids: [categoriesResultMap["clothing"]],
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      options: [
        {
          title: "Color",
          values: ["Royal Red", "Peacock Blue"],
        },
      ],
      variants: [
        {
          title: "Royal Red Saree",
          sku: "MYS-SILK-RED",
          options: {
            Color: "Royal Red",
          },
          prices: [
            { amount: 8499, currency_code: "inr" },
            { amount: 110, currency_code: "usd" },
          ],
        },
        {
          title: "Peacock Blue Saree",
          sku: "MYS-SILK-BLUE",
          options: {
            Color: "Peacock Blue",
          },
          prices: [
            { amount: 8499, currency_code: "inr" },
            { amount: 110, currency_code: "usd" },
          ],
        },
      ],
      sales_channels: [{ id: defaultSalesChannel.id }],
    },
    {
      title: "Organic Byadgi Chilli Powder",
      handle: "organic-byadgi-chilli-powder",
      description: "Authentic, vibrant red Byadgi Chilli Powder known for its gorgeous color and mild heat. Sourced from organic farms in Dharwad.",
      thumbnail: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=800",
      images: [
        { url: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=800" }
      ],
      collection_id: collectionsResultMap["organic-foods"],
      category_ids: [categoriesResultMap["organic"]],
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      options: [
        {
          title: "Pack Size",
          values: ["500g Pack"],
        },
      ],
      variants: [
        {
          title: "500g Pack",
          sku: "BYA-CHL-500G",
          options: {
            "Pack Size": "500g Pack",
          },
          prices: [
            { amount: 249, currency_code: "inr" },
            { amount: 3.5, currency_code: "usd" },
          ],
        },
      ],
      sales_channels: [{ id: defaultSalesChannel.id }],
    },
    {
      title: "Heritage Pure Sandalwood Soap",
      handle: "heritage-pure-sandalwood-soap",
      description: "Infused with pure natural sandalwood oil from Mysore, this rich soap hydrates, heals, and keeps your skin smelling divine.",
      thumbnail: "https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&q=80&w=800",
      images: [
        { url: "https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&q=80&w=800" }
      ],
      collection_id: collectionsResultMap["wellness-ayurveda"],
      category_ids: [categoriesResultMap["wellness"]],
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      options: [
        {
          title: "Size",
          values: ["Standard Bar 150g"],
        },
      ],
      variants: [
        {
          title: "Standard Bar 150g",
          sku: "SAN-SOAP-150G",
          options: {
            Size: "Standard Bar 150g",
          },
          prices: [
            { amount: 149, currency_code: "inr" },
            { amount: 2, currency_code: "usd" },
          ],
        },
      ],
      sales_channels: [{ id: defaultSalesChannel.id }],
    },
    {
      title: "Channapatna Wooden Toy Train",
      handle: "channapatna-wooden-toy-train",
      description: "Handcrafted toy train made from ivory wood and colored using non-toxic natural vegetable dyes by traditional artisans of Channapatna.",
      thumbnail: "https://images.unsplash.com/photo-1537758061216-049a37e504c5?auto=format&fit=crop&q=80&w=800",
      images: [
        { url: "https://images.unsplash.com/photo-1537758061216-049a37e504c5?auto=format&fit=crop&q=80&w=800" }
      ],
      collection_id: collectionsResultMap["heritage-handicrafts"],
      category_ids: [categoriesResultMap["handicrafts"]],
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      options: [
        {
          title: "Style",
          values: ["Classic Toy Train"],
        },
      ],
      variants: [
        {
          title: "Classic Toy Train",
          sku: "CHA-TRA-CLASSIC",
          options: {
            Style: "Classic Toy Train",
          },
          prices: [
            { amount: 699, currency_code: "inr" },
            { amount: 9, currency_code: "usd" },
          ],
        },
      ],
      sales_channels: [{ id: defaultSalesChannel.id }],
    },
    {
      title: "Traditional Pure Copper Water Jug",
      handle: "traditional-pure-copper-water-jug",
      description: "Hand-hammered pure copper water jug for storing water overnight, providing traditional Ayurvedic health benefits.",
      thumbnail: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=800",
      images: [
        { url: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=800" }
      ],
      collection_id: collectionsResultMap["natural-home"],
      category_ids: [categoriesResultMap["handicrafts"]],
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      options: [
        {
          title: "Volume",
          values: ["Copper Jug 1.5L"],
        },
      ],
      variants: [
        {
          title: "Copper Jug 1.5L",
          sku: "COP-JUG-1.5L",
          options: {
            Volume: "Copper Jug 1.5L",
          },
          prices: [
            { amount: 1299, currency_code: "inr" },
            { amount: 17, currency_code: "usd" },
          ],
        },
      ],
      sales_channels: [{ id: defaultSalesChannel.id }],
    },
    {
      title: "Carnatic Devotional Flute Album",
      handle: "carnatic-devotional-flute-album",
      description: "A peaceful collection of instrumental flute tracks playing traditional Carnatic ragas. Perfect for meditation and focus.",
      thumbnail: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80&w=800",
      images: [
        { url: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80&w=800" }
      ],
      collection_id: collectionsResultMap["digital-products"],
      category_ids: [categoriesResultMap["wellness"]],
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      options: [
        {
          title: "Format",
          values: ["Digital Audio Pack (MP3/FLAC)"],
        },
      ],
      variants: [
        {
          title: "Digital Audio Pack (MP3/FLAC)",
          sku: "CAR-FLUT-ALB",
          options: {
            Format: "Digital Audio Pack (MP3/FLAC)",
          },
          prices: [
            { amount: 199, currency_code: "inr" },
            { amount: 2.5, currency_code: "usd" },
          ],
        },
      ],
      sales_channels: [{ id: defaultSalesChannel.id }],
    },
  ];

  for (const tp of targetProducts) {
    const { data: existingProd } = await query.graph({
      entity: "product",
      fields: ["id", "handle"],
      filters: { handle: tp.handle },
    });

    if (existingProd && existingProd.length > 0) {
      logger.info(`Product "${tp.title}" already exists. Skipping.`);
    } else {
      logger.info(`Creating product: "${tp.title}"...`);
      await createProductsWorkflow(container).run({
        input: {
          products: [tp],
        },
      });
    }
  }

  // 5. Seeding inventory levels for newly created variants
  logger.info("Checking and seeding inventory levels...");
  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id"],
  });

  const { data: existingLevels } = await query.graph({
    entity: "inventory_level",
    fields: ["inventory_item_id"],
  });

  const existingLevelIds = new Set(existingLevels.map((l) => l.inventory_item_id));
  const newItemsToStock = inventoryItems.filter((item) => !existingLevelIds.has(item.id));

  if (newItemsToStock.length > 0) {
    logger.info(`Stocking ${newItemsToStock.length} new inventory items...`);
    await createInventoryLevelsWorkflow(container).run({
      input: {
        inventory_levels: newItemsToStock.map((item) => ({
          location_id: stockLocation.id,
          stocked_quantity: 1000000,
          inventory_item_id: item.id,
        })),
      },
    });
  }

  logger.info("🎉 Smart Jatramela seeding completed successfully!");
}
