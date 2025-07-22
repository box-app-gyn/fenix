import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import paymentWebhookRouter from @routes/paymentWebhook;
import createChargeRouter from @routes/createCharge;
import verifyChargeRouter from @routes/verifyCharge;


const app = express()

// 🔒 SECURITY
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))

// 🚦 RATE LIMIT
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP'
})
app.use(limiter)

// 📝 PARSING
app.use(bodyParser.json({ limit: '10mb' }))
app.use(bodyParser.urlencoded({ extended: true }))

// 🏥 HEALTH
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'payment-service',
    version: process.env.npm_package_version || '1.0.0'
  })
})

// 🏠 ROOT
app.get('/', (_req, res) => {
  res.json({
    service: '🔥 CERRADO INTERBOX Payment Service',
    status: 'alive',
    endpoints: [
      'GET /health',
      'POST /create-charge',
      'GET /verify-charge/:id',
      'POST /payment-webhook'
    ]
  })
})

// 🔐 WEBHOOK
app.use('/payment-webhook', paymentWebhookRouter)

// 💰 PAYMENT
app.use('/create-charge', limiter, createChargeRouter)
app.use('/verify-charge', limiter, verifyChargeRouter)

// 🚫 404
app.use('*', (_req, res) => {
  res.status(404).json({ error: 'Endpoint not found' })
})

// 💥 ERROR
app.use((err: any, _req, res, _next) => {
  console.error('Error:', err)
  res.status(500).json({
    error: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { details: err.message })
  })
})

// 🚀 SERVER START
const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
  console.log(`🔥 Payment Service rodando na porta ${PORT}`)
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`🌐 CORS origin: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`)
})
