import { OnInit, EventEmitter } from '@angular/core';
import { Element as StripeElement, ElementEventType } from '../interfaces/element';
import { StripeService } from '../services/stripe.service';
export declare class StripeCardComponent implements OnInit {
    private stripeService;
    card: EventEmitter<StripeElement>;
    on: EventEmitter<{
        type: ElementEventType;
        event: any;
    }>;
    private stripeCard;
    private element;
    private options;
    private options$;
    private elementsOptions;
    private elementsOptions$;
    private stripe;
    private stripe$;
    constructor(stripeService: StripeService);
    ngOnInit(): void;
    getCard(): StripeElement;
}
