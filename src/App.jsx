import { useState, useEffect } from 'react';

import NotificationError from './components/NotificationError'
import currencyService from './services/currencies'

function App() {

  const defaultCurrency = 'EUR'

  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState(defaultCurrency)
  const [rate, setRate] = useState(0)
  const [conversionHistory, setConversionHistory] = useState([])
  const [messageError, setErrorMessage] = useState(null)

  const currencyList = [
    defaultCurrency,
    'GBP',
    'CZK',
    'RUB'
  ]

  useEffect(() => {
    currencyService
      .convert(currency)
      .then(function (object) {
        const rate = object.rates && object.rates['USD'] ? object.rates['USD'].rate : 0
        setRate(rate)
      })
      .catch((error) => {
        console.log(error)
        setRate(0)
      })
  }, [currency])

  const handleAmountChange = (event) => {
    const inputAmount = event.target.value
    if( /^\d*\.?\d*$/.test(inputAmount) ){
      setAmount(inputAmount)
    }
    if( inputAmount.trim().length === 0 ){
      console.log('⛔️ amount is empty')
      setErrorMessage('⛔️ amount is empty')
    } else {
      console.log('✅ amount is not empty')
      setErrorMessage('')
    }
  }

  const handleCurrencyChange = (event) => {
    setCurrency(event.target.value)
  }

  const addConversion = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)

    if( amount.trim().length === 0 ){
      console.log('⛔️ amount is empty')
      setErrorMessage('⛔️ amount is empty')
      return
    }
    console.log('✅ amount is not empty')
    
    const newConversion = {
      amount: new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount),
      currency: currency,
      convertedAmount: new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(rate * amount)
    }

    setConversionHistory([...conversionHistory, newConversion])

    setCurrency(defaultCurrency)
    setAmount('')
    setErrorMessage(null)
  }

  return (
    <div className="bg-slate-800 text-slate-100" >
      <header className="flex flex-row justify-center items-center py-8" >
        <h1 className="text-4xl font-bold text-center" >
          Currency exchange
        </h1>
      </header>
      <div className="text-lg flex flex-col items-center" >
        <form onSubmit={addConversion} className="text-center my-4" >
          <div className="flex flex-row items-center space-x-3" >
            <div className="flex flex-row items-center space-x-3" >
              <div>amount: </div>
              <input
                  className="px-1 py-0.5 text-slate-800 text-base"
                  type="text"
                  inputMode="numeric"
                  value={amount}
                  onChange={handleAmountChange}
              />
            </div>
            <div className="text-slate-800 text-base" >
              <select
                id="currencies"
                name="currencies"
                onChange={handleCurrencyChange}
                value={currency}
              >
                {currencyList.map((currency, index) =>
                  <option key={index} value={currency} >{currency}</option>
                )}
              </select>
            </div>
          </div>
          <NotificationError messageError={messageError} />
          <div className="p-1" >
              amount in USD: {rate * amount}
          </div>
          <div>
            <button type='submit' className="px-3 my-2 bg-slate-50 text-slate-800 rounded" >Save</button>
          </div>
        </form>
        <table className="my-8 text-right" >
          <thead>
            <tr className="border-b border-slate-400" >
              <th className="px-3 pb-1.5" >Amount</th>
              <th className="px-3 pb-1.5" >Currency</th>
              <th className="px-3 pb-1.5" >Amount in USD</th>
            </tr>
          </thead>
          <tbody>
            {conversionHistory.map((conversion, index) => (
              <tr key={index}>
                <td className="px-3 pt-1" >{conversion.amount}</td>
                <td className="px-3 pt-1" >{conversion.currency}</td>
                <td className="px-3 pt-1" >{conversion.convertedAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
