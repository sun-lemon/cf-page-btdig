const openAuth = true
const username = 'admin'
const password = 'MYproxy520'

function unauthorized() {
  return new Response('Unauthorized', {
    headers: {
      'WWW-Authenticate': 'Basic realm="goindex"',
      'Access-Control-Allow-Origin': '*'
    },
    status: 401
  });
}
 
function parseBasicAuth(auth) {
    try {
      return atob(auth.split(' ').pop()).split(':');
    } catch (e) {
      return [];
    }
}
 
function doBasicAuth(request) {
  const auth = request.headers.get('Authorization');
 
  if (!auth || !/^Basic [A-Za-z0-9._~+/-]+=*$/i.test(auth)) {
    return false;
  }
 
  const [user, pass] = parseBasicAuth(auth);
  return user === username && pass === password;
}


export default {
    async fetch(request, env) {
      if (!doBasicAuth(request)) {
         return unauthorized();
      }
      let url = new URL(request.url);
      if (url.pathname.startsWith('/')) {
        url.hostname="btdig.com";
        let new_request=new Request(url,request);
        return fetch(new_request);
      }
      // Otherwise, serve the static assets.
      return env.ASSETS.fetch(request);
    }
  };
