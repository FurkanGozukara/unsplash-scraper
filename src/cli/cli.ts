import type { Page } from 'puppeteer'
import type { Image, Size } from '../types.js'
import scrape from '../scraper/scrape.js'
import cliProgress from 'cli-progress'
import downloadImages from './downloadImages.js'
import filterImageUrl from './filterURL.js'

const startCliApp = async (
  page: Page,
  seachQuery: string,
  downloadAllImages: boolean,
  max_images: number,
  size: Size,
  hide_plus: boolean
) => {
  console.log('\nSearch query:', seachQuery)

  if (downloadAllImages) {
    console.log('Mode: Download all images')
  } else {
    console.log(`Mode: download ${max_images} images`)
  }

  console.log('\n')
  const progressBar = new cliProgress.SingleBar({
    format: 'Getting links to download [{bar}] {percentage}% | {value}/{total}',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true,
  })

  const imagesToDownload: Image[] = []

  let totalSteps = null

  let p = 1
  const limit = 50

  while (true) {
    if (downloadAllImages && imagesToDownload.length === totalSteps) break
    if (!downloadAllImages && imagesToDownload.length === max_images) break

    const images = await scrape(page, seachQuery, p, limit, hide_plus)

    if (!images || images.results.length === 0) break

    if (totalSteps === null) {
      totalSteps = images.total

      if (!downloadAllImages && max_images < totalSteps) {
        totalSteps = max_images
      } else if (!downloadAllImages && max_images > totalSteps) {
        console.log(`Only ${totalSteps} images found`)
      }

      progressBar.start(totalSteps, 0)
    }

    for (const image of images.results) {
      if (image.urls.raw) {
        imagesToDownload.push({
          id: image.id,
          url: filterImageUrl(image.urls.raw, size),
        })
        progressBar.update(imagesToDownload.length)

        if (downloadAllImages && imagesToDownload.length === totalSteps) break
        if (!downloadAllImages && imagesToDownload.length === max_images) break
      } else {
        console.log('No url found for image:', image)
      }
    }

    p++
  }

  progressBar.stop()

  await downloadImages({
    images: imagesToDownload,
    query: seachQuery,
  })
  process.exit(0)
}

export default startCliApp
