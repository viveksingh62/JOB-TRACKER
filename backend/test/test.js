import FormData from 'form-data';
import fetch from 'node-fetch';
import fs from 'fs';

const form = new FormData();
form.append('resume', fs.createReadStream('./test.pdf'));
form.append('jobTitle', 'Frontend Developer');
form.append('company', 'Google');
form.append('jobDescription', 'Looking for a React and Node.js developer with MongoDB experience');

const res = await fetch('http://localhost:8080/api/analyze', {
  method: 'POST',
  body: form,
  headers: form.getHeaders()
});

const data = await res.json();
console.log(JSON.stringify(data, null, 2));