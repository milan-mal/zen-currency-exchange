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

  useEffect(() => {
    if (amount !== ''){
      currencyService
        .convert(currency, amount)
        .then(function (object) {
          const rateForAmount = object.rates && object.rates[currency] ? object.rates[currency].rate_for_amount : 0
          setConvertedAmount(rateForAmount)
        })
        .catch((error) => {
          console.log(error)
          setConvertedAmount(0)
        })
    }
  }, [currency, amount])

  const handleAmountChange = (event) => {
    console.log('currency', currency)
    const inputAmount = event.target.value
    if( /^\d*\.?\d*$/.test(inputAmount) ){
      setAmount(inputAmount)
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
    <div className="App">
      <header className="App-header">
        <h1>
          Currency exchange
        </h1>
      </header>
      <div className="App-body" >
        <form onSubmit={addConversion} >
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
                <option value={defaultCurrency} >{defaultCurrency}</option>
                <option value='GBP' >GBP</option>
              </select>
            </div>
          </div>
          <NotificationError messageError={messageError} />
          <div>
              amount in USD: {convertedAmount}
          </div>
          <div>
            <button type='submit' >Save</button>
          </div>
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
        </form>
      </div>
    </div>
  );
}

export default App;
