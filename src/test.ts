import download from 'image-downloader'
import path from 'path'

const options = {
  url: 'https://images.unsplash.com/photo-1654157925394-4b7809721149?crop=entropy&cs=srgb&fm=jpg&ixid=M3wxMjA3fDF8MXxzZWFyY2h8MXx8Y2FyfGVufDB8',
  dest: path.join(path.resolve('file.jpg')),
}

download
  .image(options)
  .then(({ filename }) => {
    console.log('Saved to', filename)
  })
  .catch((err) => console.error(err))
