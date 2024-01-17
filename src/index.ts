import { Hono } from 'hono'
import { validator } from 'hono/validator'
import { logger } from 'hono/logger'

const app = new Hono<{ Bindings: { kv: KVNamespace } }>()
app.use('*', logger())

interface RequestBody {
  slug?: string
  destination?: string
}

app.get('/:slug', async (c) => {
  const { slug } = c.req.param()
  const destination = await c.env.kv.get(slug)
  if (destination === null) return c.text('Could not find that slug.', 404)

  return c.redirect(destination)
})

app.post(
  '/create',
  validator('json', (value: RequestBody, c) => {
    const properties = ['slug', 'destination']
    if (properties.some((v) => !(v in value))) {
      return c.text(`${properties.find((v) => !(v in value))} is missing.`, 400)
    }
    return value
  }),
  async (c) => {
    const { slug, destination } = await c.req.json()
    await c.env.kv.put(slug, destination)
    return c.text(`Created redirect: ${slug} -> ${destination}`)
  }
)

export default app
