import fetch from 'isomorphic-fetch'
var uuid = require('uuid4') //  unique indexes for concurrency
import {reset} from 'redux-form'  //  Action to reset controlled forms

//  Sample summary query:
//  http://138.68.249.21/v1/summary?url=http://ogp.me/
const api = {
  protocol: 'http://',
  // DigitalOcean server I've dedicated to  this assignment, not setting domain.
  host: '138.68.21.112',
  version: 'v1',
  endpoint: {
    summary: 'summary',
    codebreaker: 'codebreaker'
  }
}

export const addMessage = (data) => {
  return {
    type: 'ADD_MESSAGE',
    id: uuid(),
    data
  }
}
export const addOG = (data, source) => {
  return {
    type: 'ADD_OG',
    id: uuid(),
    data,
    source
  }
}

export const openModal = (data) => {  //  THUNK
  return {
    type: 'OPEN_MODAL',
    data
  }
}
export const closeModal = (data) => {  //  THUNK
  return {
    type: 'CLOSE_MODAL',
    data
  }
}

export const decodeCaesar = (data) => {  //  THUNK
  return function (dispatch) {
    //  TODO: Dispatch a log for this event loading like dispatch(addLinkAction(data))
    let submission = data.composer
    //  Normal Text Submission
    if (!submission.startsWith('http')) {
      dispatch(addMessage(submission))
    } else {
    //  Link submission (eval props via OG API)
      let target = `${api.protocol}${api.host}/${api.version}/${api.endpoint.summary}`
      let query = `?caesar=${submission}`
      let request = target + query

      console.log('GET:', request)
      fetch(request, {
        method: 'get'
      }).then(response => {
        return response.json()
      }).then(data => {
        dispatch(addOG(data, submission))
      }).catch(err => {
        dispatch(openModal(err))
        console.error(err)
      })
    }
    dispatch(reset('composer')) //  Form reset
    // what you return here gets returned by the dispatch function that used this action creator
    return null
  }
}
