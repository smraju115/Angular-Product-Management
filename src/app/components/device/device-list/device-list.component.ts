import { Component, OnInit, ViewChild } from '@angular/core';
import { Device } from '../../../models/device';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { DeviceType } from '../../../models/app-constants';
import { DeviceService } from '../../../services/device.service';
import { NotifyService } from '../../../services/notify.service';
import { ConfirmDeleteComponent } from '../../common/confirm-delete/confirm-delete.component';
import { SpecDialogComponent } from '../../common/spec-dialog/spec-dialog.component';

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrl: './device-list.component.css'
})
export class DeviceListComponent implements OnInit {
  imgPath = 'http://localhost:5192/Pictures';
  devices:Device[] =[];
  dataSource:MatTableDataSource<Device> = new MatTableDataSource(this.devices);
  columns=[ 'picture','name', 'deviceType', 'releaseDate', 'price', 'inStock','specs', 'actions'];
  @ViewChild(MatSort, {static:false}) sort!:MatSort;
  @ViewChild(MatPaginator, {static:false}) paginator!:MatPaginator;
  constructor(
    private deviceSrv:DeviceService,
    private notifySrv:NotifyService,
    private matDialog:MatDialog
  ){}
  getDeviceTypeName(v:number){
    return DeviceType[v];
  }
  showSpecs(id:number){
    this.matDialog.open(SpecDialogComponent, {
      data:{id:id}
    })
  }
  deleteDevice(data:Device){
    this.matDialog.open(ConfirmDeleteComponent, {
      "width":"350px"

    }).afterClosed()
    .subscribe({
      next: result=>{
        if(result) {
          this.deviceSrv.delete(<number>data.deviceId)
          .subscribe({
            next: r=>{
              this.dataSource.data = this.dataSource.data.filter(x=> x.deviceId != data.deviceId);
            }
          })
        }
      }
    })
  }
  ngOnInit(): void {
    this.deviceSrv.getAll()
    .subscribe({
      next: r=>{
        this.devices=r;
        console.log(this.devices)
        this.dataSource.data = this.devices;
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
