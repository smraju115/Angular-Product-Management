import { DeviceType } from "./app-constants";
import { Spec } from "./spec";

export interface Device {
    deviceId?:number;
    name?:string;
    deviceType?:DeviceType;
    releaseDate?:Date|string;
    price?:number;
    picture?:string;
    inStock?:boolean;
    specs?:Spec[];
}
