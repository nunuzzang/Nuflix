const API_KEY = "009d642000456dadcaec132fd28082a8"
const BASE_PATH = "https://api.themoviedb.org/3"

interface IMovie {
    id: number;
    backdrop_path: string;
    poster_path: string;
    title: string;
    overview: string;
}
interface ITv {
    id: number;
    backdrop_path: string;
    poster_path: string;
    name: string;
    overview: string;
}

export interface IGetMoviesResult {
    dates: {
        maximum: string;
        minimum: string;
    }
    page: number;
    results: IMovie[];
    total_pages: number;
    total_results: number;
}
export interface IGetTvsResult {
    page: number;
    results: ITv[];
    total_pages: number;
    total_results: number;
}

export function getMovies() {
    return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
        (response) => response.json()
    );
}
export function getPopular() {
    return fetch(`${BASE_PATH}/movie/popular?api_key=${API_KEY}`).then(
        (response) => response.json()
    );
}
export function getTopRated() {
    return fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}`).then(
        (response) => response.json()
    );
}
export function getUpComing() {
    return fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}`).then(
        (response) => response.json()
    );
}

export function getTVs() {
    return fetch(`${BASE_PATH}/tv/airing_today?api_key=${API_KEY}`).then(
        (response) => response.json()
    );
}