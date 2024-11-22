import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DeviceType } from '../../../models/app-constants';
import { Device } from '../../../models/device';
import { Spec } from '../../../models/spec';
import { DeviceService } from '../../../services/device.service';
import { NotifyService } from '../../../services/notify.service';

@Component({
  selector: 'app-device-edit',
  templateUrl: './device-edit.component.html',
  styleUrl: './device-edit.component.css'
})
export class DeviceEditComponent implements OnInit {
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
    private activatedRoute:ActivatedRoute,
    private datePipe:DatePipe
  ){}

  get f(){
    return this.deviceForm.controls;
  }
  get specs(){
    return this.deviceForm.controls['specs'] as FormArray;
  }
  addSpec(spec?:Spec){
    this.specs.push(new FormGroup({
        specName: new FormControl(spec?.specName ?? '', Validators.required),
        specValue: new FormControl(spec?.specValue ?? '', Validators.required)
    })
  );
  }
  removeSpec(index:number){
    this.specs.removeAt(index);
  }
  save(){
    if(this.deviceForm.invalid) return;
    let data:Device = {};
    Object.assign(data, this.deviceForm.value);
    data.deviceId=this.device.deviceId;
    if(data.picture == ''){
      data.picture = this.device.picture;
    }

    console.log(data);
    this.deviceSrv.update(data)
    .subscribe({
      next:r=>{
        this.notfySrv.message("Data Saved", "DISMISS");
      },
      error: err=>{
        this.notfySrv.message("Failed to update", "DISMISS");
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

    Object.keys(DeviceType).filter(
      (type) => isNaN(<any>type) && type !== 'values'
    ).forEach((v: any, i) => {
      this.typeOptions.push({ label: v, value: Number(DeviceType[v]) });
    });
    let id:number = this.activatedRoute.snapshot.params['id'];
    this.deviceSrv.getById(id)
    .subscribe({
      next: r=>{
        this.device= r;
        this.deviceForm.patchValue(this.device)
        this.device.specs?.forEach(s=>{
          this.addSpec(s);
        });
      },
      error: err=>{
        this.notfySrv.message("Failed to save", "DISMISS");
      }
    })
  }
}
