

import * as actionType from  './actionTypes'
import setAuthToken from '../../utils/setAuthToken'
import jwt_decode from 'jwt-decode'
import axios from 'axios'

export const registerUser = (userData, history) => dispatch =>{
  console.log(userData)
  // axios.post('/api/users/register', userData)
  axios.post('https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyAmIU3_uLR4hidzV7Eztlba9EBFK8OKiVo', userData)
    .then(res => {
      let data = {}
      if(res.status === 200){
        data = {
          type: 'success',
          sucMesg: 'You have successfully registered!'

        }
      }
      dispatch(authSuccess(history, data))
    })
    .catch(err=> {
      let data = {}
      if(err.response.status === 400){
        let msg = err.response.data.error.message.split('_').join(' ').toLowerCase()
        data = {
          type: 'danger',
          dangMesg: msg.charAt(0).toUpperCase() + msg.slice(1)
        }
      }
      console.log(data)
      // dispatch({
      //   type: actionType.AUTH_ERROR,
      //   payload: data
      // })
    })
  }
  
export const authSuccess = (history, data) => {
  history.push('/login')
  return {
    type: actionType.AUTH_REGISTER_SUCCESS,
    payload: {
      mesg: data.mesg,
      type: data.type
    }
  }
}

export const onloading = () => {
  return {
    type: actionType.LOADING
  }
}

export const loginUser = (userData, history) => dispatch => {
  axios.post('/api/users/login', userData)
    .then(res => {
      // set response data to a token
      const {token} = res.data;
      // save token to localstorage
      localStorage.setItem('jwtToken', token)
      // set token in the request header
      setAuthToken(token)
      // decode the token to extract user id
      const decode = jwt_decode(token)
      // dispatch to create save the token in the state
      dispatch(setCurrentUser(decode))
    })
    .catch(err => {
      dispatch({
        type: actionType.AUTH_ERROR,
        payload: err.response.data
      })
    })
  return {
    type: actionType.LOADING
  }
}

export const setCurrentUser = (decoded)=> {
  return {
    type: actionType.AUTH_SET_CURRENT_USER,
    payload: decoded
  }
}



export const logoutUser = () => {
  localStorage.removeItem('jwtToken')
  return {
    type: actionType.AUTH_USER_LOGOUT
  }
}