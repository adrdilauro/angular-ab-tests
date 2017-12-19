import { Directive, ViewContainerRef, TemplateRef, Input } from '@angular/core';
import { AbTestsService } from './service';
var AbTestVersionDirective = (function () {
    function AbTestVersionDirective(_service, _viewContainer, _templateRef) {
        this._service = _service;
        this._viewContainer = _viewContainer;
        this._templateRef = _templateRef;
        this._forCrawlers = false;
    }
    AbTestVersionDirective.prototype.ngOnInit = function () {
        if (this._service.shouldRender(this._versions, this._scope, this._forCrawlers)) {
            this._viewContainer.createEmbeddedView(this._templateRef);
        }
    };
    Object.defineProperty(AbTestVersionDirective.prototype, "abTestVersion", {
        set: function (value) {
            this._versions = value.split(',');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbTestVersionDirective.prototype, "abTestVersionScope", {
        set: function (value) {
            this._scope = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbTestVersionDirective.prototype, "abTestVersionForCrawlers", {
        set: function (value) {
            this._forCrawlers = value;
        },
        enumerable: true,
        configurable: true
    });
    AbTestVersionDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[abTestVersion]'
                },] },
    ];
    /** @nocollapse */
    AbTestVersionDirective.ctorParameters = function () { return [
        { type: AbTestsService, },
        { type: ViewContainerRef, },
        { type: TemplateRef, },
    ]; };
    AbTestVersionDirective.propDecorators = {
        "abTestVersion": [{ type: Input },],
        "abTestVersionScope": [{ type: Input },],
        "abTestVersionForCrawlers": [{ type: Input },],
    };
    return AbTestVersionDirective;
}());
export { AbTestVersionDirective };
//# sourceMappingURL=directive.js.map