import axios from "axios";

const baseUrl = 'https://api.getgeoapi.com/v2/currency/convert?api_key=7f0c4c50779df32ed52f8d658bd6cd38a8ce671c'

const convert = async (from) => {
  try {
    const response = await axios.get(`${baseUrl}&from=${from}&to=USD&format=json`)
    console.log(response.data)
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export default { convert }