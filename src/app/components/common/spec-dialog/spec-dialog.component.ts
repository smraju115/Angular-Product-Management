import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Spec } from '../../../models/spec';
import { SpectDataModel } from '../../../models/spect-data-model';
import { DeviceService } from '../../../services/device.service';
import { NotifyService } from '../../../services/notify.service';

@Component({
  selector: 'app-spec-dialog',
  templateUrl: './spec-dialog.component.html',
  styleUrl: './spec-dialog.component.css'
})
export class SpecDialogComponent implements OnInit {
  specs:Spec[] =[];
  dataSource:MatTableDataSource<Spec> = new MatTableDataSource(this.specs);
  columns=[ 'specName','specValue'];
  @ViewChild(MatSort, {static:false}) sort!:MatSort;
  @ViewChild(MatPaginator, {static:false}) paginator!:MatPaginator;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data:SpectDataModel,
    private deviceSrv :DeviceService,
    private notifySrv:NotifyService
  ){}
  ngOnInit(): void {
    this.deviceSrv.getSpecs(<number>this.data.id)
    .subscribe({
      next: r=>{
        console.log(r)
        this.specs = r;
        this.dataSource.data = this.specs;
        this.dataSource.sort=this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error:err=>{
        this.notifySrv.message("Faled to load device", "DISMISS");
        console.log(err.message | err);
      }
    })
  }
}
