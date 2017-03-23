import {Component, OnInit, trigger, transition, style, animate, state} from '@angular/core';
import {ActivatedRoute, Params}   from '@angular/router';
import {Location}              from '@angular/common';
import {LocalDAOService} from  '../../localdao.service';
import {routerTransition} from '../../app.router.animation';


@Component({
    selector: 'schedule',
    templateUrl: 'schedule.component.html',
    styleUrls: ['./schedule.component.scss'],
    animations: [
        routerTransition(),
        trigger(
            'enterAnimation', [
                state('void', style({
                    position: 'relative',
                    willChange: 'transform',

                })),
                state('*', style({
                    position: 'relative',
                    willChange: 'transform',
                })),
                transition(':enter', [
                    style({
                        transform: 'translate3D(-10%, 0, 0) scaleY(0)',
                        transformOrigin: '0% 0%',
                        opacity: '0'
                    }),
                    animate('0.4s cubic-bezier(.25, .8, .25, 1)', style({
                        transform: 'translate3D(0, 0, 0) scaleY(1)',
                        transformOrigin: '0% 0%',
                        opacity: '1',
                    }))
                ]),
                transition(':leave', [
                    style({
                        transform: 'translate3D(0, 0, 0) scaleY(1)',
                        transformOrigin: '0% 0%',
                        opacity: '1'
                    }),
                    animate('0.4s cubic-bezier(.25, .8, .25, 1)', style({
                        opacity: '0',
                        transformOrigin: '0% 0%',
                        transform: 'translate3D(-10%, 0, 0) scaleY(0)'
                    }))
                ])
            ]
        )
    ],
    host: {'[@routerTransition]': ''}
})
export class ScheduleComponent implements OnInit {
    schedule;
    schedules;
    test = false;

    constructor(private location: Location,
                private route: ActivatedRoute,
                private DaoService: LocalDAOService) {
    }

    ngOnInit() {
        this.schedule = this.DaoService.query("getConferenceSchedule", null);
        if (this.schedule.length === 0) {
            return false;
        }
        console.log("HERRREEE", this.schedule);

        //On stocke la date de la première valeur pour pouvoir comparer aux autres
        var dateObj = new Date(this.schedule[0].startsAt);
        var month = dateObj.getUTCMonth() + 1; //months from 1-12
        var day = dateObj.getUTCDate();
        var year = dateObj.getUTCFullYear();

        var newDate = year + "/" + month + "/" + day;
        var isVisible = false;

        var hours = dateObj.getHours();
        var minutes = dateObj.getMinutes();
        var seconds = dateObj.getSeconds();
        var time = hours + ":" + minutes + ":" + seconds;
        var scheduleStart = {month: month, year: year, day: day, hours: hours, minutes: minutes, seconds: seconds};

        //La variable que l'on va retourner
        var schedules = new Array();
        var j = 0, k = 0;
        schedules[j] = {date: newDate, visible: isVisible, array: new Array()};
        schedules[j].array[k] = {time: newDate, array: new Array()};
        for (var i = 0; i < this.schedule.length; i++) {
            var sched = new Date(this.schedule[i].startsAt);
            var schedMonth = sched.getUTCMonth() + 1;
            var schedYear = sched.getUTCFullYear();
            var schedDay = sched.getUTCDate();
            var schedHours = sched.getHours();
            var schedMinutes = sched.getMinutes();
            var schedSeconds = sched.getSeconds();
            //On trie par la date et ensuite par l'heure
            //Si le jour est le meme
            if (scheduleStart.day == schedDay && scheduleStart.month == schedMonth && scheduleStart.year == schedYear) {
                //Si l'heure est le meme
                if (scheduleStart.hours == schedHours && scheduleStart.minutes == schedMinutes && scheduleStart.seconds == schedSeconds) {
                    schedules[j].array[k].array.push(this.schedule[i]);
                }
                else {
                    k++;
                    scheduleStart.hours = schedHours;
                    scheduleStart.minutes = schedMinutes;
                    scheduleStart.seconds = schedSeconds;
                    time = schedHours + ":" + schedMinutes + ":" + schedSeconds;
                    schedules[j].array[k] = {time: sched, array: new Array()};
                    schedules[j].array[k].array.push(this.schedule[i]);
                }
            }
            else {
                j++;
                k = 0;
                scheduleStart.day = schedDay;
                scheduleStart.month = schedMonth;
                scheduleStart.year = schedYear;

                scheduleStart.hours = schedHours;
                scheduleStart.minutes = schedMinutes;
                scheduleStart.seconds = schedSeconds;
                newDate = schedYear + "/" + schedMonth + "/" + schedDay;
                time = schedHours + ":" + schedMinutes + ":" + schedSeconds;
                schedules[j] = {date: newDate, visible: false, array: new Array()};
                schedules[j].array[k] = {time: sched, array: new Array()};

                schedules[j].array[k].array.push(this.schedule[i]);
            }
        }
        /*this.route.params.forEach((params: Params) => {
         let id = params['id'];
         console.log("id : " + id);
         });*/
        console.log("*****Scheds");
        console.log(schedules);
        this.schedules = schedules;
    }

    toggleVisible(schedule) {
        if (schedule.visible == false)
            schedule.visible = true;
        else
            schedule.visible = false;
    }
}