import axios from '../axios'
import { server } from '../main'
export default {
  getUsuariosXRolxInstitucion(rol,institucion) {
    return axios.get(server + 'getUsuarios/'+rol+'/'+institucion).then((response) => response);
  }
};
