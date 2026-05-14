import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    }
  },
  // NOTE: Razorpay payment module is configured here once plugin is compatible.
  // The frontend Razorpay checkout works independently of this.
  // modules: [
  //   {
  //     resolve: "@medusajs/medusa/payment",
  //     options: {
  //       providers: [
  //         {
  //           resolve: "@devx-commerce/razorpay",
  //           id: "razorpay",
  //           options: {
  //             key_id: process.env.RAZORPAY_ID,
  //             key_secret: process.env.RAZORPAY_SECRET,
  //             capture: true,
  //             webhook_secret: process.env.RAZORPAY_WEBHOOK_SECRET,
  //           },
  //         },
  //       ],
  //     },
  //   },
  // ],
})
