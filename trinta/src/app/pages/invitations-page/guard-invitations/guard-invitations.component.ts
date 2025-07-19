import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-guard-invitations',
  templateUrl: './guard-invitations.component.html',
  styleUrls: ['./guard-invitations.component.scss']
})
export class GuardInvitationsComponent implements OnInit {
  invitations$: Observable<any[]>;

  constructor() {}

  ngOnInit(): void {
  }
}
