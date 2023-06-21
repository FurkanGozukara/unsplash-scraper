export type Mode = 'REST API' | 'Scraper CLI'
export type Size = 'Small' | 'Medium' | 'Original'
export type Order = 'editorial' | 'latest' | 'relevant'
export type Orientation = 'landscape' | 'portrait' | 'all'
export interface Image {
  id: string
  url: string
}
