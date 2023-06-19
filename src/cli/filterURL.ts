import { Size } from '../types.js'

const filterImageUrl = (url: string, size: Size) => {
  // Parse the URL
  const parsedUrl = new URL(url)

  // Remove any existing query parameters
  parsedUrl.search = ''

  parsedUrl.searchParams.append('fm', 'jpg')

  if (size === 'Small') {
    parsedUrl.searchParams.append('w', '400')
  } else if (size === 'Medium') {
    parsedUrl.searchParams.append('w', '1080')
  }

  // Return the updated URL
  return parsedUrl.toString()
}

export default filterImageUrl
