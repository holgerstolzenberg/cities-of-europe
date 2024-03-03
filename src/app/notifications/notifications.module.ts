import { NgModule } from '@angular/core';
import { ToastrModule } from 'ngx-toastr';
import { NotificationService } from './notification.service';

@NgModule({
  imports: [ToastrModule.forRoot({ preventDuplicates: true })],
  providers: [NotificationService]
})
export class NotificationsModule {
  // nothing here so far
}
