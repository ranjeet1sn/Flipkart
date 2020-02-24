import { Component, EventEmitter, Inject, Injectable, InjectionToken, Input, NgModule, Output, PLATFORM_ID, ViewChild } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { BehaviorSubject, combineLatest, from } from 'rxjs';
import { filter, first, map, switchMap } from 'rxjs/operators';
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var WindowRef = /** @class */ (function () {
    /**
     * @param {?} platformId
     */
    function WindowRef(platformId) {
        this.platformId = platformId;
    }
    /**
     * @return {?}
     */
    WindowRef.prototype.getNativeWindow = function () {
        if (isPlatformBrowser(this.platformId)) {
            return window;
        }
        return /** @type {?} */ ({});
    };
    return WindowRef;
}());
WindowRef.decorators = [
    { type: Injectable },
];
/** @nocollapse */
WindowRef.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: Inject, args: [PLATFORM_ID,] },] },
]; };
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var DocumentRef = /** @class */ (function () {
    /**
     * @param {?} platformId
     */
    function DocumentRef(platformId) {
        this.platformId = platformId;
    }
    /**
     * @return {?}
     */
    DocumentRef.prototype.getNativeDocument = function () {
        if (isPlatformBrowser(this.platformId)) {
            return document;
        }
        return /** @type {?} */ ({});
    };
    return DocumentRef;
}());
DocumentRef.decorators = [
    { type: Injectable },
];
/** @nocollapse */
DocumentRef.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: Inject, args: [PLATFORM_ID,] },] },
]; };
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @record
 */
var LazyStripeAPILoader = /** @class */ (function () {
    /**
     * @param {?} platformId
     * @param {?} window
     * @param {?} document
     */
    function LazyStripeAPILoader(platformId, window, document) {
        this.platformId = platformId;
        this.window = window;
        this.document = document;
        this.status = new BehaviorSubject({
            error: false,
            loaded: false,
            loading: false
        });
    }
    /**
     * @return {?}
     */
    LazyStripeAPILoader.prototype.asStream = function () {
        this.load();
        return this.status.asObservable();
    };
    /**
     * @return {?}
     */
    LazyStripeAPILoader.prototype.isReady = function () {
        return this.status.getValue().loaded;
    };
    /**
     * @return {?}
     */
    LazyStripeAPILoader.prototype.load = function () {
        var _this = this;
        if (isPlatformServer(this.platformId)) {
            return;
        }
        var /** @type {?} */ status = this.status.getValue();
        if (this.window.getNativeWindow().hasOwnProperty('Stripe')) {
            this.status.next({
                error: false,
                loaded: true,
                loading: false
            });
        }
        else if (!status.loaded && !status.loading) {
            this.status.next(Object.assign({}, status, { loading: true }));
            var /** @type {?} */ script = this.document.getNativeDocument().createElement('script');
            script.type = 'text/javascript';
            script.async = true;
            script.defer = true;
            script.src = 'https://js.stripe.com/v3/';
            script.onload = function () {
                _this.status.next({
                    error: false,
                    loaded: true,
                    loading: false
                });
            };
            script.onerror = function () {
                _this.status.next({
                    error: true,
                    loaded: false,
                    loading: false
                });
            };
            this.document.getNativeDocument().body.appendChild(script);
        }
    };
    return LazyStripeAPILoader;
}());
LazyStripeAPILoader.decorators = [
    { type: Injectable },
];
/** @nocollapse */
LazyStripeAPILoader.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: Inject, args: [PLATFORM_ID,] },] },
    { type: WindowRef, },
    { type: DocumentRef, },
]; };
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var STRIPE_PUBLISHABLE_KEY = new InjectionToken('Stripe Publishable Key');
var STRIPE_OPTIONS = new InjectionToken('Stripe Options');
/**
 * @record
 */
/**
 * @record
 */
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @record
 */
/**
 * @record
 */
/**
 * @record
 */
/**
 * @param {?} sourceData
 * @return {?}
 */
function isSourceData(sourceData) {
    return 'type' in sourceData;
}
/**
 * @record
 */
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @record
 */
/**
 * @record
 */
/**
 * @record
 */
/**
 * @record
 */
/**
 * @record
 */
/**
 * @param {?} account
 * @return {?}
 */
function isBankAccount(account) {
    return account === 'bank_account';
}
/**
 * @param {?} bankAccountData
 * @return {?}
 */
function isBankAccountData(bankAccountData) {
    return ('country' in bankAccountData &&
        'currency' in bankAccountData &&
        'routing_number' in bankAccountData &&
        'account_number' in bankAccountData &&
        'account_holder_name' in bankAccountData &&
        'account_holder_type' in bankAccountData &&
        (bankAccountData.account_holder_type === 'individual' ||
            bankAccountData.account_holder_type === 'company'));
}
/**
 * @param {?} pii
 * @return {?}
 */
function isPii(pii) {
    return pii === 'pii';
}
/**
 * @param {?} piiData
 * @return {?}
 */
function isPiiData(piiData) {
    return 'personal_id_number' in piiData;
}
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var StripeInstance = /** @class */ (function () {
    /**
     * @param {?} platformId
     * @param {?} loader
     * @param {?} window
     * @param {?} key
     * @param {?=} options
     */
    function StripeInstance(platformId, loader, window, key, options) {
        var _this = this;
        this.platformId = platformId;
        this.loader = loader;
        this.window = window;
        this.key = key;
        this.options = options;
        this.stripe$ = new BehaviorSubject(undefined);
        this.loader
            .asStream()
            .pipe(filter(function (status) { return status.loaded === true; }), first(), map(function () { return ((_this.window.getNativeWindow())).Stripe; }))
            .subscribe(function (Stripe) {
            var /** @type {?} */ stripe = _this.options
                ? ((Stripe(_this.key, _this.options)))
                : ((Stripe(_this.key)));
            _this.stripe$.next(stripe);
        });
    }
    /**
     * @return {?}
     */
    StripeInstance.prototype.getInstance = function () {
        return this.stripe$.getValue();
    };
    /**
     * @param {?=} options
     * @return {?}
     */
    StripeInstance.prototype.elements = function (options) {
        return this.stripe$.pipe(filter(function (stripe) { return Boolean(stripe); }), map(function (stripe) { return ((stripe)).elements(options); }));
    };
    /**
     * @param {?} a
     * @param {?} b
     * @return {?}
     */
    StripeInstance.prototype.createToken = function (a, b) {
        return this.stripe$.pipe(filter(function (stripe) { return Boolean(stripe); }), switchMap(function (s) {
            var /** @type {?} */ stripe = (s);
            if (isBankAccount(a) && isBankAccountData(b)) {
                return from(stripe.createToken(a, b));
            }
            else if (isPii(a) && isPiiData(b)) {
                return from(stripe.createToken(a, b));
            }
            else {
                return from(stripe.createToken(/** @type {?} */ (a), /** @type {?} */ (b)));
            }
        }));
    };
    /**
     * @param {?} a
     * @param {?=} b
     * @return {?}
     */
    StripeInstance.prototype.createSource = function (a, b) {
        return this.stripe$.pipe(filter(function (stripe) { return Boolean(stripe); }), switchMap(function (s) {
            var /** @type {?} */ stripe = (s);
            if (isSourceData(a)) {
                return from(stripe.createSource(/** @type {?} */ (a)));
            }
            return from(stripe.createSource(/** @type {?} */ (a), b));
        }));
    };
    /**
     * @param {?} source
     * @return {?}
     */
    StripeInstance.prototype.retrieveSource = function (source) {
        return this.stripe$.pipe(filter(function (stripe) { return Boolean(stripe); }), switchMap(function (s) {
            var /** @type {?} */ stripe = (s);
            return from(stripe.retrieveSource(source));
        }));
    };
    /**
     * @param {?} options
     * @return {?}
     */
    StripeInstance.prototype.paymentRequest = function (options) {
        return this.stripe$.pipe(filter(function (stripe) { return Boolean(stripe); }), map(function (s) {
            var /** @type {?} */ stripe = (s);
            return stripe.paymentRequest(options);
        }));
    };
    return StripeInstance;
}());
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var StripeService = /** @class */ (function () {
    /**
     * @param {?} platformId
     * @param {?} key
     * @param {?} options
     * @param {?} loader
     * @param {?} window
     */
    function StripeService(platformId, key, options, loader, window) {
        this.platformId = platformId;
        this.key = key;
        this.options = options;
        this.loader = loader;
        this.window = window;
        if (key) {
            this.stripe = new StripeInstance(this.platformId, this.loader, this.window, key, options);
        }
    }
    /**
     * @return {?}
     */
    StripeService.prototype.getStripeReference = function () {
        var _this = this;
        return this.loader
            .asStream()
            .pipe(filter(function (status) { return status.loaded === true; }), map(function () { return ((_this.window.getNativeWindow())).Stripe; }));
    };
    /**
     * @return {?}
     */
    StripeService.prototype.getInstance = function () {
        return this.stripe.getInstance();
    };
    /**
     * @param {?} key
     * @param {?=} options
     * @return {?}
     */
    StripeService.prototype.setKey = function (key, options) {
        return this.changeKey(key, options);
    };
    /**
     * @param {?} key
     * @param {?=} options
     * @return {?}
     */
    StripeService.prototype.changeKey = function (key, options) {
        this.stripe = new StripeInstance(this.platformId, this.loader, this.window, key, options);
        return this.stripe;
    };
    /**
     * @param {?=} options
     * @return {?}
     */
    StripeService.prototype.elements = function (options) {
        return this.stripe.elements(options);
    };
    /**
     * @param {?} a
     * @param {?} b
     * @return {?}
     */
    StripeService.prototype.createToken = function (a, b) {
        return this.stripe.createToken(a, b);
    };
    /**
     * @param {?} a
     * @param {?=} b
     * @return {?}
     */
    StripeService.prototype.createSource = function (a, b) {
        return this.stripe.createSource(a, b);
    };
    /**
     * @param {?} source
     * @return {?}
     */
    StripeService.prototype.retrieveSource = function (source) {
        return this.stripe.retrieveSource(source);
    };
    /**
     * @param {?} options
     * @return {?}
     */
    StripeService.prototype.paymentRequest = function (options) {
        return this.stripe.paymentRequest(options);
    };
    return StripeService;
}());
StripeService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
StripeService.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: Inject, args: [PLATFORM_ID,] },] },
    { type: undefined, decorators: [{ type: Inject, args: [STRIPE_PUBLISHABLE_KEY,] },] },
    { type: undefined, decorators: [{ type: Inject, args: [STRIPE_OPTIONS,] },] },
    { type: LazyStripeAPILoader, },
    { type: WindowRef, },
]; };
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var StripeFactoryService = /** @class */ (function () {
    /**
     * @param {?} platformId
     * @param {?} baseKey
     * @param {?} baseOptions
     * @param {?} loader
     * @param {?} window
     */
    function StripeFactoryService(platformId, baseKey, baseOptions, loader, window) {
        this.platformId = platformId;
        this.baseKey = baseKey;
        this.baseOptions = baseOptions;
        this.loader = loader;
        this.window = window;
    }
    /**
     * @param {?} key
     * @param {?=} options
     * @return {?}
     */
    StripeFactoryService.prototype.create = function (key, options) {
        return new StripeInstance(this.platformId, this.loader, this.window, key, options);
    };
    return StripeFactoryService;
}());
StripeFactoryService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
StripeFactoryService.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: Inject, args: [PLATFORM_ID,] },] },
    { type: undefined, decorators: [{ type: Inject, args: [STRIPE_PUBLISHABLE_KEY,] },] },
    { type: undefined, decorators: [{ type: Inject, args: [STRIPE_OPTIONS,] },] },
    { type: LazyStripeAPILoader, },
    { type: WindowRef, },
]; };
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var StripeCardComponent = /** @class */ (function () {
    /**
     * @param {?} stripeService
     */
    function StripeCardComponent(stripeService) {
        this.stripeService = stripeService;
        this.card = new EventEmitter();
        this.on = new EventEmitter();
        this.options$ = new BehaviorSubject({});
        this.elementsOptions$ = new BehaviorSubject({});
        this.stripe$ = new BehaviorSubject(null);
    }
    Object.defineProperty(StripeCardComponent.prototype, "options", {
        /**
         * @param {?} optionsIn
         * @return {?}
         */
        set: function (optionsIn) {
            this.options$.next(optionsIn);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StripeCardComponent.prototype, "elementsOptions", {
        /**
         * @param {?} optionsIn
         * @return {?}
         */
        set: function (optionsIn) {
            this.elementsOptions$.next(optionsIn);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StripeCardComponent.prototype, "stripe", {
        /**
         * @param {?} stripeIn
         * @return {?}
         */
        set: function (stripeIn) {
            this.stripe$.next(stripeIn);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    StripeCardComponent.prototype.ngOnInit = function () {
        var _this = this;
        var /** @type {?} */ elements$ = combineLatest(this.elementsOptions$.asObservable(), this.stripe$.asObservable()).pipe(switchMap(function (_a) {
            var options = _a[0], stripe = _a[1];
            if (stripe) {
                if (Object.keys(options).length > 0) {
                    return stripe.elements(options);
                }
                return stripe.elements();
            }
            else {
                if (Object.keys(options).length > 0) {
                    return _this.stripeService.elements(options);
                }
                return _this.stripeService.elements();
            }
        }));
        combineLatest(elements$, this.options$.asObservable().pipe(filter(function (options) { return Boolean(options); }))).subscribe(function (_a) {
            var elements = _a[0], options = _a[1];
            _this.element = elements.create('card', options);
            _this.element.on('blur', function (ev) { return _this.on.emit({
                event: ev,
                type: 'blur'
            }); });
            _this.element.on('change', function (ev) { return _this.on.emit({
                event: ev,
                type: 'change'
            }); });
            _this.element.on('click', function (ev) { return _this.on.emit({
                event: ev,
                type: 'click'
            }); });
            _this.element.on('focus', function (ev) { return _this.on.emit({
                event: ev,
                type: 'focus'
            }); });
            _this.element.on('ready', function (ev) { return _this.on.emit({
                event: ev,
                type: 'ready'
            }); });
            _this.element.mount(_this.stripeCard.nativeElement);
            _this.card.emit(_this.element);
        });
    };
    /**
     * @return {?}
     */
    StripeCardComponent.prototype.getCard = function () {
        return this.element;
    };
    return StripeCardComponent;
}());
StripeCardComponent.decorators = [
    { type: Component, args: [{
                selector: 'ngx-stripe-card',
                template: "<div class=\"field\" #stripeCard></div>"
            },] },
];
/** @nocollapse */
StripeCardComponent.ctorParameters = function () { return [
    { type: StripeService, },
]; };
StripeCardComponent.propDecorators = {
    "card": [{ type: Output },],
    "on": [{ type: Output },],
    "stripeCard": [{ type: ViewChild, args: ['stripeCard',] },],
    "options": [{ type: Input },],
    "elementsOptions": [{ type: Input },],
    "stripe": [{ type: Input },],
};
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var NgxStripeModule = /** @class */ (function () {
    function NgxStripeModule() {
    }
    /**
     * @param {?=} publishableKey
     * @param {?=} options
     * @return {?}
     */
    NgxStripeModule.forRoot = function (publishableKey, options) {
        return {
            ngModule: NgxStripeModule,
            providers: [
                LazyStripeAPILoader,
                StripeService,
                StripeFactoryService,
                WindowRef,
                DocumentRef,
                {
                    provide: STRIPE_PUBLISHABLE_KEY,
                    useValue: publishableKey
                },
                {
                    provide: STRIPE_OPTIONS,
                    useValue: options
                }
            ]
        };
    };
    return NgxStripeModule;
}());
NgxStripeModule.decorators = [
    { type: NgModule, args: [{
                declarations: [StripeCardComponent],
                exports: [StripeCardComponent]
            },] },
];
/** @nocollapse */
NgxStripeModule.ctorParameters = function () { return []; };
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Entry point for all public APIs of the package.
 */
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Generated bundle index. Do not edit.
 */
export { NgxStripeModule, StripeCardComponent, StripeService, StripeFactoryService, LazyStripeAPILoader, WindowRef, DocumentRef, StripeInstance, isSourceData, STRIPE_PUBLISHABLE_KEY, STRIPE_OPTIONS, isBankAccount, isBankAccountData, isPii, isPiiData };
//# sourceMappingURL=ngx-stripe.es5.js.map
