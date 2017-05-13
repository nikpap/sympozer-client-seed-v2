import {Component, OnInit, NgZone, Input, HostListener} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {MdSnackBar} from '@angular/material';
import {Location} from "@angular/common";
import {routerTransition} from "../../app.router.animation";
import {LocalDAOService} from "../../localdao.service";
import {LocalStorageService} from 'ng2-webstorage';
import {ToolsService} from '../../services/tools.service';
const screenfull = require('screenfull');

@Component({
    selector: 'app-tools',
    templateUrl: './tools.component.html',
    styleUrls: ['./tools.component.scss'],
    animations: [routerTransition()],
    host: {'[@routerTransition]': ''}
})
export class ToolsComponent implements OnInit {

    title: string = "Tools";
    fontSize: number = 100;
    loading: boolean;
    socialShare: boolean;
    fullScreen: boolean;
    darkTheme: boolean;
    material: boolean;

    constructor(private zone: NgZone,
                private location: Location,
                private route: ActivatedRoute,
                private localdao: LocalDAOService,
                public snackBar: MdSnackBar,
                private localStoragexx: LocalStorageService,
                private toolService: ToolsService) {
    }

    ngOnInit() {
        this.loading = false;

        if (document.getElementById("page-title-p"))
            document.getElementById("page-title-p").innerHTML = this.title;

        let storage = this.localStoragexx.retrieve("zoomLevel");

        if (storage) {
            this.fontSize = storage;
        }

        this.fullScreen = screenfull.isFullscreen;

        storage = this.localStoragexx.retrieve("darkTheme");

        if (storage) {
            this.darkTheme = storage;
        }

        storage = this.localStoragexx.retrieve("socialShare");

        if (storage) {
            this.socialShare = storage;
        }

        storage = this.localStoragexx.retrieve("materialShadow");

        if (storage) {
            this.material = storage;
        }
    }

    @HostListener("document:webkitfullscreenchange") updateFullScreen() {
        this.fullScreen = screenfull.isFullscreen;
        this.sendFullScreenStatus(this.fullScreen)
    }

    @HostListener("document:mozfullscreenchange") updateFullScreenMoz() {
        this.fullScreen = screenfull.isFullscreen;
        this.sendFullScreenStatus(this.fullScreen)
    }

    @HostListener("document:msfullscreenchange") updateFullScreenIE() {
        this.fullScreen = screenfull.isFullscreen;
        this.sendFullScreenStatus(this.fullScreen)
    }

    @HostListener("document:webkitfullscreenchange") updateFullScreenOther() {
        this.fullScreen = screenfull.isFullscreen;
        this.sendFullScreenStatus(this.fullScreen)
    }

    /**
     * Load the application dataset
     */
    loadDataset() {
        this.loading = true;

        setTimeout(() => {
            this.localdao.loadDataset().then(() => {
                this.snackBar.open("Dataset properly loaded =)", "", {
                    duration: 2000,
                });
            }).catch(() => {
                this.snackBar.open("Dataset didn't load properly", "", {
                    duration: 2000,
                });
            });
            this.loading = false;
        }, 250);
    }

    isLoading() {
        return this.loading;
    }

    /**
     * Reset the application dataset
     */
    resetDataset() {
        try {
            if (this.localdao.resetDataset()) {
                this.snackBar.open("Dataset succesfully reset =)", "", {
                    duration: 2000,
                });
            }
            else {
                this.snackBar.open("Reset failed please retry", "", {
                    duration: 2000,
                });
            }
        }
        catch (err) {
            console.log(err);
            this.snackBar.open("Reset failed please retry", "", {
                duration: 2000,
            });
        }
    }

    /**
     * Decrease the application font size
     */
    decresaseFontSize() {
        if (this.fontSize > 60) {
            this.fontSize = this.fontSize - 10;
            document.documentElement.style.fontSize = this.fontSize + "%";
            this.localStoragexx.store("zoomLevel", this.fontSize);
        }
        else {
            this.snackBar.open("You reached the minimum zoom level", "", {
                duration: 2000,
            });
        }
    }

    /**
     * Increase the application font size
     */
    increaseFontSize() {
        if (this.fontSize < 200) {
            this.fontSize = this.fontSize + 10;
            document.documentElement.style.fontSize = this.fontSize + "%";
            this.localStoragexx.store("zoomLevel", this.fontSize);
        }
        else {
            this.snackBar.open("You reached the maximum zoom level", "", {
                duration: 2000,
            });
        }
    }

    /**
     * Send boolean status to all subscribers
     * @param status
     */
    sendFullScreenStatus(status: boolean): void {
        this.toolService.sendFullScreenStatus(status)
    }

    clearFullScreenStatus(): void {
        // clear message
        this.toolService.clearFullScreenStatus();
    }

    /**
     * Change full screen status
     */
    toggleFullScreen() {
        this.fullScreen = !this.fullScreen;
        this.sendFullScreenStatus(this.fullScreen)
        if (screenfull.enabled) {
            screenfull.toggle();
        }
    }

    /**
     * Toggle application theme
     */
    toggleDarkTheme() {
        this.darkTheme = !this.darkTheme;
        this.localStoragexx.store("darkTheme", this.darkTheme);
        let html = document.documentElement;
        if (this.darkTheme) {
            if (!html.classList.contains("dark")) {
                html.classList.add('dark');
            }
        }
        else {
            if (html.classList.contains("dark")) {
                html.classList.remove('dark');
            }
        }
    }

    /**
     * Toggle Social share in the application
     */
    toggleSocialShare() {
        this.socialShare = !this.socialShare;
        this.localStoragexx.store("socialShare", this.socialShare);
        if (this.socialShare) {
            if (document.getElementById("share"))
                document.getElementById("share").style.display = "block";
        }
        else {
            if (document.getElementById("share"))
                document.getElementById("share").style.display = "none";
        }
    }

    toggleMaterial() {
        this.material = !this.material;
        this.localStoragexx.store("materialShadow", this.material);
        if (this.material) {
            if (document.getElementById("share"))
                document.getElementById("share").style.display = "block";
        }
        else {
            console.log("kool");
            var elements = document.getElementsByClassName('info-text');
            console.log(elements);
            for (var i = 0, l = elements.length; i < l; i++) {
                (<HTMLElement>elements[i]).style.boxShadow = "none";
            }
        }
    }
}