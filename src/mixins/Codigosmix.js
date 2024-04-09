
import Vue from 'vue'
import axios from 'axios'
export default {
  data(){
      return{
      myVariable:10,
      }
  },
  methods: {
    //historico hospital
    limpiarCache(){
      let me = this;
      this.$http.get(this.$server_url+'limpiarCache')
        .then(res => {
        })
        .catch(function(e){
          console.log(e)
        })
    },
  },
};
