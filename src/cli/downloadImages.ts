import type { Image } from '../types.js'
import download from 'image-downloader'
import cliProgress from 'cli-progress'
import path from 'path'
import fs from 'fs'

interface DownloadImagesOptions {
  images: Image[]
  query: string
}

const downloadPath = path.join(path.resolve('downloads'))
const downloaded: string[] = []
let queryPath = ''

if (!fs.existsSync(downloadPath)) {
  fs.mkdirSync(downloadPath)
}

process.on('SIGINT', () => {
  try {
    console.log('\n')
    console.log('Stopping the application...')

    const queryFiles = fs.readdirSync(queryPath)
    const filesToDelete = queryFiles.filter(
      (file) => !downloaded.includes(file)
    )

    filesToDelete.forEach((file) => {
      fs.unlinkSync(path.join(queryPath, file))
    })

    console.log('Deleted incomplete downloads')

    // Exit the process
    process.exit(0)
  } catch (err) {
    process.exit(0)
  }
})

const downloadImage = async (url: string, id: string, queryPath: string) => {
  try {
    const options = {
      url,
      dest: path.join(queryPath, `${id}.jpg`),
    }

    await download.image(options)
    downloaded.push(`${id}.jpg`)
  } catch (err) {
    console.error(err)
  }
}

const downloadImages = async ({ images, query }: DownloadImagesOptions) => {
  queryPath = path.join(downloadPath, query)

  if (fs.existsSync(queryPath)) {
    console.log('Continuing download from the past session...')
    const oldImages = fs
      .readdirSync(queryPath)
      .map((image) => image.split('.')[0])
    images = images.filter((image) => !oldImages.includes(image.id))
  } else {
    fs.mkdirSync(queryPath)
  }

  console.log('\n')
  const progressBar = new cliProgress.SingleBar({
    format: 'Downloading Images [{bar}] {percentage}% | {value}/{total}',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true,
  })

  progressBar.start(images.length, 0)

  const downloadPromises = images.map(async (image) => {
    await downloadImage(image.url, image.id, queryPath)
    progressBar.increment()
  })

  await Promise.all(downloadPromises)
  progressBar.stop()
}

export default downloadImages
