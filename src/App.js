import './App.css';

import { useState } from 'react';

function App() {

  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('')


  const handleAmountChange = (event) => {
    setAmount(event.target.value)
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
              amount: <input
                  type="text"
                  inputmode="numeric"
                  value={amount}
                  onChange={handleAmountChange}
              />
            </div>
            <div>
              <select id="currencies">
                <option value="EUR">EUR</option>
                <option value="CZK">CZK</option>
              </select>
            </div>
          </div>
          <div>
              amount in USD: {currency}
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
