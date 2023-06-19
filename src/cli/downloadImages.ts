import type { Image } from '../types.js'
import download from 'image-downloader'
import cliProgress from 'cli-progress'
import path from 'path'
import fs from 'fs'

interface DownloadImagesOptions {
  images: Image[]
  name: string
}

const downloadPath = path.join(path.resolve('downloads'))

if (!fs.existsSync(downloadPath)) {
  fs.mkdirSync(downloadPath)
}

const downloadImage = async (url: string, id: string, folder: string) => {
  try {
    const options = {
      url,
      dest: path.join(downloadPath, folder, `${id}.jpg`),
    }

    await download.image(options)
  } catch (err) {
    console.error(err)
  }
}

const downloadImages = async ({ images, name }: DownloadImagesOptions) => {
  console.log('\n')
  const progressBar = new cliProgress.SingleBar({
    format: 'Downloading Images [{bar}] {percentage}% | {value}/{total}',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true,
  })

  const namePath = path.join(downloadPath, name)

  if (fs.existsSync(namePath)) {
    fs.rmSync(namePath, { recursive: true, force: true })
    fs.mkdirSync(namePath)
  } else {
    fs.mkdirSync(namePath)
  }

  progressBar.start(images.length, 0)

  const downloadPromises = images.map(async (image) => {
    await downloadImage(image.url, image.id, name)
    progressBar.increment()
  })

  await Promise.all(downloadPromises)
  progressBar.stop()
}

export default downloadImages
