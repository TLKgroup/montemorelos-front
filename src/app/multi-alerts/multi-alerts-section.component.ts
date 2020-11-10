import { Component, Input } from '@angular/core';
/*import { Alert, AlertType } from '../models/alert';
import { AlertService } from '../services/alert.service';

@Component({
    moduleId: module.id,
    selector: 'multi-alerts-section',
    templateUrl: 'multi-alerts-section.component.html'
})

export class MultiAlertsSectionComponent {
    @Input() id: string;

    constructor(private alertService: AlertService) { }

    success(message: string) {
        this.alertService.alert(new Alert({ 
            message,
            type: AlertType.Success,
            alertId: this.id
        }));
    }

    error(message: string) {
        this.alertService.alert(new Alert({ 
            message,
            type: AlertType.Error,
            alertId: this.id
        }));
    }

    info(message: string) {
        this.alertService.alert(new Alert({ 
            message,
            type: AlertType.Info,
            alertId: this.id
        }));
    }

    warn(message: string) {
        this.alertService.alert(new Alert({ 
            message,
            type: AlertType.Warning,
            alertId: this.id
        }));
    }

    clear() {
        this.alertService.clear(this.id);
    }
}*/