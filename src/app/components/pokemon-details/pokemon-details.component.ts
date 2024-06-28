import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbProgressbarConfig } from '@ng-bootstrap/ng-bootstrap';
import {MediaMatcher} from '@angular/cdk/layout';

@Component({
  selector: 'pokemon-details',
  templateUrl: './pokemon-details.component.html',
  styleUrl: './pokemon-details.component.css'
})
export class PokemonDetailsComponent implements OnInit  {

  pokemonInfo;
  mobileQuery: MediaQueryList;
  private queryListener: () => void;

  constructor(
    private pokeService: PokemonService,
    private router: Router,
    private modalService: NgbModal,
    config: NgbProgressbarConfig,
    changeDetector: ChangeDetectorRef, media: MediaMatcher
  ) {
    this.pokemonInfo = this.pokeService.getPokemonInfo();
    console.log(this.pokemonInfo);
    config.max = 255;
		config.type = 'success';
		config.height = '12px';
    this.mobileQuery = media.matchMedia("(max-width: 600px)");
    console.log("mobile: ", this.mobileQuery.matches);
    this.queryListener = () => changeDetector.detectChanges();
    this.mobileQuery.addEventListener('change', this.queryListener);
  }

  ngOnInit(): void {    
  }

  back() {
    this.pokeService.setPokemonInfo(null);
    this.router.navigate(["/pokemon-list"]);    
  }

  stats(contentModal) {
  this.modalService.open(contentModal, { backdrop: 'static' });
}

}
