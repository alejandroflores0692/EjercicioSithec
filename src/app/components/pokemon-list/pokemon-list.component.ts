import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { switchMap } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import {MediaMatcher} from '@angular/cdk/layout';

@Component({
  selector: 'pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrl: './pokemon-list.component.css'
})
export class PokemonListComponent implements OnInit {
  
  mobileQuery: MediaQueryList;
  private queryListener: () => void;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  displayedColumns: string[] = ['name'];
  dataSource: MatTableDataSource<Object>;
  limit;
  abilities = '';
  types = '';
  list = [];
  data = [];

  constructor(
    private pokeService: PokemonService,
    private router: Router,
    changeDetector: ChangeDetectorRef, media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia("(max-width: 600px)");
    console.log("mobile: ", this.mobileQuery.matches);
    this.queryListener = () => changeDetector.detectChanges();
    this.mobileQuery.addEventListener('change', this.queryListener);
  }

  ngOnInit(): void {
    this.pokemonList();
  }
  
  pokemonList() {
    this.pokeService.getPokemonList().pipe(
      switchMap(res => {
        this.limit = res.count;
        return this.pokeService.getAllPokemons(this.limit)
      })
    )
    .subscribe(
      res => {
        this.list = res.results;
        this.dataSource = new MatTableDataSource();
            setTimeout(() => {
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                this.dataSource.data = this.list;
            }, 50);
      }
    );            
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  detail(p) {
    this.pokeService.getPokemonDetail(p.url).subscribe(
      res => {
        for(let i = 0; i < res.abilities.length; i++) {
          this.abilities += res.abilities[i].ability.name+', ';
        }
        this.abilities = this.abilities.slice(0, this.abilities.length - 2);
        for(let i = 0; i < res.types.length; i++) {
          this.types += res.types[i].type.name+', ';
        }
        this.types = this.types.slice(0, this.types.length - 2);
        let data: pokemonData = {
          id: res.id,
          name: res.name,
          image: res.sprites.other.home.front_default,
          gif: res.sprites.other.showdown.front_default,
          exp: res.base_experience,
          abilities: this.abilities,
          type: this.types,
          stats: {
            hp: res.stats[0].base_stat,
            attack: res.stats[1].base_stat,
            defense: res.stats[2].base_stat,
            specialAttack: res.stats[3].base_stat,
            specialDefense: res.stats[4].base_stat,
            speed: res.stats[5].base_stat
          },
          height: res.height,
          weight: res.weight

        }
        this.pokeService.setPokemonInfo(data);
        this.router.navigate(["/pokemon-details"]);
      }
    )
  }

  }


interface pokemonData {
  id: number;
  name:  string;
  image: string;
  gif: string;
  exp: number;
  abilities: string;
  type: string;
  stats: {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  },
  height: number;
  weight: number;
}