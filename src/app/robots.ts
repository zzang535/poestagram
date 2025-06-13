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
          '/create-post/',
          '/edit-profile/',
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
          '/create-post/',
          '/edit-profile/',
          '/reset-password/',
          '/login/',
          '/signup/'
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
} 