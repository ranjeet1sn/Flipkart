import { Observable } from 'rxjs';
import { WindowRef } from './window-ref.service';
import { LazyStripeAPILoader } from './api-loader.service';
import { StripeJS, Options } from '../interfaces/stripe';
import { Element } from '../interfaces/element';
import { Elements, ElementsOptions } from '../interfaces/elements';
import { SourceData, SourceResult, SourceParams } from '../interfaces/sources';
import { CardDataOptions, TokenResult, BankAccount, BankAccountData, PiiData, Pii } from '../interfaces/token';
import { StripeInstance } from './stripe-instance.class';
import { StripeServiceInterface } from './stripe-instance.interface';
import { PaymentRequestOptions } from '../interfaces/payment-request';
export declare class StripeService implements StripeServiceInterface {
    private platformId;
    private key;
    private options;
    private loader;
    private window;
    private stripe;
    constructor(platformId: any, key: string, options: Options, loader: LazyStripeAPILoader, window: WindowRef);
    getStripeReference(): Observable<any>;
    getInstance(): StripeJS | undefined;
    setKey(key: string, options?: Options): StripeInstance;
    changeKey(key: string, options?: Options): StripeInstance;
    elements(options?: ElementsOptions): Observable<Elements>;
    createToken(a: Element | BankAccount | Pii, b: CardDataOptions | BankAccountData | PiiData | undefined): Observable<TokenResult>;
    createSource(a: Element | SourceData, b?: SourceData | undefined): Observable<SourceResult>;
    retrieveSource(source: SourceParams): Observable<SourceResult>;
    paymentRequest(options: PaymentRequestOptions): Observable<any>;
}
