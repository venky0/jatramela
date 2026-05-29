import { MedusaContainer } from "@medusajs/framework";
import {
  ContainerRegistrationKeys,
  ModuleRegistrationName,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils";
import {
  createApiKeysWorkflow,
  createCollectionsWorkflow,
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createStoresWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
} from "@medusajs/medusa/core-flows";

export default async function initial_data_seed({
  container,
}: {
  container: MedusaContainer;
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const fulfillmentModuleService = container.resolve(
    ModuleRegistrationName.FULFILLMENT
  );

  const countries = ["in"];

  logger.info("Seeding store data...");
  const {
    result: [defaultSalesChannel],
  } = await createSalesChannelsWorkflow(container).run({
    input: {
      salesChannelsData: [
        {
          name: "Default Sales Channel",
          description: "Created by Medusa",
        },
      ],
    },
  });

  const {
    result: [publishableApiKey],
  } = await createApiKeysWorkflow(container).run({
    input: {
      api_keys: [
        {
          title: "Default Publishable API Key",
          type: "publishable",
          created_by: "",
        },
      ],
    },
  });

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: {
      id: publishableApiKey.id,
      add: [defaultSalesChannel.id],
    },
  });

  const {
    result: [store],
  } = await createStoresWorkflow(container).run({
    input: {
      stores: [
        {
          name: "Default Store",
          supported_currencies: [
            {
              currency_code: "inr",
              is_default: true,
            },
            {
              currency_code: "usd",
              is_default: false,
            },
          ],
          default_sales_channel_id: defaultSalesChannel.id,
        },
      ],
    },
  });

  logger.info("Seeding region data...");
  const { result: regionResult } = await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          name: "India",
          currency_code: "inr",
          countries,
          payment_providers: ["pp_system_default"],
        },
      ],
    },
  });
  const region = regionResult[0];
  logger.info("Finished seeding regions.");

  logger.info("Seeding tax regions...");
  await createTaxRegionsWorkflow(container).run({
    input: countries.map((country_code) => ({
      country_code,
      provider_id: "tp_system",
    })),
  });
  logger.info("Finished seeding tax regions.");

  logger.info("Seeding stock location data...");
  const { result: stockLocationResult } = await createStockLocationsWorkflow(
    container
  ).run({
    input: {
      locations: [
        {
          name: "European Warehouse",
          address: {
            city: "Copenhagen",
            country_code: "DK",
            address_1: "",
          },
        },
      ],
    },
  });
  const stockLocation = stockLocationResult[0];

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_provider_id: "manual_manual",
    },
  });

  logger.info("Seeding fulfillment data...");
  // This is created by a migration script in core.
  const { data: shippingProfileResult } = await query.graph({
    entity: "shipping_profile",
    fields: ["id"],
  });
  const shippingProfile = shippingProfileResult[0];

  const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
    name: "European Warehouse delivery",
    type: "shipping",
    service_zones: [
      {
        name: "Europe",
        geo_zones: [
          {
            country_code: "gb",
            type: "country",
          },
          {
            country_code: "de",
            type: "country",
          },
          {
            country_code: "dk",
            type: "country",
          },
          {
            country_code: "se",
            type: "country",
          },
          {
            country_code: "fr",
            type: "country",
          },
          {
            country_code: "es",
            type: "country",
          },
          {
            country_code: "it",
            type: "country",
          },
        ],
      },
    ],
  });

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_set_id: fulfillmentSet.id,
    },
  });

  await createShippingOptionsWorkflow(container).run({
    input: [
      {
        name: "Standard Shipping",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Standard",
          description: "Ship in 2-3 days.",
          code: "standard",
        },
        prices: [
          {
            currency_code: "usd",
            amount: 10,
          },
          {
            currency_code: "eur",
            amount: 10,
          },
          {
            region_id: region.id,
            amount: 10,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      },
      {
        name: "Express Shipping",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Express",
          description: "Ship in 24 hours.",
          code: "express",
        },
        prices: [
          {
            currency_code: "usd",
            amount: 10,
          },
          {
            currency_code: "eur",
            amount: 10,
          },
          {
            region_id: region.id,
            amount: 10,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      },
    ],
  });
  logger.info("Finished seeding fulfillment data.");

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: {
      id: stockLocation.id,
      add: [defaultSalesChannel.id],
    },
  });
  logger.info("Finished seeding stock location data.");

  logger.info("Seeding collections data...");
  const { result: collectionsResult } = await createCollectionsWorkflow(
    container
  ).run({
    input: {
      collections: [
        {
          title: "Mysore Silk & Sarees",
          handle: "silk-sarees",
        },
        {
          title: "Organic Foods",
          handle: "organic-foods",
        },
        {
          title: "Wellness & Ayurveda",
          handle: "wellness-ayurveda",
        },
        {
          title: "Heritage Handicrafts",
          handle: "heritage-handicrafts",
        },
        {
          title: "Natural Home",
          handle: "natural-home",
        },
        {
          title: "Digital Products",
          handle: "digital-products",
        },
      ],
    },
  });
  logger.info("Finished seeding collections data.");

  logger.info("Seeding product categories data...");
  const { result: categoryResult } = await createProductCategoriesWorkflow(
    container
  ).run({
    input: {
      product_categories: [
        {
          name: "Clothing",
          handle: "clothing",
          is_active: true,
        },
        {
          name: "Organic Food",
          handle: "organic",
          is_active: true,
        },
        {
          name: "Wellness",
          handle: "wellness",
          is_active: true,
        },
        {
          name: "Handicrafts",
          handle: "handicrafts",
          is_active: true,
        },
      ],
    },
  });
  logger.info("Finished seeding product categories data.");

  logger.info("Seeding Jatramela products data...");
  await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: "Pure Mysore Silk Zari Saree",
          handle: "pure-mysore-silk-zari-saree",
          description: "An exquisite traditional pure Mysore silk saree adorned with rich golden zari borders. Hand-woven with love in Karnataka.",
          thumbnail: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800",
          images: [
            { url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800" }
          ],
          collection_id: collectionsResult.find((c) => c.handle === "silk-sarees")!.id,
          category_ids: [
            categoryResult.find((cat) => cat.handle === "clothing")!.id,
          ],
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
                {
                  amount: 8499,
                  currency_code: "inr",
                },
                {
                  amount: 110,
                  currency_code: "usd",
                },
              ],
            },
            {
              title: "Peacock Blue Saree",
              sku: "MYS-SILK-BLUE",
              options: {
                Color: "Peacock Blue",
              },
              prices: [
                {
                  amount: 8499,
                  currency_code: "inr",
                },
                {
                  amount: 110,
                  currency_code: "usd",
                },
              ],
            },
          ],
          sales_channels: [
            {
              id: defaultSalesChannel.id,
            },
          ],
        },
        {
          title: "Organic Byadgi Chilli Powder",
          handle: "organic-byadgi-chilli-powder",
          description: "Authentic, vibrant red Byadgi Chilli Powder known for its gorgeous color and mild heat. Sourced from organic farms in Dharwad.",
          thumbnail: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=800",
          images: [
            { url: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=800" }
          ],
          collection_id: collectionsResult.find((c) => c.handle === "organic-foods")!.id,
          category_ids: [
            categoryResult.find((cat) => cat.handle === "organic")!.id,
          ],
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          options: [],
          variants: [
            {
              title: "500g Pack",
              sku: "BYA-CHL-500G",
              options: {},
              prices: [
                {
                  amount: 249,
                  currency_code: "inr",
                },
                {
                  amount: 3.5,
                  currency_code: "usd",
                },
              ],
            },
          ],
          sales_channels: [
            {
              id: defaultSalesChannel.id,
            },
          ],
        },
        {
          title: "Heritage Pure Sandalwood Soap",
          handle: "heritage-pure-sandalwood-soap",
          description: "Infused with pure natural sandalwood oil from Mysore, this rich soap hydrates, heals, and keeps your skin smelling divine.",
          thumbnail: "https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&q=80&w=800",
          images: [
            { url: "https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&q=80&w=800" }
          ],
          collection_id: collectionsResult.find((c) => c.handle === "wellness-ayurveda")!.id,
          category_ids: [
            categoryResult.find((cat) => cat.handle === "wellness")!.id,
          ],
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          options: [],
          variants: [
            {
              title: "Standard Bar 150g",
              sku: "SAN-SOAP-150G",
              options: {},
              prices: [
                {
                  amount: 149,
                  currency_code: "inr",
                },
                {
                  amount: 2,
                  currency_code: "usd",
                },
              ],
            },
          ],
          sales_channels: [
            {
              id: defaultSalesChannel.id,
            },
          ],
        },
        {
          title: "Channapatna Wooden Toy Train",
          handle: "channapatna-wooden-toy-train",
          description: "Handcrafted toy train made from ivory wood and colored using non-toxic natural vegetable dyes by traditional artisans of Channapatna.",
          thumbnail: "https://images.unsplash.com/photo-1537758061216-049a37e504c5?auto=format&fit=crop&q=80&w=800",
          images: [
            { url: "https://images.unsplash.com/photo-1537758061216-049a37e504c5?auto=format&fit=crop&q=80&w=800" }
          ],
          collection_id: collectionsResult.find((c) => c.handle === "heritage-handicrafts")!.id,
          category_ids: [
            categoryResult.find((cat) => cat.handle === "handicrafts")!.id,
          ],
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          options: [],
          variants: [
            {
              title: "Classic Toy Train",
              sku: "CHA-TRA-CLASSIC",
              options: {},
              prices: [
                {
                  amount: 699,
                  currency_code: "inr",
                },
                {
                  amount: 9,
                  currency_code: "usd",
                },
              ],
            },
          ],
          sales_channels: [
            {
              id: defaultSalesChannel.id,
            },
          ],
        },
        {
          title: "Traditional Pure Copper Water Jug",
          handle: "traditional-pure-copper-water-jug",
          description: "Hand-hammered pure copper water jug for storing water overnight, providing traditional Ayurvedic health benefits.",
          thumbnail: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=800",
          images: [
            { url: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=800" }
          ],
          collection_id: collectionsResult.find((c) => c.handle === "natural-home")!.id,
          category_ids: [
            categoryResult.find((cat) => cat.handle === "handicrafts")!.id,
          ],
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          options: [],
          variants: [
            {
              title: "Copper Jug 1.5L",
              sku: "COP-JUG-1.5L",
              options: {},
              prices: [
                {
                  amount: 1299,
                  currency_code: "inr",
                },
                {
                  amount: 17,
                  currency_code: "usd",
                },
              ],
            },
          ],
          sales_channels: [
            {
              id: defaultSalesChannel.id,
            },
          ],
        },
        {
          title: "Carnatic Devotional Flute Album",
          handle: "carnatic-devotional-flute-album",
          description: "A peaceful collection of instrumental flute tracks playing traditional Carnatic ragas. Perfect for meditation and focus.",
          thumbnail: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80&w=800",
          images: [
            { url: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80&w=800" }
          ],
          collection_id: collectionsResult.find((c) => c.handle === "digital-products")!.id,
          category_ids: [
            categoryResult.find((cat) => cat.handle === "wellness")!.id,
          ],
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          options: [],
          variants: [
            {
              title: "Digital Audio Pack (MP3/FLAC)",
              sku: "CAR-FLUT-ALB",
              options: {},
              prices: [
                {
                  amount: 199,
                  currency_code: "inr",
                },
                {
                  amount: 2.5,
                  currency_code: "usd",
                },
              ],
            },
          ],
          sales_channels: [
            {
              id: defaultSalesChannel.id,
            },
          ],
        },
      ],
    },
  });
  logger.info("Finished seeding Jatramela products data.");

  logger.info("Seeding inventory levels...");
  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id"],
  });

  await createInventoryLevelsWorkflow(container).run({
    input: {
      inventory_levels: inventoryItems.map((item) => ({
        location_id: stockLocation.id,
        stocked_quantity: 1000000,
        inventory_item_id: item.id,
      })),
    },
  });
  logger.info("Finished seeding inventory levels data.");
}
