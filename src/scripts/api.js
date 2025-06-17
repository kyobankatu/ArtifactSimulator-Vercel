import axios from 'axios';

export async function scanImageApi(formData) {
  // formData: FormDataオブジェクト
  const response = await axios.post(
    'https://artifact-simulator-docker.onrender.com/scan-img',
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
    'https://artifact-simulator-docker.onrender.com/get-dist',
    requestBody,
    { responseType: 'blob' }
  );
  return response.data;
}

export async function getDataApi(requestBody) {
  // requestBody: オブジェクト
  const response = await axios.post(
    'https://artifact-simulator-docker.onrender.com/get-data',
    requestBody,
    { responseType: 'json' }
  );
  return response.data;
}