import React, { useState, useEffect } from "react";
import axios from "axios";

export default function App() {
  const [countries, setCountries] = useState([]);
  const [error, setError] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("https://restcountries.com/v3.1/all");
        setCountries(response.data);
      } catch (error) {
        setError("Ошибка при запросе данных ;(");
        console.error(error);
      }
    }

    fetchData();
  }, []);

  const openModal = (country) => {
    setSelectedCountry(country);
  };

  const closeModal = () => {
    setSelectedCountry(null);
  };

  return (
    <div className="main">
      <div
        className={`modal_background ${selectedCountry ? "active" : ""}`}
        onClick={closeModal}
      ></div>
      <div className="container">
        <div className="main_wrapper">
          <h1>Страны мира 🗺</h1>
          <div className="countries">
            {error ? (
              <div className="error">{error}</div>
            ) : (
              <div className="countries_flex">
                {countries.map((country) => (
                  <Country
                    key={country.cca3}
                    country={country}
                    openModal={openModal}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {selectedCountry && (
        <Modal country={selectedCountry} closeModal={closeModal} />
      )}
    </div>
  );
}

function Country({ country, openModal }) {
  return (
    <div className="country_card" onClick={() => openModal(country)}>
      <img
        src={country.flags.svg}
        alt={country.name.common}
        className="country_flag"
      />
      <h2 className="country_name">{country.name.common}</h2>
    </div>
  );
}

function Modal({ country, closeModal }) {
  const currencies = country.currencies
    ? Object.values(country.currencies)
        .map((currency) => `${currency.name} (${currency.symbol})`)
        .join(", ")
    : "Нет данных";

  return (
    <div className="modal" onClick={(e) => e.stopPropagation()}>
      <div className="modal_content">
        <button className="close_button" onClick={closeModal}>
          ×
        </button>
        <h2>{country.name.common}</h2>
        <img
          src={country.flags.svg}
          alt={country.name.common}
          className="modal_flag"
        />
        <p>
          <strong>Столица:</strong>
          {country.capital ? country.capital[0] : "Нет данных"}
        </p>
        <p>
          <strong>Регион:</strong> {country.region}
        </p>
        <p>
          <strong>Население:</strong> {country.population.toLocaleString()}
        </p>
        <p>
          <strong>Валюта:</strong> {currencies}
        </p>
      </div>
    </div>
  );
}
