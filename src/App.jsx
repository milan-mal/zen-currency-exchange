import { useState, useEffect } from 'react';

import './App.css';
import NotificationError from './components/NotificationError'
import currencyService from './services/currencies'

function App() {

  const defaultCurrency = 'EUR'

  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState(defaultCurrency)
  const [convertedAmount, setConvertedAmount] = useState(0)
  const [conversionHistory, setConversionHistory] = useState([])
  const [messageError, setErrorMessage] = useState(null)

  const currencyList = [
    defaultCurrency,
    'GBP',
    'CZK',
    'RUB'
  ]

  useEffect(() => {
    if (amount !== ''){
      currencyService
        .convert(currency, amount)
        .then(function (object) {
          const rateForAmount = object.rates && object.rates['USD'] ? object.rates['USD'].rate_for_amount : 0
          setConvertedAmount(rateForAmount)
        })
        .catch((error) => {
          console.log(error)
          setConvertedAmount(0)
        })
    }
  }, [currency, amount])

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
      amount: amount,
      currency: currency,
      convertedAmount: convertedAmount
    }

    setConversionHistory([...conversionHistory, newConversion])

    setCurrency(defaultCurrency)
    setAmount('')
    setConvertedAmount(0)
    setErrorMessage(null)
  }

  return (
    <div className="h-screen min-h-min bg-slate-800 text-slate-100" >
      <header className="flex flex-row justify-center items-center h-1/5" >
        <h1 className="text-4xl font-bold text-center" >
          Currency exchange
        </h1>
      </header>
      <div className="text-lg h-screen flex flex-col items-center" >
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
              amount in USD: {convertedAmount}
          </div>
          <div>
            <button type='submit' className="p-0.5 px-3 my-2 bg-slate-50 text-slate-800 font-bold rounded" >Save</button>
          </div>
        </form>
        <table className="my-8 text-center" >
          <thead>
            <tr>
              <th className="px-3 pb-2" >Amount</th>
              <th className="px-3 pb-2" >Currency</th>
              <th className="px-3 pb-2" >Amount in USD</th>
            </tr>
          </thead>
          <tbody>
            {conversionHistory.map((conversion, index) => (
              <tr key={index}>
                <td>{conversion.amount}</td>
                <td>{conversion.currency}</td>
                <td>{conversion.convertedAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
