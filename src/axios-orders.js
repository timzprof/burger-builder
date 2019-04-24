import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-burger-builder-92469.firebaseio.com/'
});

export default instance;