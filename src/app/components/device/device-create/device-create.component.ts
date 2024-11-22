import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { DeviceType } from '../../../models/app-constants';
import { Device } from '../../../models/device';
import { DeviceService } from '../../../services/device.service';
import { NotifyService } from '../../../services/notify.service';

@Component({
  selector: 'app-device-create',
  templateUrl: './device-create.component.html',
  styleUrl: './device-create.component.css'
})
export class DeviceCreateComponent implements OnInit {
  device:Device = {};
  typeOptions:{label:string, value:number}[] =[];
  picture:File = null!;
  deviceForm:FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    deviceType: new FormControl(undefined, Validators.required),
    releaseDate: new FormControl(undefined, Validators.required),
    price:new FormControl(undefined, Validators.required),
    inStock:new FormControl(undefined),
    picture: new FormControl('', Validators.required),
    specs: new FormArray([])
  });
  constructor(
    private deviceSrv: DeviceService,
    private notfySrv:NotifyService,
    private datePipe:DatePipe
  ){}
  get f(){
    return this.deviceForm.controls;
  }
  get specs(){
    return this.deviceForm.controls['specs'] as FormArray;
  }
  addSpec(){
    this.specs.push(new FormGroup({
        specName: new FormControl('', Validators.required),
        specValue: new FormControl('', Validators.required)
    })
  );
  }
  removeSpec(index:number){
    this.specs.removeAt(index);
  }
  save(){
    if(this.deviceForm.invalid) return;
    Object.assign(this.device, this.deviceForm.value);
    const reader = new FileReader();
    reader.onload = (e:any)=>{
      this.deviceSrv.uploadImage(this.picture)
      .subscribe({
        next: r=>{
          this.device.picture = r.newFileName;
          this.insert();
        },
        error: err=>{
          this.notfySrv.message("Failed to upload picture", "DISMISS");
        }
      })
    }
    reader.readAsArrayBuffer(this.picture)
    this.device.releaseDate = <string>this.datePipe.transform(this.device.releaseDate, "yyyy-MM-dd")
    //console.log(this.device)

  }
  insert(){
    this.deviceSrv.save(this.device)
    .subscribe({
      next: r=>{
        this.notfySrv.message("Data Saved", "DISMISS");
        this.device={};
        this.deviceForm.reset();
        this.deviceForm.markAsPristine();
        this.deviceForm.markAsUntouched();
      },
      error: err=>{
        this.notfySrv.message("Failed to save", "DISMISS");
      }
    })
  }
  pictureChanged(event:any){

    if(event.target.files.length){
      this.picture = event.target.files[0];
      this.deviceForm.patchValue({
        picture: this.picture.name
      })
    }
  }
  ngOnInit(): void {
    this.addSpec();
    Object.keys(DeviceType).filter(
      (type) => isNaN(<any>type) && type !== 'values'
    ).forEach((v: any, i) => {
      this.typeOptions.push({ label: v, value: Number(DeviceType[v]) });
    });
    console.log(this.typeOptions)
  }
}
