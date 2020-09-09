const autoCompleteConfig = {
		renderOption(movie) {
		const imgSrc = movie.Poster === 'N/A' ? 'https://movies.alldbx.com/images/default_movie.1d043.png' : movie.Poster;
		return `
			<img src="${imgSrc}" />
			${movie.Title} (${movie.Year})
			`;
		},
		inputValue(movie) {
			return movie.Title;
		},
		async fetchData(searchTerm) {
			const response = await axios('https://www.omdbapi.com', {
				params: {
					apikey: 'thewdb',
					s: searchTerm
				}
			});//axios close
			if(response.data.Error)
			return [];
			
			return response.data.Search;
		}// fetch data close
}


createAutoComplete({
	...autoCompleteConfig,	
	root: document.querySelector('.left-autocomplete'),
	onOptionSelect(movie) {
		document.querySelector('.tutorial').classList.add('is-hidden');
		onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
	},
});
createAutoComplete({
	...autoCompleteConfig,	
	root: document.querySelector('.right-autocomplete'),
	onOptionSelect(movie) {
		document.querySelector('.tutorial').classList.add('is-hidden');
		onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
	},
});
let leftSide, rightSide;
const onMovieSelect = async (movie, summaryElement, side) => {
  const response = await axios.get('https://www.omdbapi.com/', {
    params: {
      i: movie.imdbID,
      apikey: 'thewdb'
    }
  });

	summaryElement.innerHTML = movieTemplate(response.data);
	
	if(side==='left')
		leftSide = response.data;
	else
		rightSide = response.data;
	
	if(leftSide && rightSide)
		runComparison();	
};


const runComparison = () => {
	const leftSideStats = document.querySelectorAll('#left-summary .notification')
	const rightSideStats = document.querySelectorAll('#right-summary .notification')
	
	leftSideStats.forEach((leftStat, index)=>{
		const rightStat = rightSideStats[index];
		
		const leftSideValue = parseInt(leftStat.dataset.value);
		const rightSideValue = parseInt(rightStat.dataset.value);
		if(rightSideValue > leftSideValue || isNaN(leftSideValue)) {
			leftStat.classList.toggle('is-primary');
			leftStat.classList.toggle('is-warning');
		} else{
			rightStat.classList.toggle('is-primary');
			rightStat.classList.toggle('is-warning');
		}
	});
}
const movieTemplate = movieDetail => {
	if(movieDetail.Poster === 'N/A')
			movieDetail.Poster='https://movies.alldbx.com/images/default_movie.1d043.png';
	const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));
  	const metascore = parseInt(movieDetail.Metascore);
  	const imdbRating = parseFloat(movieDetail.imdbRating);
  	const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''));
  	const awards = movieDetail.Awards.split(' ').reduce((prev, word) => {
		const value = parseInt(word);
		if (isNaN(value)) {
		  return prev;
		} else {
		  return prev + value;
		}
  	}, 0);

	
	
	
  return `<br/>
    <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="${movieDetail.Poster}" />
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <h1>${movieDetail.Title}</h1>
          <h4>${movieDetail.Genre}</h4>
          <p>${movieDetail.Plot}</p>
        </div>
      </div>
    </article>
    <article data-value=${awards} class="notification is-primary">
      <p class="title">${movieDetail.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article data-value=${dollars} class="notification is-primary">
      <p class="title">${movieDetail.BoxOffice}</p>
      <p class="subtitle">Box Office</p>
    </article>
    <article data-value=${metascore} class="notification is-primary">
      <p class="title">${movieDetail.Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>
    <article data-value=${imdbRating} class="notification is-primary">
      <p class="title">${movieDetail.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>
    <article data-value=${imdbVotes} class="notification is-primary">
      <p class="title">${movieDetail.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>
  `;
};

