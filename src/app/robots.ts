import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://poestagram.com'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/'],
        disallow: [
          '/api/',
          '/_next/',
          '/admin/',
          '/create/',
          '/profile/edit/',
          '/reset-password/',
          '/login/',
          '/signup/'
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: ['/'],
        disallow: [
          '/api/',
          '/_next/',
          '/admin/',
          '/create/',
          '/profile/edit/',
          '/reset-password/'
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
} 