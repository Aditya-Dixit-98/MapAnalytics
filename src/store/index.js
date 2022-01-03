import { createStore } from 'vuex'
import axios from 'axios'
import _ from 'underscore';
export default createStore({
  state: {
    coordinates:null,
    male:null,
    female:null,
    users:null,
    proUsers:null,
    proUsersbyAreaCode:null,
    userAreabyDensity: null,
    coordinateDensity:null
  },
  mutations: {
    getCoordinates(state,payload){
      state.coordinates = payload
    },
    getUsers(state,payload){
      state.users = payload
    },
    userMFratio(state){
      console.log(state.users)
      state.male = state.users.users
      state.female = state.users.users
      state.male= state.male.filter(function(item){
        return item.gender == 'M'
      })
      state.female= state.female.filter(function(item){
        return item.gender == 'F'
      })
      console.log("Number of Men",state.male.length)
      console.log("Number of Female",state.female.length)
      console.log(state.male.length,"/",state.female.length)
    },
    userbyAreaCode(state){
      console.log(_.countBy(state.users.users,'area_id'))
      //var uniqueAreaCodes = new Set(state.users.users.area_id)
      //console.log(uniqueAreaCodes)
    },
    prouserbyAreaCode(state){
        state.proUsers = _.filter(state.users.users, function(user){
            return user.is_pro_user == true
        })
        console.log(state.proUsers)
        state.proUserByAreaCode = _.countBy(state.proUsers,'area_id')
        console.log(state.proUserByAreaCode)
    },
    userAreabyDensity(state){
      state.coordinates.features.forEach(coordinates => {
              let area = coordinates.properties.area_id
              coordinates.properties.density = state.proUserByAreaCode[area]
      })
      state.coordinateDensity = state.coordinates
      console.log(state.coordinateDensity)
    }
  },
  actions: {
    getCoordinates(context){
      let coordinates = null
      async function Coordinates(){
        await axios
        .get('https://kyupid-api.vercel.app/api/areas')
        .then((response) => {
          coordinates = response.data
          context.commit("getCoordinates",coordinates)
        })
     }
     Coordinates()
    },
    getUsers(context){
      let users = null
      async function Users(){
        await axios
        .get('https://kyupid-api.vercel.app/api/users')
        .then((response) => {
          users = response.data
          context.commit("getUsers",users)
          context.commit("userMFratio")
          context.commit("userbyAreaCode")
          context.commit("prouserbyAreaCode")
          context.commit("userAreabyDensity")
        })
     }
     Users()
    },
  },
  modules: {
  }
})
