import { Component, OnInit } from "@angular/core";
import { TeacherListInterFace } from "./teacherlist";

@Component({
    selector: 'tm-teachers' ,
    styleUrls: ['./teacher.pt.css'],
    templateUrl: './teacher.pt.html'
})

export class TeacherList implements OnInit {
    pageTitle: string='Teachers List';
    iW = 110;
    iM = 2;
    
    private _lF: string = '';

    get lF() : string {
        return this._lF;
    }

    set lF(value: string) {
        this._lF = value;
        console.log('in setter:', value);
        this.fTeatcherList = this.performFilter(value) ;
    }

    showImage: boolean= false;

    fTeatcherList : TeacherListInterFace[]=[];
    teacherList1: TeacherListInterFace[]=[
        {
            "teacherID": 1,
            "teacherSUBJECT": "Math",
            "teacherNAME": "Zakaria Al-Saadi",
            "teacherCOUNTRY": "+963992430782",
            "teacherNUMBER": 11111,
            "teacherPLACE": "Syria Damascus maraba",
            "teacherPRICE": 15000,
            "starRATING": 5,
            "teacherIMAGE": "https://scontent-mrs2-2.xx.fbcdn.net/v/t1.18169-9/17190956_1373963456007264_1567299120916488415_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=174925&_nc_ohc=wLBXAW--6QwAX8f1BUd&_nc_ht=scontent-mrs2-2.xx&oh=00_AfCwdaDdzZ98k8CUF4YXQKiPi0ozecXZ3fRhXA2Dexx9aQ&oe=63C3F10D",
        }
        ,{
            "teacherID": 2,
            "teacherSUBJECT": "Bio",
            "teacherNAME": "mohamad mahmod",
            "teacherCOUNTRY" : "syria",
            "teacherNUMBER": 9,
            "teacherPLACE": "nothing yet just testing",
            "teacherPRICE": 10000,
            "starRATING": 3.5,
            "teacherIMAGE": "https://preview.redd.it/7pllrpa4iqg11.jpg?auto=webp&s=051311d2b1c0f6484cc31900fdfd7944932a1f97",
        },
  ]; 

performFilter(filterBy: string): TeacherListInterFace[] {
            filterBy = filterBy.toLocaleLowerCase();
            return this.teacherList1.filter((teacher: TeacherListInterFace) =>
            teacher.teacherSUBJECT.toLocaleLowerCase().includes(filterBy))
}

  toggleImage(): void {
    this.showImage = ! this.showImage
  }
  ngOnInit(): void {
      this.lF ='Math';
  }
}