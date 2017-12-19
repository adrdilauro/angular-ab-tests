import { OnInit, ViewContainerRef, TemplateRef } from '@angular/core';
import { AbTestsService } from './service';
export declare class AbTestVersionDirective implements OnInit {
    private _service;
    private _viewContainer;
    private _templateRef;
    private _versions;
    private _scope;
    private _forCrawlers;
    constructor(_service: AbTestsService, _viewContainer: ViewContainerRef, _templateRef: TemplateRef<any>);
    ngOnInit(): void;
    abTestVersion: string;
    abTestVersionScope: string;
    abTestVersionForCrawlers: boolean;
}
