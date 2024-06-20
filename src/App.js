import React from "react";
import { Block } from "./Block";
import "./index.scss";

function App() {
  const [fromCurrency, setFromCurrency] = React.useState("USD");
  const [toCurrency, setToCurrency] = React.useState("UAH");
  const [fromPrice, setFromPrice] = React.useState(1);
  const [toPrice, setToPrice] = React.useState(0);

  // const [rates, setRates] = React.useState({});
  const ratesRef = React.useRef({});

  React.useEffect(() => {
    fetch("https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json")
      .then((res) => res.json())
      .then((json) => {
        const exchangeRates = {};
        json.forEach((rate) => {
          exchangeRates[rate.cc] = rate.rate;
        });
        exchangeRates.UAH = 1;
        ratesRef.current = exchangeRates;
        // console.log(ratesRef.current);
        onChangeFromPrice(1);
      })
      .catch((err) => {
        console.warn(err);
        alert("An error occurred whilse receiving information from the API.");
      });
  }, []);

  const onChangeFromPrice = (value) => {
    const price = value / ratesRef.current[toCurrency];
    const result = price * ratesRef.current[fromCurrency];
    // console.log(ratesRef.current[fromCurrency]);
    setToPrice(result.toFixed(3));
    setFromPrice(value);
  };

  const onChangeToPrice = (value) => {
    const result =
      (ratesRef.current[toCurrency] / ratesRef.current[fromCurrency]) * value;
    setFromPrice(result.toFixed(3));
    setToPrice(value);
  };

  React.useEffect(() => {
    onChangeToPrice(toPrice);
  }, [fromCurrency]);

  React.useEffect(() => {
    onChangeFromPrice(fromPrice);
  }, [toCurrency]);

  return (
    <div className="App">
      <Block
        value={fromPrice}
        currency={fromCurrency}
        onChangeCurrency={setFromCurrency}
        onChangeValue={onChangeFromPrice}
      />
      <Block
        value={toPrice}
        currency={toCurrency}
        onChangeCurrency={setToCurrency}
        onChangeValue={onChangeToPrice}
      />
    </div>
  );
}

export default App;
