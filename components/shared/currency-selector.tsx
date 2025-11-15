'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, Globe, DollarSign } from 'lucide-react'
import { 
  Currency, 
  SUPPORTED_CURRENCIES, 
  BASE_CURRENCY, 
  currencyConverter,
  convertPrice 
} from '@/lib/currency-converter'

interface CurrencySelectorProps {
  onCurrencyChange?: (currency: Currency) => void
  className?: string
}

export function CurrencySelector({ onCurrencyChange, className = '' }: CurrencySelectorProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(BASE_CURRENCY)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Auto-detect user's currency on mount
  useEffect(() => {
    const detectUserCurrency = async () => {
      try {
        setIsLoading(true)
        const userCurrencyCode = await currencyConverter.getUserCurrency()
        const userCurrency = SUPPORTED_CURRENCIES.find(c => c.code === userCurrencyCode)
        
        if (userCurrency && userCurrency !== selectedCurrency) {
          setSelectedCurrency(userCurrency)
          onCurrencyChange?.(userCurrency)
        }
      } catch (error) {
        console.warn('Failed to detect user currency:', error)
      } finally {
        setIsLoading(false)
      }
    }

    detectUserCurrency()
  }, []) // Only run once on mount

  const handleCurrencySelect = (currency: Currency) => {
    setSelectedCurrency(currency)
    setIsOpen(false)
    onCurrencyChange?.(currency)
    
    // Store user preference
    localStorage.setItem('preferred_currency', currency.code)
  }

  // Load saved preference on mount
  useEffect(() => {
    const savedCurrency = localStorage.getItem('preferred_currency')
    if (savedCurrency) {
      const currency = SUPPORTED_CURRENCIES.find(c => c.code === savedCurrency)
      if (currency) {
        setSelectedCurrency(currency)
        onCurrencyChange?.(currency)
      }
    }
  }, [])

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:border-gray-400 transition-colors text-sm"
        disabled={isLoading}
      >
        <Globe className="w-4 h-4 text-gray-500" />
        <span className="text-lg">{selectedCurrency.flag}</span>
        <span className="font-medium">{selectedCurrency.symbol}</span>
        <span className="text-gray-600">{selectedCurrency.code}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-80 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-2">
            <div className="text-xs text-gray-500 mb-2 px-2">
              Select your local currency
            </div>
            
            {SUPPORTED_CURRENCIES.map((currency) => (
              <button
                key={currency.code}
                onClick={() => handleCurrencySelect(currency)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors text-left ${
                  selectedCurrency.code === currency.code ? 'bg-blue-50 border border-blue-200' : ''
                }`}
              >
                <span className="text-xl">{currency.flag}</span>
                <div className="flex-1">
                  <div className="font-medium text-sm">{currency.name}</div>
                  <div className="text-xs text-gray-500">{currency.country}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-sm">{currency.symbol}</div>
                  <div className="text-xs text-gray-500">{currency.code}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

interface PriceDisplayProps {
  amountUSD: number
  currency?: Currency
  className?: string
  showOriginal?: boolean
}

export function PriceDisplay({ 
  amountUSD, 
  currency = BASE_CURRENCY, 
  className = '',
  showOriginal = false 
}: PriceDisplayProps) {
  const [convertedPrice, setConvertedPrice] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const convertAmount = async () => {
      setIsLoading(true)
      try {
        const formatted = await convertPrice(amountUSD, currency.code)
        setConvertedPrice(formatted)
      } catch (error) {
        console.error('Failed to convert price:', error)
        setConvertedPrice(`${currency.symbol}${amountUSD.toFixed(2)}`)
      } finally {
        setIsLoading(false)
      }
    }

    convertAmount()
  }, [amountUSD, currency])

  if (isLoading) {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        <span className="text-gray-500">Converting...</span>
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="font-semibold text-lg">
        {convertedPrice}
      </div>
      {showOriginal && currency.code !== 'USD' && (
        <div className="text-sm text-gray-500">
          ≈ ${amountUSD.toFixed(2)} USD
        </div>
      )}
    </div>
  )
}

interface CurrencyConverterWidgetProps {
  prices: { label: string; amountUSD: number }[]
  className?: string
}

export function CurrencyConverterWidget({ prices, className = '' }: CurrencyConverterWidgetProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(BASE_CURRENCY)

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-green-600" />
          <h3 className="font-semibold text-gray-900">Pricing</h3>
        </div>
        <CurrencySelector 
          onCurrencyChange={setSelectedCurrency}
          className="text-sm"
        />
      </div>
      
      <div className="space-y-3">
        {prices.map((price, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-gray-700">{price.label}</span>
            <PriceDisplay 
              amountUSD={price.amountUSD}
              currency={selectedCurrency}
              showOriginal={true}
              className="text-right"
            />
          </div>
        ))}
      </div>
      
      {selectedCurrency.code !== 'USD' && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            * Prices are estimated based on current exchange rates and may vary.
          </p>
        </div>
      )}
    </div>
  )
}