import WebSocket from 'ws';
import { APIOptions, BotsParams, BotsStatsParams, CurrencyParams, DealsParams, FundParams, MarketCurrencyParams, SmartTradeHistoryParams, SmartTradeParams, TransferHistoryParams, TransferParams } from './types/types';
import { Order } from './types/generated-types';
export declare class API {
    private readonly KEY;
    private readonly SECRETS;
    private readonly errorHandler?;
    private axios;
    private ws?;
    constructor(options?: APIOptions);
    private request;
    ping(): Promise<any>;
    time(): Promise<any>;
    transfer(params: TransferParams): Promise<any>;
    getTransferHistory(params: TransferHistoryParams): Promise<any>;
    getTransferData(): Promise<any>;
    addExchangeAccount(params: any): Promise<any>;
    editExchangeAccount(params: any): Promise<any>;
    getExchange(): Promise<any>;
    getMarketList(): Promise<any>;
    getMarketPairs(params?: any): Promise<any>;
    getCurrencyRate(params: CurrencyParams): Promise<any>;
    getCurrencyRateWithLeverageData(params: MarketCurrencyParams): Promise<any>;
    getActiveTradeEntities(account_id: number | string): Promise<any>;
    sellAllToUSD(account_id: number | string): Promise<any>;
    sellAllToBTC(account_id: number | string): Promise<any>;
    getBalanceChartData(account_id: number | string, params: any): Promise<any>;
    loadBalances(account_id: number | string): Promise<any>;
    renameExchangeAccount(account_id: number | string, name: string): Promise<any>;
    removeExchangeAccount(account_id: number | string): Promise<any>;
    getPieChartData(account_id: number | string): Promise<any>;
    getAccountTableData(account_id: number | string): Promise<any>;
    getAccountInfo(account_id?: number): Promise<any>;
    getLeverageData(account_id: number | string, pair: string): Promise<any>;
    changeUserMode(mode: 'paper' | 'real'): Promise<any>;
    getSmartTradeHistory(params?: SmartTradeHistoryParams): Promise<Order[]>;
    smartTrade(params: SmartTradeParams): Promise<Order>;
    getSmartTrade(id: number): Promise<Order>;
    cancelSmartTrade(id: number): Promise<Order>;
    updateSmartTrade(id: number, params: any): Promise<Order>;
    averageSmartTrade(id: number, params: FundParams): Promise<Order>;
    reduceFund(id: number, params: FundParams): Promise<Order>;
    closeSmartTrade(id: number): Promise<Order>;
    forceStartSmartTrade(id: number): Promise<Order>;
    forceProcessSmartTrade(id: number): Promise<Order>;
    setNoteSmartTrade(id: number, note: string): Promise<Order>;
    /**
     * Get the sub trades of a smart trade, including entry and take profit orders.
     *
     * @param id smart trade id
     * @returns SmartTrade Order
     */
    getSubTrade(id: number): Promise<any>;
    closeSubTrade(smartTradeId: number, subTradeId: number): Promise<any>;
    cancelSubTrade(smartTradeId: number, subTradeId: number): Promise<any>;
    /**
     * Bots methods
     */
    botCreate(params: any): Promise<any>;
    getBots(params?: BotsParams): Promise<any>;
    getBotsStats(params?: BotsStatsParams): Promise<any>;
    getBot(id: number): Promise<any>;
    getDeals(params?: DealsParams): Promise<any>;
    getDeal(id: number): Promise<any>;
    getDealSafetyOrders(id: number): Promise<any>;
    botUpdate(params: any): Promise<any>;
    botDisable(bot_id: any): Promise<any>;
    botEnable(bot_id: any): Promise<any>;
    botStartNewDeal(params: any): Promise<any>;
    botDelete(bot_id: any): Promise<any>;
    botPaniceSellAllDeals(bot_id: any): Promise<any>;
    botCancelAllDeals(bot_id: any): Promise<any>;
    botShow(bot_id: any): Promise<any>;
    customRequest(method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH', version: 1 | 2, path: string, payload?: any): Promise<any>;
    private buildIdentifier;
    private subscribe;
    subscribeSmartTrade(callback?: (data: WebSocket.Data) => void): void;
    subscribeDeal(callback?: (data: WebSocket.Data) => void): void;
    unsubscribe(): void;
    /**
     * Validate the response order is consistent with the generated type
     * Or, an error is thrown
     *
     * @param order order
     */
    validateOrderType(order: Order): Order;
}
