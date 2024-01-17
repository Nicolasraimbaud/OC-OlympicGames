import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Chart } from 'chart.js';
import { Observable, Subscription } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss']
})
export class CountryComponent implements OnInit, OnDestroy {
  
  countryId!: number;

  olympics$!: Observable<Array<Olympic>>;
  pieChart!: any;
  mLabels: Array<number> = [];
  mMedals: Array<number> = [];
  mNumberOfGames: number = 0;
  subscription!: Subscription;
  data!: Subscription;
  totalMedals: number = 0;
  totalAthletes: number = 0;

  constructor(
    private olympicService: OlympicService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.countryId = +this.route.snapshot.params['id'];
    console.log(this.countryId);
    this.olympics$ = this.olympicService.getOlympics();
    this.subscription = this.olympics$.subscribe((value) =>
      this.modifyChartData(value)
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  createChart(): void {
    this.pieChart = new Chart('MyChart', {
      type: 'line',
      data: {
        labels: this.mLabels,
        datasets: [
          {
            data: this.mMedals,
            borderColor: '#007bff',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          }
        }
      },
    });
  }

  modifyChartData(olympics: Array<Olympic>): void {
    if (olympics) {
      const olympic = olympics[this.countryId].participations;
      for (let entry of olympic) {
        this.mLabels.push(entry.year);
        this.mMedals.push(entry.medalsCount);
        this.totalMedals += entry.medalsCount;
        this.totalAthletes += entry.athleteCount;
      }
      this.createChart();
    }
  }
}
