const API_KEY = 'api_key=2a47f911efa4ace8d89ea0f70eedc8ad'
const BASE_URL = 'https://api.themoviedb.org/3'
const API_URL = BASE_URL +
 '/discover/movie?sort_by=popularity.desc&' + API_KEY
 const IMG_URL = 'https://image.tmdb.org/t/p/w500'

 const searchURL = BASE_URL + '/search/movie?'+ API_KEY;


 const genres = [
  {
    "id": 28,
    "name": "Action"
  },
  {
    "id": 12,
    "name": "Adventure"
  },
  {
    "id": 16,
    "name": "Animation"
  },
  {
    "id": 35,
    "name": "Comedy"
  },
  {
    "id": 80,
    "name": "Crime"
  },
  {
    "id": 99,
    "name": "Documentary"
  },
  {
    "id": 18,
    "name": "Drama"
  },
  {
    "id": 10751,
    "name": "Family"
  },
  {
    "id": 14,
    "name": "Fantasy"
  },
  {
    "id": 36,
    "name": "History"
  },
  {
    "id": 27,
    "name": "Horror"
  },
  {
    "id": 10402,
    "name": "Music"
  },
  {
    "id": 9648,
    "name": "Mystery"
  },
  {
    "id": 10749,
    "name": "Romance"
  },
  {
    "id": 878,
    "name": "Science Fiction"
  },
  {
    "id": 10770,
    "name": "TV Movie"
  },
  {
    "id": 53,
    "name": "Thriller"
  },
  {
    "id": 10752,
    "name": "War"
  },
  {
    "id": 37,
    "name": "Western"
  }
]
 const main = document.getElementById('main');
 const form =  document.getElementById('form');
 const search = document.getElementById('search');
const tagsEL = document.getElementById('tags')


const prevpage = document.getElementById('prev');
const nextpage = document.getElementById('next');

const currentpage = document.getElementById('current')


var currentPage = 1;
var nextPage = 2;
var prevPage = 3;
var lastUrl = '';
var totalPages = 100;

var selectedGenre = []
setGenre()
function setGenre(){
  tagsEL.innerHTML = '';
  genres.forEach(genre => {
    const t = document.createElement('div');
    t.classList.add('tag');
    t.id=genre.id;
    t.innerText = genre.name;
    t.addEventListener('click' , () => {
       if(selectedGenre.length == 0){
         selectedGenre.push(genre.id)
       }else{
         if(selectedGenre.includes(genre.id)){     
           selectedGenre.forEach( ( id , idx) => {
                if(id ==  genre.id){
                 selectedGenre.splice(idx , 1)
                }
           })
         }else{
           selectedGenre.push(genre.id)
         }
       }
       console.log(selectedGenre)
       getmovies(API_URL + '&with_genres='+ encodeURI(selectedGenre.join(',')));
       highlightselection()
      
    
    })
    tagsEL.append(t);
  })

}
function highlightselection(){
    const tags = document.querySelectorAll('.tag')
  tags.forEach(tag => {
    tag.classList.remove("highlight")
  })
  clearBTN()
  if(selectedGenre.length !=0){
  selectedGenre.forEach(id => {
    const  hightlightedTag = document.getElementById(id);
    hightlightedTag.classList.add('highlight')
  })
  }
}
function clearBTN(){
  let clearBTN = document.getElementById('clear');
  if(clearBTN){
clearBTN.classList.add('highlight')
  }else{
    let clear = document.createElement('div')
    clear.classList.add('tag' , 'highlight');
    clear.id = 'clear';
    clear.innerText = 'clear x';
    clear.addEventListener('click' , () => {
      selectedGenre = [];
      setGenre();
      getmovies(API_URL)
    })
    tagsEL.append(clear);
  }
 
}


getmovies(API_URL)


 function getmovies(url){
    lastUrl = url
     
     fetch(url).then(res => res.json()).then(data => {
         console.log(data.results);
         if(data.results.length !== 0){
          var currentpage = data.page;
          var nextpage = currentpage + 1;
          var prevpage = currentpage - 1;
          var totalpages = data.total_pages;


           showMovies(data.results)
         }else{
           main.innerHTML = `<h1  class = "noresult" > NO results found</h1>`
         }


     })
 }


function showMovies(data) {
    main.innerHTML = '';

data.forEach(movie => {
    const {title, poster_path, vote_average, overview, id} = movie;
    const movieEl = document.createElement('div');
    movieEl.classList.add('movie');
    movieEl.innerHTML = `
         <img src="${poster_path? IMG_URL+poster_path: "http://via.placeholder.com/1080x1580" }" alt="${title}">
        <div class="movie-info">
            <h3>${title}</h3>
            <span class="${getcolor(vote_average)}">${vote_average}</span>
        </div>
        <div class="overview">
            <h3>Overview</h3>
            ${overview}
            <br/> 
        
        <button class="know-more" id="${id}">know More </button
        </div>
    
    `


 
        main.appendChild(movieEl);

        document.getElementById(id).addEventListener('click', () => {
          console.log(id)
          openNav(movie)
        })
    })
}



const overlayContent = document.getElementById('overlay-content');
/* Open when someone clicks on the span element */
function openNav(movie) {
  let id = movie.id;
  fetch(BASE_URL + '/movie/'+id+'/videos?'+API_KEY).then(res => res.json()).then(videoData => {
    console.log(videoData);
    if(videoData){
      document.getElementById("myNav").style.width = "100%";
      if(videoData.results.length > 0){
        var embed = [];
        var dots = [];
        videoData.results.forEach((video, idx) => {
          let {name, key, site} = video

          if(site == 'YouTube'){
              
            embed.push(`
            <iframe width="560" height="315" src="https://www.youtube.com/embed/${key}" title="${name}" class="embed hide" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>



            
            `)
            dots.push(`
            <span class="dot">${idx + 1}</span>
          `)
          
          }
          })
          var content = `
          <h1 class="noresult">${movie.original_title}</h1>
          <br/>
          
          ${embed.join('')}
          <br/>
          <div class="dots">${dots.join('')}</div>
          
          `
          overlayContent.innerHTML = content;

          activeSlide = 0;
          showVideos();
            
      }else{
        overlayContent.innerHTML = `<h1  class = "noresult" > NO results found</h1>`
      }
    }
  })
   
}
function closeNav() {
  document.getElementById("myNav").style.width = "0%";
}

 activeSlide = 0;
function showVideos(){
  let embedClasses = document.querySelectorAll('.embed');
  let dots = document.querySelectorAll('.dot');
 
  totalVideos = embedClasses.length; 

  embedClasses.forEach((embedTag, idx) =>  {
      if(activeSlide == idx)  {
        embedTag.classList.add('show')
        embedTag.classList.remove('hide')
      }
      else{
        embedTag.classList.add('hide');
        embedTag.classList.remove('show')
      }
  })

  dots.forEach((dot, indx) => {
    if(activeSlide == indx){
      dot.classList.add('active');
    }else{
      dot.classList.remove('active')
    }
  })

}
  


const leftArrow = document.getElementById('left-arrow')
const rightArrow = document.getElementById('right-arrow')

leftArrow.addEventListener('click', () => {
  if(activeSlide > 0){
    activeSlide--;
  }else{
    activeSlide = totalVideos -1;
  }

  showVideos();
})  

rightArrow.addEventListener('click', () => {
  if(activeSlide < (totalVideos -1)){
    activeSlide++;
  }else{
    activeSlide = 0;
  }
  showVideos();
})

function getcolor(vote){
    if(vote +=  8){
        return 'green'
    }else if(vote += 5){
            return 'orange'
        }else{
            return 'red'
        }
    
}


form.addEventListener('submit' , (e) => {
     e.preventDefault();

     const searchTerm = search.value;
selectedGenre=[];
setGenre( )
     if(searchTerm){
        getmovies(searchURL + '&query=' + searchTerm)
        
     }else {
        getmovies(API_URL);

     }
})

prev.addEventListener('click', () => {
  if(prevPage > 0){
    pagecall(prevPage);
  }
})

next.addEventListener('click', () => {
  if(nextPage <= totalPages){
    pagecall(nextPage);
  }
})

function pagecall(page){
  let urlSplit = lastUrl.split('?');
  let queryParams = urlSplit[1].split('&');
  let key = queryParams[queryParams.length -1].split('=');
  if(key[0] != 'page'){
    let url = lastUrl + '&page='+page
    getmovies(url);
  }else{
    key[1] = page.toString();
    let a = key.join('=');
    queryParams[queryParams.length -1] = a;
    let b = queryParams.join('&');
    let url = urlSplit[0] +'?'+ b
    getmovies(url);
  }
}



