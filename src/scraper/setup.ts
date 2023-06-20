import type { Mode, Size } from '../types.js'
import puppeteer, { Page, Browser } from 'puppeteer'
import inquirer from 'inquirer'
import fs from 'fs'

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

let browser: Browser | null = null

// Handle Quit
process.on('SIGINT', async () => {
  if (browser) await browser.close()
  process.exit(0)
})

const setupScraper = async (): Promise<Settings> => {
  try {
    browser = await puppeteer.launch({ headless: 'new' })
    const page = await browser.newPage()

    await page.goto('https://unsplash.com/')

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

    let downloadAllImages = null
    let size = null
    let hide_plus = null
    let concurrent = null
    let max_images = null

    const cliConfigExists = fs.existsSync('./cli.config.json')

    if (!cliConfigExists) {
      console.error('Missing cli.config.json')
      process.exit(1)
    }

    const cliConfig = fs.readFileSync('./cli.config.json', 'utf-8')
    const cliConfigData = JSON.parse(cliConfig)

    if (!cliConfigData) {
      console.error('Invalid config.json')
      process.exit(1)
    }

    const questions: any[] = [
      {
        name: 'seachQuery',
        type: 'input',
        message: 'What do you want to search for?',
      },
    ]

    if (cliConfigData.downloadAllImages && cliConfigData.max_images) {
      console.error('You can only set one of downloadAllImages or max_images')
      process.exit(1)
    }

    if (cliConfigData.downloadAllImages) {
      downloadAllImages = cliConfigData.downloadAllImages
    }

    if (cliConfigData.max_images) {
      max_images = cliConfigData.max_images
    }

    if (cliConfigData.size) {
      size = cliConfigData.size
    }

    if (cliConfigData.hide_plus) {
      hide_plus = cliConfigData.hide_plus
    }

    if (cliConfigData.concurrent) {
      concurrent = cliConfigData.concurrent
    }

    if (!downloadAllImages && !max_images) {
      questions.push({
        name: 'downloadAllImages',
        type: 'confirm',
        message: 'Do you want to download all images?',
      })
    }

    if (!size) {
      questions.push({
        name: 'size',
        type: 'list',
        message: 'What size do you want to download?',
        choices: ['Small', 'Medium', 'Original'],
      })
    }

    if (!hide_plus) {
      questions.push({
        name: 'hide_plus',
        type: 'confirm',
        message: 'Do you want to exclude images that have unsplash watermark?',
      })
    }

    if (!concurrent) {
      questions.push({
        name: 'concurrent',
        type: 'input',
        message: 'How many concurrent operations do you want to run at once?',
      })
    }

    const answers = await inquirer.prompt(questions)

    const seachQuery = answers.seachQuery

    if (!seachQuery) {
      console.error('Missing search query')
      process.exit(1)
    }

    if (answers.downloadAllImages) {
      downloadAllImages = answers.downloadAllImages
    }

    if (answers.max_images) {
      max_images = answers.max_images
    }

    if (answers.size) {
      size = answers.size
    }

    if (answers.hide_plus) {
      hide_plus = answers.hide_plus
    }

    if (answers.concurrent) {
      concurrent = answers.concurrent
    }

    if (!downloadAllImages && !max_images) {
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
