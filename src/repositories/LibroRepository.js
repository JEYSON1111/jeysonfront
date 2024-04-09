import axios from '../axios'
import { server } from '../main'
export default {
    getAreas() {
        return axios.get(server + 'areas').then((response) => response);
    },
    getAllBooks() {
      return axios.get(server + 'getAllBooks').then((response) => response);
    }

};
