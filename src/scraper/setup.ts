import type { Mode, Order, Orientation, Size } from '../types.js'
import puppeteer, { Page, Browser } from 'puppeteer'
import inquirer from 'inquirer'
import fs from 'fs'
import path from 'path'

interface Settings {
  page: Page
  mode: Mode
  searchQueries?: string[]
  downloadAllImages?: boolean
  max_images?: number
  size?: Size
  hide_plus?: boolean
  order_by?: Order
  orientation?: Orientation
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
        choices: ['Scraper CLI', 'REST API'],
      },
    ])

    if (modeAnswers.run_http_server === 'REST API') {
      return { page, mode: 'REST API' }
    }

    let searchQueries: string[] = []
    let downloadAllImages = null
    let size = null
    let hide_plus = null
    let order_by = null
    let orientation = null
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

    const questions: any[] = []

    // Getting search queries from file
    const searchFilePath = path.resolve('search.txt')
    const searchFileExists = fs.existsSync(searchFilePath)

    if (!searchFileExists) {
      questions.push({
        name: 'searchQuery',
        type: 'input',
        message: 'What do you want to search for?',
      })
    } else {
      const searchFile = fs.readFileSync(searchFilePath, 'utf8')
      const fileQueries = searchFile
        .replace(/\r/g, '')
        .split('\n')
        .filter((query) => query !== '')
        .map((query) => query.trim().toLowerCase())

      if (fileQueries.length >= 1) {
        searchQueries = fileQueries
      } else {
        questions.push({
          name: 'searchQuery',
          type: 'input',
          message: 'What do you want to search for?',
        })
      }
    }

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

    if (cliConfigData.order_by) {
      order_by = cliConfigData.order_by
    }

    if (cliConfigData.orientation) {
      orientation = cliConfigData.orientation
    }

    if (cliConfigData.concurrent) {
      concurrent = cliConfigData.concurrent && +cliConfigData.concurrent
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
        choices: ['Original', 'Small', 'Medium'],
      })
    }

    if (!hide_plus) {
      questions.push({
        name: 'hide_plus',
        type: 'confirm',
        message: 'Do you want to exclude images that have unsplash watermark?',
      })
    }

    if (!order_by) {
      questions.push({
        name: 'order_by',
        type: 'list',
        message: 'How do you want to order the images?',
        choices: ['relevant', 'editorial', 'latest'],
      })
    }

    if (!orientation) {
      questions.push({
        name: 'orientation',
        type: 'list',
        message: 'What orientation do you want to download?',
        choices: ['all', 'portrait', 'landscape'],
      })
    }

    if (!concurrent) {
      questions.push({
        name: 'concurrent',
        type: 'input',
        message: `How many concurrent operations do you want to run at once?`,
      })
    }

    const answers = await inquirer.prompt(questions)

    const searchQuery = answers.searchQuery

    if (!searchQuery && searchQueries.length === 0) {
      console.error('Missing search query')
      process.exit(1)
    }

    if (searchQuery) {
      searchQueries = [searchQuery]
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

    if (answers.order_by) {
      order_by = answers.order_by
    }

    if (answers.orientation) {
      orientation = answers.orientation
    }

    if (answers.concurrent) {
      concurrent = answers.concurrent && +answers.concurrent
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
    }

    if (
      !(max_images || downloadAllImages) ||
      !size ||
      !hide_plus ||
      !order_by ||
      !orientation ||
      !concurrent
    ) {
      console.error('Missing some options')
      process.exit(1)
    }

    return {
      page,
      mode: 'Scraper CLI',
      searchQueries,
      downloadAllImages,
      max_images,
      size,
      hide_plus,
      order_by,
      orientation,
      concurrent,
    }
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

export default setupScraper
