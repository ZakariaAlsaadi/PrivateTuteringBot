import { PipeTransform } from "@angular/core";
import { Pipe } from "@angular/core";

@Pipe({
    name:'cTS'
})


export class CTSpipe implements PipeTransform {

    transform(value: string, character: string): string {
        return value.replace(character,' ')
    }

}