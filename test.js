import axios from 'axios';

const options = {
  method: 'GET',
  url: 'https://aladhan.p.rapidapi.com/calendarByCity',
  params: {
    city: 'Denver',
    month: '9',
    year: '2023',
    country: 'United States of America'
  },
  headers: {
    'X-RapidAPI-Key': '50775ca5cdmsh3b2765959115949p14016cjsn82978657fa8f',
    'X-RapidAPI-Host': 'aladhan.p.rapidapi.com'
  }
};

try {
	const response = await axios.request(options);
	console.log(response.data);
} catch (error) {
	console.error(error);
}