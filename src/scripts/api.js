import axios from 'axios';

const url = 'https://artifact-simulator-docker.onrender.com/';
//const url = 'http://localhost:13389/';

export async function scanImageApi(formData) {
  // formData: FormDataオブジェクト
  const response = await axios.post(
    url + 'scan-img',
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
      responseType: 'json',
    }
  );
  return response.data;
}

export async function getDistributionApi(requestBody) {
  // requestBody: オブジェクト
  const response = await axios.post(
    url + 'get-dist',
    requestBody,
    { responseType: 'blob' }
  );
  return response.data;
}

export async function getDataApi(requestBody) {
  // requestBody: オブジェクト
  const response = await axios.post(
    url + 'get-data',
    requestBody,
    { responseType: 'json' }
  );
  return response.data;
}