console.log("sw");

const STATIC_CACHE = "1.5";

let urlsToCache = [
    '/',
    'index.html',
    'resources/main.css',
    'resources/scripts/script.js',
    'resources/images/',
    '/offline.html'
];

self.addEventListener('install',(event)=> {
    event.waitUntil(
        caches.open(STATIC_CACHE)
        .then((cache)=>{
            console.log("Cache opened");
            return cache.addAll(urlsToCache);
        })
    )
})


self.addEventListener('fetch',(event) =>{
    event.respondWith(
        caches.match(event.request)
        .then((response)=>{
            if(response){
                return response;
            }
            else{
                return fetch(event.request)
                .then((response)=>{
                    return response;
                })
            }
        })
        .catch((err)=>{
            return caches.open(STATIC_CACHE)
            .then(function(cache){
                return cache.match('/offline.html');
            })
        })
    )
})


self.addEventListener('fetch',function(e){
    let request = e.request;
    e.respondWith(
        fetch(request)
        .then(function(res){
            return caches.open(DYNAMIC_CACHE)
            .then(function(cache){
                cache.put(request.url,res.clone());
                return res;
            })
        })
        .catch(function(err){
            return caches.match(request);
        })
    )
})