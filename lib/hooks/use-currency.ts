'use client'

import { useState, useEffect, useContext, createContext, ReactNode } from 'react'
import { Currency, BASE_CURRENCY, SUPPORTED_CURRENCIES, currencyConverter } from '@/lib/currency-converter'

interface CurrencyContextType {
  selectedCurrency: Currency
  setCurrency: (currency: Currency) => void
  convertPrice: (amountUSD: number) => Promise<string>
  isLoading: boolean
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

interface CurrencyProviderProps {
  children: ReactNode
}

export function CurrencyProvider({ children }: CurrencyProviderProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(BASE_CURRENCY)
  const [isLoading, setIsLoading] = useState(false)

  // Auto-detect user currency on app load
  useEffect(() => {
    const initializeCurrency = async () => {
      try {
        setIsLoading(true)
        
        // First check if user has a saved preference
        const savedCurrency = localStorage.getItem('preferred_currency')
        if (savedCurrency) {
          const currency = SUPPORTED_CURRENCIES.find(c => c.code === savedCurrency)
          if (currency) {
            setSelectedCurrency(currency)
            return
          }
        }

        // If no saved preference, try to detect based on location
        const detectedCurrencyCode = await currencyConverter.getUserCurrency()
        const detectedCurrency = SUPPORTED_CURRENCIES.find(c => c.code === detectedCurrencyCode)
        
        if (detectedCurrency) {
          setSelectedCurrency(detectedCurrency)
          localStorage.setItem('preferred_currency', detectedCurrency.code)
        }

      } catch (error) {
        console.warn('Failed to initialize currency:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeCurrency()
  }, [])

  const setCurrency = (currency: Currency) => {
    setSelectedCurrency(currency)
    localStorage.setItem('preferred_currency', currency.code)
  }

  const convertPrice = async (amountUSD: number): Promise<string> => {
    try {
      const priceDisplay = await currencyConverter.getPriceDisplay(amountUSD, selectedCurrency.code)
      return priceDisplay.formatted
    } catch (error) {
      console.error('Failed to convert price:', error)
      return `${selectedCurrency.symbol}${amountUSD.toFixed(2)}`
    }
  }

  return (
    <CurrencyContext.Provider value={{
      selectedCurrency,
      setCurrency,
      convertPrice,
      isLoading
    }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return context
}

// Individual hook for simple price conversion
export function usePriceConversion(amountUSD: number) {
  const { selectedCurrency, convertPrice } = useCurrency()
  const [convertedPrice, setConvertedPrice] = useState<string>('')
  const [isConverting, setIsConverting] = useState(false)

  useEffect(() => {
    const convert = async () => {
      setIsConverting(true)
      try {
        const converted = await convertPrice(amountUSD)
        setConvertedPrice(converted)
      } catch (error) {
        console.error('Conversion failed:', error)
        setConvertedPrice(`${selectedCurrency.symbol}${amountUSD.toFixed(2)}`)
      } finally {
        setIsConverting(false)
      }
    }

    convert()
  }, [amountUSD, selectedCurrency, convertPrice])

  return {
    convertedPrice,
    isConverting,
    originalPrice: `$${amountUSD.toFixed(2)} USD`,
    currency: selectedCurrency
  }
}