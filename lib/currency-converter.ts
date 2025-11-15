/**
 * Currency conversion utilities for international pricing
 */

export interface Currency {
  code: string
  name: string
  symbol: string
  country: string
  flag: string
}

export interface ConversionRate {
  from: string
  to: string
  rate: number
  lastUpdated: Date
}

export interface PriceDisplay {
  amount: number
  currency: Currency
  formatted: string
}

// Supported currencies with their details
export const SUPPORTED_CURRENCIES: Currency[] = [
  // Major currencies
  { code: 'USD', name: 'US Dollar', symbol: '$', country: 'United States', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', country: 'European Union', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', symbol: '£', country: 'United Kingdom', flag: '🇬🇧' },
  
  // Asian currencies
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', country: 'Japan', flag: '🇯🇵' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', country: 'China', flag: '🇨🇳' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', country: 'India', flag: '🇮🇳' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', country: 'South Korea', flag: '🇰🇷' },
  
  // African currencies
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', country: 'Kenya', flag: '🇰🇪' },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', country: 'Nigeria', flag: '🇳🇬' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', country: 'South Africa', flag: '🇿🇦' },
  { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£', country: 'Egypt', flag: '🇪🇬' },
  { code: 'MAD', name: 'Moroccan Dirham', symbol: 'DH', country: 'Morocco', flag: '🇲🇦' },
  
  // Latin American currencies
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', country: 'Brazil', flag: '🇧🇷' },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$', country: 'Mexico', flag: '🇲🇽' },
  { code: 'ARS', name: 'Argentine Peso', symbol: '$', country: 'Argentina', flag: '🇦🇷' },
  { code: 'COP', name: 'Colombian Peso', symbol: '$', country: 'Colombia', flag: '🇨🇴' },
  
  // Other currencies
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', country: 'Canada', flag: '🇨🇦' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', country: 'Australia', flag: '🇦🇺' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr', country: 'Switzerland', flag: '🇨🇭' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', country: 'Sweden', flag: '🇸🇪' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', country: 'Norway', flag: '🇳🇴' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr', country: 'Denmark', flag: '🇩🇰' },
]

// Base currency for our app (USD)
export const BASE_CURRENCY: Currency = SUPPORTED_CURRENCIES.find(c => c.code === 'USD')!

class CurrencyConverter {
  private rates: Map<string, ConversionRate> = new Map()
  private lastFetch: Date | null = null
  private readonly CACHE_DURATION = 60 * 60 * 1000 // 1 hour in milliseconds

  /**
   * Get current exchange rates from a free API
   */
  private async fetchRates(): Promise<void> {
    try {
      // Using exchangerate-api.com (free tier: 1500 requests/month)
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD')
      
      if (!response.ok) {
        throw new Error('Failed to fetch exchange rates')
      }

      const data = await response.json()
      const rates = data.rates

      // Store all conversion rates
      for (const [currencyCode, rate] of Object.entries(rates)) {
        if (typeof rate === 'number') {
          this.rates.set(`USD_${currencyCode}`, {
            from: 'USD',
            to: currencyCode,
            rate: rate,
            lastUpdated: new Date()
          })
        }
      }

      this.lastFetch = new Date()
      console.log(`✅ Updated exchange rates for ${this.rates.size} currencies`)

    } catch (error) {
      console.error('❌ Failed to fetch exchange rates:', error)
      
      // Fallback to approximate rates if API fails
      this.setFallbackRates()
    }
  }

  /**
   * Set approximate fallback rates when API is unavailable
   */
  private setFallbackRates(): void {
    const fallbackRates: { [key: string]: number } = {
      'USD': 1.00,
      'EUR': 0.85,
      'GBP': 0.73,
      'JPY': 110.0,
      'CNY': 6.45,
      'INR': 74.0,
      'KRW': 1180.0,
      'KES': 110.0,
      'NGN': 411.0,
      'ZAR': 14.8,
      'EGP': 15.7,
      'MAD': 9.0,
      'BRL': 5.2,
      'MXN': 20.1,
      'ARS': 98.5,
      'COP': 3800.0,
      'CAD': 1.25,
      'AUD': 1.35,
      'CHF': 0.92,
      'SEK': 8.5,
      'NOK': 8.6,
      'DKK': 6.3,
    }

    for (const [currencyCode, rate] of Object.entries(fallbackRates)) {
      this.rates.set(`USD_${currencyCode}`, {
        from: 'USD',
        to: currencyCode,
        rate: rate,
        lastUpdated: new Date()
      })
    }

    console.log('⚠️ Using fallback exchange rates')
  }

  /**
   * Check if rates need to be refreshed
   */
  private needsRefresh(): boolean {
    if (!this.lastFetch) return true
    
    const now = new Date()
    const timeDiff = now.getTime() - this.lastFetch.getTime()
    return timeDiff > this.CACHE_DURATION
  }

  /**
   * Convert amount from USD to target currency
   */
  async convert(amountUSD: number, targetCurrency: string): Promise<number> {
    // Ensure we have fresh rates
    if (this.needsRefresh()) {
      await this.fetchRates()
    }

    // If target is USD, no conversion needed
    if (targetCurrency === 'USD') {
      return amountUSD
    }

    // Get conversion rate
    const rateKey = `USD_${targetCurrency}`
    const conversionRate = this.rates.get(rateKey)

    if (!conversionRate) {
      console.warn(`⚠️ No conversion rate found for ${targetCurrency}, using USD`)
      return amountUSD
    }

    return amountUSD * conversionRate.rate
  }

  /**
   * Format price with proper currency formatting
   */
  formatPrice(amount: number, currency: Currency): string {
    const currencyInfo = SUPPORTED_CURRENCIES.find(c => c.code === currency.code)
    if (!currencyInfo) {
      return `${amount.toFixed(2)} ${currency.code}`
    }

    // Special formatting for different currencies
    switch (currency.code) {
      case 'JPY':
      case 'KRW':
        // No decimal places for yen and won
        return `${currencyInfo.symbol}${Math.round(amount).toLocaleString()}`
      
      case 'INR':
        // Indian number formatting (lakhs, crores)
        return `${currencyInfo.symbol}${amount.toLocaleString('en-IN', { 
          minimumFractionDigits: 2, 
          maximumFractionDigits: 2 
        })}`
      
      default:
        // Standard formatting
        return `${currencyInfo.symbol}${amount.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}`
    }
  }

  /**
   * Get a formatted price display object
   */
  async getPriceDisplay(amountUSD: number, targetCurrencyCode: string): Promise<PriceDisplay> {
    const currency = SUPPORTED_CURRENCIES.find(c => c.code === targetCurrencyCode) || BASE_CURRENCY
    const convertedAmount = await this.convert(amountUSD, targetCurrencyCode)
    const formatted = this.formatPrice(convertedAmount, currency)

    return {
      amount: convertedAmount,
      currency: currency,
      formatted: formatted
    }
  }

  /**
   * Get user's likely currency based on their location (if available)
   */
  async getUserCurrency(): Promise<string> {
    try {
      // Try to get user's location
      const response = await fetch('https://ipapi.co/json/')
      const data = await response.json()
      
      // Map country codes to currencies
      const countryCurrencyMap: { [key: string]: string } = {
        'US': 'USD', 'CA': 'CAD', 'MX': 'MXN',
        'GB': 'GBP', 'DE': 'EUR', 'FR': 'EUR', 'IT': 'EUR', 'ES': 'EUR', 'NL': 'EUR',
        'JP': 'JPY', 'CN': 'CNY', 'IN': 'INR', 'KR': 'KRW',
        'KE': 'KES', 'NG': 'NGN', 'ZA': 'ZAR', 'EG': 'EGP', 'MA': 'MAD',
        'BR': 'BRL', 'AR': 'ARS', 'CO': 'COP',
        'AU': 'AUD', 'CH': 'CHF', 'SE': 'SEK', 'NO': 'NOK', 'DK': 'DKK',
      }

      const currency = countryCurrencyMap[data.country_code]
      return currency || 'USD'

    } catch (error) {
      console.warn('Could not detect user location, defaulting to USD')
      return 'USD'
    }
  }
}

// Export singleton instance
export const currencyConverter = new CurrencyConverter()

/**
 * Helper function to convert and format price
 */
export async function convertPrice(amountUSD: number, targetCurrency: string = 'USD'): Promise<string> {
  const priceDisplay = await currencyConverter.getPriceDisplay(amountUSD, targetCurrency)
  return priceDisplay.formatted
}

/**
 * Helper function to get currency by country name
 */
export function getCurrencyByCountry(countryName: string): Currency | undefined {
  const countryMap: { [key: string]: string } = {
    'united states': 'USD', 'usa': 'USD', 'america': 'USD',
    'canada': 'CAD',
    'mexico': 'MXN',
    'united kingdom': 'GBP', 'uk': 'GBP', 'britain': 'GBP', 'england': 'GBP',
    'germany': 'EUR', 'france': 'EUR', 'italy': 'EUR', 'spain': 'EUR', 'netherlands': 'EUR',
    'japan': 'JPY',
    'china': 'CNY',
    'india': 'INR',
    'south korea': 'KRW', 'korea': 'KRW',
    'kenya': 'KES',
    'nigeria': 'NGN',
    'south africa': 'ZAR',
    'egypt': 'EGP',
    'morocco': 'MAD',
    'brazil': 'BRL',
    'argentina': 'ARS',
    'colombia': 'COP',
    'australia': 'AUD',
    'switzerland': 'CHF',
    'sweden': 'SEK',
    'norway': 'NOK',
    'denmark': 'DKK',
  }

  const currencyCode = countryMap[countryName.toLowerCase()]
  return SUPPORTED_CURRENCIES.find(c => c.code === currencyCode)
}