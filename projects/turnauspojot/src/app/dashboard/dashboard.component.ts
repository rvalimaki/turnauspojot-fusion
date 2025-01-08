import { Component, OnInit } from "@angular/core";
import { TitleService } from "../title.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  constructor(private titleService: TitleService) {
    this.titleService.title = "Urjala-turnaus X — 11.1.2025";
  }

  ngOnInit() {}
}
