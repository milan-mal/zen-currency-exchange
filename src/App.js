import './App.css';
import currencyService from './services/currencies'

import { useState, useEffect } from 'react';

function App() {

  const defaultCurrency = 'EUR'
  var convertedAmount = 0

  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState(defaultCurrency)
  const [conversionObject, setConversionObject] = useState({})
  // const [convertedAmount, setConvertedAmount] = useState(0);

  useEffect(() => {
    if (amount !== ''){
      setTimeout(() => {
        currencyService
          .convert(currency, amount)
          .then(function(object){
            setConversionObject(object)
          // .then(function (object) {
          //   setConversionObject(object);
          //   const rateForAmount = object.rates && object.rates[currency] ? object.rates[currency].rate_for_amount : 0;
          //   setConvertedAmount(rateForAmount);
          })
          // .catch((error) => {
          //   console.log(error)
          //   setConvertedAmount(0)
          // })
      }, 2000)
    }
  }, [currency, amount])
    
  console.log('amount', amount)
  console.log('currency', currency)
  console.log('conversionObject', conversionObject)

  try{
    convertedAmount = conversionObject.rates ? conversionObject.rates[`${currency}`].rate_for_amount : 0
  } catch (error) {
    console.log(error)
  }  

  const handleAmountChange = (event) => {
    const inputAmount = event.target.value
    if( /^\d*\.?\d*$/.test(inputAmount) ){
      setAmount(inputAmount)
    }
  }

  const handleCurrencyChange = (event) => {
    setCurrency(event.target.value)
  }

  const addExchange = () => {

  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>
          Currency exchange
        </h1>
      </header>
      <div className="App-body">
        <form onSubmit={addExchange} >
          <div className="App-form-amount">
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
              selected values: {amount} {currency}
          </div>
          <div>
              amount in USD: {convertedAmount}
          </div>
          <div>
            <button type='submit' >Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
