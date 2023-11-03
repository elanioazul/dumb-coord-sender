import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthConfigService } from '@core/services/infraestructure/auth/auth-config.service';
@Component({
  selector: 'app-external-integration',
  templateUrl: './external-integration.component.html',
  styleUrls: ['./external-integration.component.scss']
})
export class ExternalIntegrationComponent implements OnInit {

    constructor(private router: Router,
      private activatedRoute: ActivatedRoute,
      private authConfigService: AuthConfigService
    ) {
    }

  ngOnInit(): void {
    const token = this.activatedRoute.snapshot.paramMap.get('token');
    if (token)
    this.authConfigService.saveToken(token);
    this.router.navigate(['/visor-page']);
  }
}
