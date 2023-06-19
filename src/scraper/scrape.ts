import type { Page } from 'puppeteer'

interface ResponseData {
  total: number
  total_pages: number
  results: ImageData[]
}

interface ImageData {
  id: string
  description?: string
  urls: {
    full?: string
    raw?: string
    regular?: string
    small?: string
    small_s3?: string
    thumb?: string
  }
}

const scrape = async (
  page: Page,
  query: string,
  p: number,
  limit: number,
  hide_plus: boolean = false
): Promise<ResponseData | false> => {
  let api_url = `https://unsplash.com/napi/search/photos?query=${query}&per_page=${limit}&page=${p}`

  if (hide_plus) {
    api_url += '&plus=none'
  }

  const data = await page.evaluate((api_url) => {
    return fetch(api_url)
      .then((res) => res.json())
      .then((data) => data)
      .catch(() => false)
  }, api_url)

  const images = data.results.map((result: ImageData) => {
    return {
      id: result.id,
      description: result.description || null,
      urls: {
        full: result.urls.full || null,
        raw: result.urls.raw || null,
        regular: result.urls.regular || null,
        small: result.urls.small || null,
        small_s3: result.urls.small_s3 || null,
        thumb: result.urls.thumb || null,
      },
    }
  })

  if (data) {
    return {
      total: data.total,
      total_pages: data.total_pages,
      results: images,
    }
  }

  return false
}

export default scrape
