

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Respond with hello worker text
 * @param {Request} request
 */

async function handleRequest(request) {
   
  const COOKIE_NAME = 'myurl'

    const cookie = getCookie(request, COOKIE_NAME)              //retrieving cookie info 
    if (cookie) {                                               //If cookie exists, update myvariant with cookie value
      myvariant = cookie

    } else {                                                    // if cookie does not exist, fetch the array from given url and randomly choose a variant
        myvariant = await fetch('https://cfw-takehome.developers.workers.dev/api/variants')
        .then((response) => {
          return response.json();
        })
        .then((data) => {
  

        var link = data.variants[Math.round(Math.random())]
        return link;
        })
    }
    
url_API = await fetch(myvariant).then(response => {             //using myvariant to fetch html document 
  return response.text();
})
.then(data => {
  var myresponse = data
  return myresponse;
})
class ElementHandler {                                         //updating HTML doc with personalized content/attributes
  
  element(element) {
    
    if (element.tagName == 'title') {
    element.setInnerContent('Parsa@Cloudflare!')
    }
    else if (element.tagName == 'p') {
      element.setInnerContent("Thank you for looking at my project! \n feel free to take a look at my LinkedIn and Github accounts while you're here :) ")
      }
    else if (element.tagName == 'a') {
      element.setInnerContent('LinkedIn/GitHub')
      element.setAttribute('href', 'https://www.linkedin.com/in/parsa-emami-500797177/')
    }
  }
}

  return new HTMLRewriter().on('*', new ElementHandler()).transform(new Response(url_API, {
    headers: { 'content-type': 'HTML', 
  'Set-Cookie': ['myurl=' + myvariant ] }                   //setting cookie for persisting variant
  })) 

}

function getCookie(request, name) {                         //fuction for retrieving cookie value from given name or "key"
  let result = null
  let cookieString = request.headers.get('Cookie')
  if (cookieString) {
    let cookies = cookieString.split(';')
    cookies.forEach(cookie => {
      let cookieName = cookie.split('=')[0].trim()
      if (cookieName === name) {
        let cookieVal = cookie.split('=')[1]
        result = cookieVal
      }
    })
  }
  return result
}