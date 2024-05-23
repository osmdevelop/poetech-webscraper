import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as cheerio from 'cheerio'; // Assuming you've installed cheerio

const App = () => {
  const [propertyData, setPropertyData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const scrapeAndParsePropertyData = async () => {
    setIsLoading(true);
    setError(null); // Clear any previous errors

    const url = "https://travis.prodigycad.com/property-detail/100094/2024"; // Replace with your actual URL
    const apiKey = process.env.REACT_APP_OXYLABS_API_KEY; // Assuming API key stored in environment variable

    try {
      const response = await axios.get(`https://realtime.oxylabs.io/v1/queries`, {
        params: {
          url: url,
          api_key: apiKey
        }
      });
      const $ = cheerio.load(response.data); // Parse HTML content
      
      const propertyId = $('.sc-bGbJRg.hGNnst').first().text().trim();
      const geographicId = $('.sc-bGbJRg.hGNnst:nth-child(2)').text().trim();
      const type = $('.sc-bGbJRg.hGNnst:nth-child(3)').text().trim();
      
      setPropertyData({
        'Property ID': propertyId,
        'Geographic ID': geographicId,
        'Type': type
      });
    } catch (error) {
      console.error('Failed to scrape and parse data:', error);
      setError('An error occurred while fetching data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Optionally, call scrapeAndParsePropertyData on component mount
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Property Data Scraper</h1>
        <p>your api key is {process.env.REACT_APP_OXYLABS_API_KEY}</p>
        <button onClick={scrapeAndParsePropertyData} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Fetch Property Data'}
        </button>
        {error && <p className="error-message">{error}</p>}
        <pre>{propertyData ? JSON.stringify(propertyData, null, 2) : 'No data fetched yet.'}</pre>
      </header>
    </div>
  );
}

export default App;
