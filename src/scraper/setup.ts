import type { Mode, Size } from '../types.js'
import puppeteer, { Page } from 'puppeteer'
import inquirer from 'inquirer'

interface Settings {
  page: Page
  mode: Mode
  seachQuery?: string
  downloadAllImages?: boolean
  max_images?: number
  size?: Size
  hide_plus?: boolean
  concurrent?: number
}

const setupScraper = async (): Promise<Settings> => {
  try {
    const browser = await puppeteer.launch({ headless: 'new' })
    const page = await browser.newPage()

    await page.goto('https://unsplash.com/')

    // Handle Ctrl + C signal
    process.on('SIGINT', async () => {
      await browser.close()
      process.exit(0)
    })

    const modeAnswers = await inquirer.prompt([
      {
        name: 'run_http_server',
        type: 'list',
        message: 'Do you want to run the REST API or use the scraper cli?',
        choices: ['REST API', 'Scraper CLI'],
      },
    ])

    if (modeAnswers.run_http_server === 'REST API') {
      return { page, mode: 'REST API' }
    }

    const answers = await inquirer.prompt([
      {
        name: 'seachQuery',
        type: 'input',
        message: 'What do you want to search for?',
      },
      {
        name: 'downloadAllImages',
        type: 'confirm',
        message: 'Do you want to download all images?',
      },
      {
        name: 'size',
        type: 'list',
        message: 'What size do you want to download?',
        choices: ['Small', 'Medium', 'Original'],
      },
      {
        name: 'hide_plus',
        type: 'confirm',
        message: 'Do you want to exclude images that have unsplash watermark?',
      },
      {
        name: 'concurrent',
        type: 'input',
        message: 'How many concurrent operations do you want to run at once?',
      },
    ])

    const seachQuery = answers.seachQuery
    const downloadAllImages = answers.downloadAllImages
    const size = answers.size
    const hide_plus = answers.hide_plus
    const concurrent = answers.concurrent && +answers.concurrent

    let max_images = null

    if (!seachQuery) {
      console.error('Missing search query')
      process.exit(1)
    }

    if (!downloadAllImages) {
      const answers = await inquirer.prompt([
        {
          name: 'max_images',
          type: 'input',
          message: 'How many images do you want to download?',
        },
      ])

      // if exists, convert to number
      max_images = answers.max_images && +answers.max_images

      if (!max_images) {
        console.error('Missing max images')
        process.exit(1)
      }
    }

    return {
      page,
      mode: 'Scraper CLI',
      seachQuery,
      downloadAllImages,
      max_images,
      size,
      hide_plus,
      concurrent,
    }
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

export default setupScraper
