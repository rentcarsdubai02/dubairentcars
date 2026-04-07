import { MetadataRoute } from 'next'
import { getVehicles } from '@/actions/vehicle-actions'
import { routing } from '@/i18n/routing'
 
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://dubairentcars.vercel.app'
  const vehicles = await getVehicles()
  const locales = routing.locales
 
  // Static routes
  const staticRoutes = ['', '/about', '/services', '/contact', '/login', '/signup']
  
  const sitemapEntries: MetadataRoute.Sitemap = []

  // Add static routes for each locale
  locales.forEach((locale) => {
    staticRoutes.forEach((route) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route === '' ? 1 : 0.8,
      })
    })
  })

  // Add dynamic vehicle routes for each locale
  vehicles.forEach((car: any) => {
    locales.forEach((locale) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}/services/${car._id}`,
        lastModified: car.updatedAt || new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      })
    })
  })
 
  return sitemapEntries
}
