// const fetch=require('node-fetch');
const { response } = require('express');
const fetch = require('node-fetch');
const cheerio=require('cheerio');

const searchURL='https://www.imdb.com/find?s=tt&ttype=ft&ref_=fn_ft&q=';
const movieURL = 'https://www.imdb.com/title/';
                    
const searchMovies=async (movie_name)=>{
    const response=await fetch(`${searchURL}${movie_name}`)
    const body=await response.text();
    const movies= get(body);
    return movies;
}
const get=(body)=>{
        const $ = cheerio.load(body);
        const movies=[];
        $('.findResult').each((i,el)=>{
            const $el=$(el);
            const $image=$el.find('td a img');
            const $title=$el.find('td.result_text a');
            const imdbID = $title.attr('href').match(/title\/(.*)\//)[1];

            const movie={
                image:$image.attr('src'),
                title:$title.text(),
                imdbID
            }
            movies.push(movie);
        });
        return movies;
}

const getMovie=async (imdbID)=>{
    // console.log(imdbID);
    const response=await fetch(`${movieURL}${imdbID}`)
    const body=await response.text();

    const $=cheerio.load(body);
    const $title=$(`.sc-94726ce4-0 .sc-94726ce4-1 h1`);
    const title = $title.first().contents().filter(function() {
     return this.type === 'text';
    }).text().trim();

    

    const info=[];
    const $info=$('.sc-8c396aa2-2 ');
    $info.each((i,el)=>{
        const $el=$(el);
        info.push($el.text());
    });

    const $ImdbRating = $('.sc-7ab21ed2-2 .sc-7ab21ed2-1');
    var ImdbRating=$ImdbRating.text();
    ImdbRating=ImdbRating.substring(0,3);

    const agegroup=info[1];
    const YearRealesed=info[0];
    const $genre=$('.ipc-chip-list .ipc-chip__text');;
    const genre=[];
    $genre.each((i,el)=>{
        const $ele=$(el);
        genre.push($ele.text());
    });

    const $summary=$('.sc-16ede01-6 .sc-16ede01-0 ');
    const summary=$summary.text();

    const $directors=$('.ipc-metadata-list-item__content-container ul li');
    const directors=[];
    $directors.each((i,el)=>{
        const $el=$(el);
        directors.push($el.text());
    });
    return {
        "Title":title,
        "year_realesed":YearRealesed,
        "age_group":agegroup,
        "imdb_rating":ImdbRating,
        "genre":genre,
        "summary":summary,
        "directors":directors
    }
}
getMovie('tt0371746');
module.exports={
    searchMovies,
    getMovie,

}