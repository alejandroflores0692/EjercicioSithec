import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { Router } from '@angular/router';

@Component({
  selector: 'pokemon-details',
  templateUrl: './pokemon-details.component.html',
  styleUrl: './pokemon-details.component.css'
})
export class PokemonDetailsComponent implements OnInit  {

  pokemonInfo;

  constructor(
    private pokeService: PokemonService,
    private router: Router
  ) {
    this.pokemonInfo = this.pokeService.getPokemonInfo();
    console.log(this.pokemonInfo);
  }

  ngOnInit(): void {
    
  }

  back() {
    this.pokeService.setPokemonInfo(null);
    this.router.navigate(["/pokemon-list"]);    
  }

}
