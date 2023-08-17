import './App.css';
import currencyService from './services/currencies'

import { useState, useEffect } from 'react';

function App() {

  const defaultCurrency = 'EUR'

  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState(defaultCurrency)
  const [conversionObject, setConversionObject] = useState({})
  const [convertedAmount, setConvertedAmount] = useState(0)
  const [conversionHistory, setConversionHistory] = useState([])

  useEffect(() => {
    if (amount !== ''){
      currencyService
        .convert(currency, amount)
        .then(function (object) {
          setConversionObject(object)
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

    const newConversion = {
      amount: amount,
      currency: currency,
      convertedAmount: convertedAmount
    }

    setConversionHistory([...conversionHistory, newConversion])

    setAmount('')
    setCurrency(defaultCurrency)
    setConversionObject({})
    setConvertedAmount(0)
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
            <div>
              amount <input
                  type="text"
                  inputMode="numeric"
                  value={amount}
                  onChange={handleAmountChange}
              />
            </div>
            <div>
              <select
                id="currencies"
                name="currencies"
                defaultValue={defaultCurrency}
                onChange={handleCurrencyChange}
              >
                <option value={defaultCurrency} >{defaultCurrency}</option>
                <option value='GBP' >GBP</option>
              </select>
            </div>
          </div>
          <div>
              amount in USD: {convertedAmount}
          </div>
          <div>
            <button type='submit' >Save</button>
          </div>
          <table className="App-table-history" >
            <thead>
              <tr>
                <th>Amount</th>
                <th>Currency</th>
                <th>Amount in USD</th>
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
