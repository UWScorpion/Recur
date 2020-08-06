import Auth from 'src/utils/API/authAPI'
import axios from 'axios'

var _user = null;

async function getToken() {
  if (_user === null) {
    _user = await Auth.currentUserPoolUser();
  }
  return await Auth.userSession(_user);
}

const makeOptions = async(endpoint, data) => {
  let token = await getToken();
  token = await token.accessToken.jwtToken;
  return {
    method: 'post',
    headers: {
      'content-type': 'application/json',
      'x-token': token,
      'x-client-id': '74393160-52cd-11ea-9581-8188ca5a56d3',
    },
    data,
    url: 'https://api.buildschool.io' + endpoint,
  };
}

export async function mutateQuery(query) {
  try {
    const options = await makeOptions('/graph/post', { "query": 'query mutate { ' + query + ' }'});
    return await axios(options);
  }
  catch (error) {
    console.error("error => ", error);
  }
}

export async function readQuery(query) {
  try {
    const options = await makeOptions('/graph/get', { "query": 'query execute { ' + query + ' }'});
    return await axios(options);
  }
  catch (error) {
    console.error("error => ", error);
  }
}

export async function uploadPhotoQuery(files) {
  try {
    let token = await getToken();
    token = await token.accessToken.jwtToken;
    var data = new FormData();
    for (var ii = 0; ii < files.length; ii++) {
      data.append('file', files[ii]);
    }
    return await axios({
      method: 'post',
      headers: {
        'content-type': 'multipart/form-data',
        'x-token': token,
        'x-client-id': '74393160-52cd-11ea-9581-8188ca5a56d3',
      },
      data,
      url: 'https://api.buildschool.io/upload/photo',
    });
  }
  catch (error) {
    console.error("error => ", error);
  }
}

export async function uploadQuery(files) {
  try {
    let token = await getToken();
    token = await token.accessToken.jwtToken;
    var data = new FormData();
    for (var ii = 0; ii < files.length; ii++) {
      data.append('file', files[ii]);
    }
    return await axios({
      method: 'post',
      headers: {
        'content-type': 'multipart/form-data',
        'x-token': token,
        'x-client-id': '74393160-52cd-11ea-9581-8188ca5a56d3',
      },
      data,
      url: 'https://api.buildschool.io/upload/file',
    });
  }
  catch (error) {
    console.error("error => ", error);
  }
}

export async function loggedoutQuery(endpoint, data) {
  try {
    return await axios({
      method: 'post',
      headers: {
        'content-type': 'application/json',
        'x-client-id': '74393160-52cd-11ea-9581-8188ca5a56d3',
      },
      data,
      url: 'https://api.buildschool.io' + endpoint,
    });
  }
  catch (error) {
    console.error("error => ", error);
  }
}


export async function customQuery(endpoint, data) {
  try {
    let token = await getToken();
    token = await token.accessToken.jwtToken;
    return await axios({
      method: 'post',
      headers: {
        'content-type': 'application/json',
        'x-token': token,
        'x-client-id': '74393160-52cd-11ea-9581-8188ca5a56d3',
      },
      data,
      url: 'https://api.buildschool.io' + endpoint,
    });
  }
  catch (error) {
    console.error("error => ", error);
  }
}

export function escapeData(data) {
  return encodeURI(JSON.stringify(data));
}
