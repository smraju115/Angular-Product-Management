import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Device } from '../models/device';
import { Observable } from 'rxjs';
import { Spec } from '../models/spec';
import { ImageUploadResponse } from '../models/image-upload-response';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  constructor(private http:HttpClient) { }
  getAll(): Observable<Device[]>{
    return this.http.get<Device[]>(`http://localhost:5192/api/Devices`);
  }
  getSpecs(id:number): Observable<Spec[]>{
    return this.http.get<Spec[]>(`http://localhost:5192/api/Devices/Specs/Of/${id}`);
  }
  getById(id:number):Observable<Device>{
    return this.http.get<Device>(`http://localhost:5192/api/Devices/${id}`);
  }
  save(data:Device):Observable<Device>{
    return this.http.post<Device>(`http://localhost:5192/api/Devices`, data);
  }
  update(data:Device):Observable<any>{
    return this.http.put<any>(`http://localhost:5192/api/Devices/${data.deviceId}`, data);
  }
  delete(id:number):Observable<any>{
    return this.http.delete<any>(`http://localhost:5192/api/Devices/${id}`);
  }
  uploadImage(f: File): Observable<ImageUploadResponse> {
    const formData = new FormData();

    formData.append('pic', f);
    //console.log(f);
    return this.http.post<ImageUploadResponse>(`http://localhost:5192/api/Devices/Image/Upload`, formData);
  }
}
