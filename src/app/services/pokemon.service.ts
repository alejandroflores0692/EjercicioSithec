import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  public baseURL = 'https://pokeapi.co/api/v2';
  public pokemonInfo = [];

  constructor(
    private http: HttpClient
  ) { 
  }

  getPokemonList(){
    return this.http.get<any>(this.baseURL+'/pokemon');
  }

  getAllPokemons(limit) {
    return this.http.get<any>(this.baseURL+'/pokemon?limit='+limit)
  }

  getPokemonDetail(url) {
    return this.http.get<any>(url)
  }

  setPokemonInfo(data) {
      this.pokemonInfo = data;
  }

  getPokemonInfo() {
      return this.pokemonInfo;
  }

}
