import { Size } from '../types.js'

const filterImageUrl = (url: string, size: Size, hide_plus: boolean) => {
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

  if (hide_plus) {
    parsedUrl.searchParams.append('plus', 'none')
  }

  // Return the updated URL
  return parsedUrl.toString()
}

export default filterImageUrl
