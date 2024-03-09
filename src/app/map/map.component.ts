import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { MapService } from './map.service';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { DeckMetrics } from '@deck.gl/core/typed/lib/deck';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements AfterViewInit, OnDestroy {
  @ViewChild('deckGlMap', { static: false }) private mapDiv?: ElementRef<HTMLDivElement>;

  showMetrics: boolean = true;
  loadedTileId: string = '';

  showLoader$ = new Subject<boolean>();
  mapHidden$ = new BehaviorSubject<boolean>(true);

  readonly metrics$: Subject<DeckMetrics> = new Subject<DeckMetrics>();

  private readonly onUnsubscribe$: Subject<boolean> = new Subject<boolean>();

  constructor(private mapService: MapService) {
    this.metrics$.pipe(takeUntil(this.onUnsubscribe$));
    this.mapService.loading$.pipe(takeUntil(this.onUnsubscribe$)).subscribe(tileId => this.showHideLoader(tileId));
    this.showLoader$.pipe(takeUntil(this.onUnsubscribe$)).subscribe();
    this.mapHidden$.pipe(takeUntil(this.onUnsubscribe$)).subscribe();
  }

  ngAfterViewInit() {
    this.mapService.initDeckGlMap(this.mapDiv!, this.metrics$, this.showLoader$, this.mapHidden$);
  }

  ngOnDestroy(): void {
    this.unsubscribeAll();
  }

  private showHideLoader(tileId: string) {
    this.loadedTileId = tileId;
    this.showLoader$.next(true);
    setTimeout(() => this.showLoader$.next(false), 1000);
  }

  private unsubscribeAll() {
    this.onUnsubscribe$.next(true);
    this.onUnsubscribe$.complete();
    this.onUnsubscribe$.unsubscribe();
  }
}
