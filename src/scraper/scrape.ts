import type { Page } from 'puppeteer'

interface ResponseData {
  total: number
  total_pages: number
  results: ImageData[]
}

interface ImageData {
  description: string
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
  limit: number
): Promise<ResponseData | false> => {
  const api_url = `https://unsplash.com/napi/search/photos?query=${query}&per_page=${limit}&page=${p}`

  const data = await page.evaluate((api_url) => {
    return fetch(api_url)
      .then((res) => res.json())
      .then((data) => data)
      .catch(() => false)
  }, api_url)

  const images = data.results.map((result: ImageData) => {
    return {
      description: result.description,
      urls: {
        full: result.urls.full,
        raw: result.urls.raw,
        regular: result.urls.regular,
        small: result.urls.small,
        small_s3: result.urls.small_s3,
        thumb: result.urls.thumb,
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
