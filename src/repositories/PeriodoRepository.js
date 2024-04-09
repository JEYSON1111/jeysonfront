import axios from '../axios'
import { server } from '../main'
export default class PedidosRepository{
  static async getPeriodos(){
    try {
      const respuesta = await axios.get(server + `periodo`)
      return respuesta
    } catch (error) {
      return error
    }
  }
}
