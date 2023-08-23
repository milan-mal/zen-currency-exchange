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
    <div className="App bg-slate-800 text-slate-100" >
      <header className="App-header p-8" >
        <h1 className="text-3xl font-bold text-center" >
          Currency exchange
        </h1>
      </header>
      <div className="App-body" >
        <form onSubmit={addConversion} className="text-center my-4" >
          <div className="App-form-amount" >
            <div className="App-form-item" >
              <div className="App-form-item" >amount: </div>
              <input
                  className="App-form-item"
                  type="text"
                  inputMode="numeric"
                  value={amount}
                  onChange={handleAmountChange}
              />
            </div>
            <div className="App-form-item" >
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
          <div>
              amount in USD: {convertedAmount}
          </div>
          <div>
            <button type='submit' className="p-1 px-3 my-2 bg-slate-50 text-slate-800 font-bold rounded" >Save</button>
          </div>
        </form>
        <table className="App-table-history" >
          <thead>
            <tr>
              <th className="App-table-cell" >Amount</th>
              <th className="App-table-cell" >Currency</th>
              <th className="App-table-cell" >Amount in USD</th>
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
